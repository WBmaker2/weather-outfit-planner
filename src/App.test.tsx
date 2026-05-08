import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const getWardrobeButtonByLabel = (label: string) =>
  screen.getByRole("button", { name: new RegExp(`${label}$`) });

const getWornItemRemoveButton = (label: string) =>
  screen.getAllByRole("button", { name: new RegExp(`${label} 빼기`) });

describe("weather outfit planner", () => {
  it("shows the first mission and key wardrobe items on initial render", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /오늘의 날씨: 비 오고 바람이 불어요/,
      }),
    ).toBeInTheDocument();
    expect(getWardrobeButtonByLabel("우산")).toBeInTheDocument();
    expect(getWardrobeButtonByLabel("장화")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "외출하기" })).toBeInTheDocument();
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

  it("guides missing required items for rainy mission when incomplete", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    await user.click(screen.getByRole("button", { name: "외출하기" }));

    const dialog = await screen.findByRole("dialog", { name: "다시 챙겨 볼까요?" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/장화, 바람막이도 챙겨요\./)).toBeInTheDocument();
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
  });

  it("does not duplicate worn chips when the same wardrobe item is clicked twice", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getWardrobeButtonByLabel("우산"));
    await user.click(getWardrobeButtonByLabel("우산"));

    const wornUmbrellas = getWornItemRemoveButton("우산");
    expect(wornUmbrellas).toHaveLength(1);
  });
});
