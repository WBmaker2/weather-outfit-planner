import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const getWardrobeButtonByLabel = (label: string) =>
  screen.getByRole("button", { name: new RegExp(`${label}$`) });

const getWornItemRemoveButton = (label: string) =>
  screen.getAllByRole("button", { name: new RegExp(`${label} 빼기`) });

const getChecklist = () => screen.getByRole("region", { name: "준비물 체크리스트" });

const getChecklistItem = (label: string) =>
  within(getChecklist()).getByText(label).closest(".mission-checklist-item");

const getClassroomGuide = () => screen.getByRole("region", { name: "외출 준비 수업 흐름" });

const getClassroomStep = (label: string) =>
  within(getClassroomGuide()).getByText(label).closest(".classroom-step");

const getTeacherWeatherBuilder = () =>
  screen.getByRole("region", { name: "오늘의 날씨 만들기" });

const getWeatherConditionButton = (label: string) =>
  within(getTeacherWeatherBuilder()).getByRole("button", { name: new RegExp(label) });

describe("weather outfit planner", () => {
  it("shows the first mission and key wardrobe items on initial render", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /오늘의 날씨: 비 오고 바람이 불어요/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "옷차림이 바뀌는 초등학생 캐릭터" }),
    ).toBeInTheDocument();
    expect(getWardrobeButtonByLabel("우산")).toBeInTheDocument();
    expect(getWardrobeButtonByLabel("장화")).toBeInTheDocument();
    expect(getChecklist()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "외출하기" })).toBeInTheDocument();
  });

  it("expands the 생활 수칙 and teacher prompt for the active mission", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("생활 수칙 보기"));

    expect(
      screen.getByText("비 오는 날에는 발과 몸이 젖지 않도록 우산, 장화, 바람막이를 챙겨요."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("교사 질문: 비와 바람이 함께 있으면 어떤 준비가 더 필요할까요?"),
    ).toBeInTheDocument();
  });

  it("toggles classroom mode with an accessible pressed state", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleButton = screen.getByRole("button", { name: "수업 모드 켜기" });
    expect(toggleButton).toHaveAttribute("aria-pressed", "false");

    await user.click(toggleButton);

    expect(screen.getByRole("button", { name: "수업 모드 끄기" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("수업 모드가 켜졌어요.");
  });

  it("shows classroom lesson flow and discussion cards only in classroom mode", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByRole("region", { name: "외출 준비 수업 흐름" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "수업 모드 켜기" }));

    expect(getClassroomGuide()).toHaveTextContent("1/4");
    expect(screen.getByRole("progressbar", { name: "수업 흐름 진행률" })).toHaveAttribute(
      "aria-valuenow",
      "1",
    );
    expect(getClassroomStep("날씨 읽기")).toHaveTextContent("완료");
    expect(getClassroomStep("옷과 준비물 고르기")).toHaveTextContent("지금");
    expect(getClassroomStep("체크리스트 확인")).toHaveTextContent("다음");
    expect(getClassroomStep("외출하기")).toHaveTextContent("다음");
    expect(getClassroomGuide()).toHaveTextContent("학생 발표 질문");
    expect(getClassroomGuide()).toHaveTextContent("우산과 장화는 각각 어떤 불편함을 막아줄까요?");
  });

  it("updates classroom progress as the outfit becomes ready", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "수업 모드 켜기" }));
    await user.click(getWardrobeButtonByLabel("우산"));

    expect(getClassroomGuide()).toHaveTextContent("2/4");
    expect(screen.getByRole("progressbar", { name: "수업 흐름 진행률" })).toHaveAttribute(
      "aria-valuenow",
      "2",
    );
    expect(getClassroomStep("옷과 준비물 고르기")).toHaveTextContent("완료");
    expect(getClassroomStep("체크리스트 확인")).toHaveTextContent("지금");

    await user.click(getWardrobeButtonByLabel("장화"));
    await user.click(getWardrobeButtonByLabel("바람막이"));

    expect(getClassroomGuide()).toHaveTextContent("3/4");
    expect(screen.getByRole("progressbar", { name: "수업 흐름 진행률" })).toHaveAttribute(
      "aria-valuenow",
      "3",
    );
    expect(getClassroomStep("체크리스트 확인")).toHaveTextContent("완료");
    expect(getClassroomStep("외출하기")).toHaveTextContent("지금");

    await user.click(screen.getByRole("button", { name: "외출하기" }));

    expect(await screen.findByRole("dialog", { name: "잘했어요!" })).toBeInTheDocument();
    expect(getClassroomGuide()).toHaveTextContent("4/4");
    expect(getClassroomStep("외출하기")).toHaveTextContent("완료");
  });

  it("lets teachers build a custom today weather mission from combined conditions", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByRole("region", { name: "오늘의 날씨 만들기" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "수업 모드 켜기" }));

    const teacherBuilder = getTeacherWeatherBuilder();
    const createButton = within(teacherBuilder).getByRole("button", { name: "미션 만들기" });
    expect(createButton).toBeDisabled();

    await user.click(getWeatherConditionButton("비"));
    await user.click(getWeatherConditionButton("먼지"));

    expect(createButton).toBeEnabled();
    expect(teacherBuilder).toHaveTextContent("오늘의 날씨: 비, 먼지 조건이 있어요");
    expect(teacherBuilder).toHaveTextContent("우산");
    expect(teacherBuilder).toHaveTextContent("장화");
    expect(teacherBuilder).toHaveTextContent("마스크");
    expect(teacherBuilder).toHaveTextContent("얇은 겉옷");

    await user.click(createButton);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "오늘의 날씨: 비, 먼지 조건이 있어요",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "교사용 오늘의 날씨 미션을 만들었어요.",
    );
    expect(getChecklist()).toHaveTextContent("0/4");
    expect(getChecklistItem("우산")).toHaveTextContent("아직");
    expect(getChecklistItem("마스크")).toHaveTextContent("아직");
    expect(within(getChecklist()).queryByText("바람막이")).not.toBeInTheDocument();
  });

  it("updates the character outfit layers as items are selected and removed", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByTestId("character-layer-umbrella")).not.toBeInTheDocument();
    expect(screen.queryByTestId("character-layer-rain-boots")).not.toBeInTheDocument();
    expect(screen.queryByTestId("character-layer-windbreaker")).not.toBeInTheDocument();

    await user.click(getWardrobeButtonByLabel("우산"));
    await user.click(getWardrobeButtonByLabel("장화"));
    await user.click(getWardrobeButtonByLabel("바람막이"));

    expect(screen.getByTestId("character-layer-umbrella")).toBeInTheDocument();
    expect(screen.getByTestId("character-layer-rain-boots")).toBeInTheDocument();
    expect(screen.getByTestId("character-layer-windbreaker")).toBeInTheDocument();

    await user.click(getWardrobeButtonByLabel("우산"));

    expect(screen.queryByTestId("character-layer-umbrella")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /우산 빼기/ })).not.toBeInTheDocument();
    expect(screen.getByTestId("character-layer-rain-boots")).toBeInTheDocument();
    expect(screen.getByTestId("character-layer-windbreaker")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("우산 해제 완료.");
  });

  it("updates the pre-outing checklist while students select items", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(getChecklistItem("우산")).toHaveTextContent("아직");
    expect(getChecklistItem("장화")).toHaveTextContent("아직");
    expect(getChecklistItem("바람막이")).toHaveTextContent("아직");
    expect(getChecklist()).toHaveTextContent("0/3");

    await user.click(getWardrobeButtonByLabel("우산"));
    await user.click(getWardrobeButtonByLabel("장화"));

    expect(getChecklistItem("우산")).toHaveTextContent("완료");
    expect(getChecklistItem("장화")).toHaveTextContent("완료");
    expect(getChecklistItem("바람막이")).toHaveTextContent("아직");
    expect(getChecklist()).toHaveTextContent("2/3");

    await user.click(getWardrobeButtonByLabel("샌들"));

    expect(getChecklist()).toHaveTextContent("다시 볼 물건");
    expect(getChecklist()).toHaveTextContent("샌들 빼기");
  });

  it("uses custom item illustrations without changing accessible button names", async () => {
    const user = userEvent.setup();
    render(<App />);

    const umbrellaButton = screen.getByRole("button", { name: "우산" });
    expect(umbrellaButton.querySelector(".item-illustration")).toBeInTheDocument();

    await user.click(umbrellaButton);

    const wornUmbrellaButton = screen.getByRole("button", { name: "우산 빼기" });
    expect(wornUmbrellaButton.querySelector(".item-illustration")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "우산" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("passes rainy mission when umbrella, boots, and windbreaker are selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    await user.click(getWardrobeButtonByLabel("장화"));
    await user.click(getWardrobeButtonByLabel("바람막이"));

    await user.click(screen.getByRole("button", { name: "외출하기" }));

    const dialog = await screen.findByRole("dialog", { name: "잘했어요!" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("완벽한 외출 준비 끝!")).toBeInTheDocument();

    const confirmButton = await screen.findByRole("button", { name: "확인" });
    expect(document.activeElement).toBe(confirmButton);
  });

  it("retries the same mission from the feedback dialog", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    await user.click(getWardrobeButtonByLabel("장화"));
    await user.click(getWardrobeButtonByLabel("바람막이"));
    await user.click(screen.getByRole("button", { name: "외출하기" }));

    await screen.findByRole("dialog", { name: "잘했어요!" });
    await user.click(screen.getByRole("button", { name: "다시 도전" }));

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /오늘의 날씨: 비 오고 바람이 불어요/,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /우산 빼기/ })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("같은 미션으로 다시 도전해요.");
  });

  it("keeps focus inside dialog and restores it when pressing Escape", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    await user.click(getWardrobeButtonByLabel("장화"));
    await user.click(getWardrobeButtonByLabel("바람막이"));

    const checkButton = screen.getByRole("button", { name: "외출하기" });
    checkButton.focus();

    await user.click(checkButton);
    const confirmButton = await screen.findByRole("button", { name: "확인" });
    const retryButton = await screen.findByRole("button", { name: "다시 도전" });
    expect(document.activeElement).toBe(confirmButton);

    await user.keyboard("{Tab}");
    expect(document.activeElement).toBe(retryButton);

    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(document.activeElement).toBe(confirmButton);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(checkButton);
  });

  it("guides missing required items for rainy mission when incomplete", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    await user.click(screen.getByRole("button", { name: "외출하기" }));

    const dialog = await screen.findByRole("dialog", { name: "다시 챙겨 볼까요?" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/장화는 발이 젖지 않아요\./)).toBeInTheDocument();
    expect(within(dialog).getByText(/바람막이는 찬 바람을 막아요\./)).toBeInTheDocument();
  });

  it("uses safe Korean wording in wearable status messages", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    expect(screen.getByRole("status")).toHaveTextContent("우산 챙기기 완료!");
    expect(screen.getByRole("status")).not.toHaveTextContent("우산를");

    const wornUmbrellaButton = getWornItemRemoveButton("우산");
    await user.click(wornUmbrellaButton[0]);
    expect(screen.getByRole("status")).toHaveTextContent("우산 다시 빼기 완료.");
    expect(screen.getByRole("status")).not.toHaveTextContent("우산를");

    await user.click(getWardrobeButtonByLabel("장갑"));
    expect(screen.getByRole("status")).toHaveTextContent("장갑 챙기기 완료!");
    expect(screen.getByRole("status")).not.toHaveTextContent("장갑를");
  });

  it("resets worn items when mission changes to sunny-hot", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    expect(screen.getByRole("button", { name: /우산 빼기/ })).toBeInTheDocument();

    const missionSelect = screen.getByRole("combobox", { name: "날씨 미션 선택" });
    await user.selectOptions(missionSelect, "sunny-hot");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /오늘의 날씨: 햇볕이 강하고 더워요/,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /우산 빼기/ })).not.toBeInTheDocument();
    expect(
      screen.getByText("아직 아무것도 입지 않았어요. 옷을 챙겨보세요."),
    ).toBeInTheDocument();
    expect(getChecklistItem("모자")).toHaveTextContent("아직");
    expect(getChecklistItem("반팔")).toHaveTextContent("아직");
    expect(getChecklistItem("물병")).toHaveTextContent("아직");
    expect(within(getChecklist()).queryByText("우산")).not.toBeInTheDocument();
  });

  it("toggles an item off when the same wardrobe button is clicked twice", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    expect(getWornItemRemoveButton("우산")).toHaveLength(1);
    expect(screen.getByTestId("character-layer-umbrella")).toBeInTheDocument();

    await user.click(getWardrobeButtonByLabel("우산"));

    expect(screen.queryByRole("button", { name: /우산 빼기/ })).not.toBeInTheDocument();
    expect(screen.queryByTestId("character-layer-umbrella")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "우산" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("우산 해제 완료.");
  });
});
