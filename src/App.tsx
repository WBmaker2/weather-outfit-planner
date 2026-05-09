import { useState } from "react";
import {
  missions,
  outfitItems,
  scoreOutfit,
  OutfitItem,
  OutfitScore,
  WeatherConditionId,
  WeatherMission,
  buildCustomWeatherMission,
  getMissionChecklist,
} from "./game/weatherOutfit";
import CharacterStage from "./components/CharacterStage";
import ClassroomGuide from "./components/ClassroomGuide";
import FeedbackDialog from "./components/FeedbackDialog";
import MissionChecklist from "./components/MissionChecklist";
import MissionPanel from "./components/MissionPanel";
import TeacherWeatherBuilder from "./components/TeacherWeatherBuilder";
import WardrobeItem from "./components/WardrobeItem";

function App() {
  const [activeMissionId, setActiveMissionId] = useState(missions[0]?.id ?? "");
  const [wornItemIds, setWornItemIds] = useState<string[]>([]);
  const [score, setScore] = useState<OutfitScore | null>(null);
  const [statusMessage, setStatusMessage] = useState("오늘의 날씨 미션을 시작해볼까요?");
  const [isClassroomMode, setIsClassroomMode] = useState(false);
  const [teacherConditionIds, setTeacherConditionIds] = useState<WeatherConditionId[]>([]);
  const [customMission, setCustomMission] = useState<WeatherMission | null>(null);

  const availableMissions = customMission ? [customMission, ...missions] : missions;
  const activeMission =
    availableMissions.find((mission) => mission.id === activeMissionId) ?? availableMissions[0];
  const wornItems: OutfitItem[] = wornItemIds
    .map((itemId) => outfitItems.find((item) => item.id === itemId))
    .filter((item): item is OutfitItem => Boolean(item));
  const missionChecklist = getMissionChecklist(activeMission, wornItemIds);
  const teacherPreviewMission = buildCustomWeatherMission(teacherConditionIds);

  const wearItem = (itemId: string) => {
    const newItem = outfitItems.find((item) => item.id === itemId);
    if (!newItem) {
      setStatusMessage("이 물건은 지금 옷장에서 찾을 수 없어요.");
      return;
    }

    setScore(null);
    setWornItemIds((prevIds) => {
      if (prevIds.includes(itemId)) {
        setStatusMessage(`${newItem.label} 해제 완료.`);
        return prevIds.filter((existingId) => existingId !== itemId);
      }

      setStatusMessage(`${newItem.label} 챙기기 완료!`);
      return [...prevIds, itemId];
    });
  };

  const removeItem = (itemId: string) => {
    const item = outfitItems.find((wardrobeItem) => wardrobeItem.id === itemId);
    if (!item) {
      return;
    }

    setWornItemIds((prevIds) => prevIds.filter((existingId) => existingId !== itemId));
    setStatusMessage(`${item.label} 다시 빼기 완료.`);
    setScore(null);
  };

  const changeMission = (missionId: string) => {
    setActiveMissionId(missionId);
    setWornItemIds([]);
    setScore(null);
    setStatusMessage("새로운 미션을 골랐어요. 다시 시작해볼까요?");
  };

  const toggleTeacherCondition = (conditionId: WeatherConditionId) => {
    setTeacherConditionIds((prevIds) =>
      prevIds.includes(conditionId)
        ? prevIds.filter((existingId) => existingId !== conditionId)
        : [...prevIds, conditionId],
    );
    setScore(null);
  };

  const createTeacherMission = () => {
    if (!teacherPreviewMission) {
      setStatusMessage("날씨 조건을 먼저 골라주세요.");
      return;
    }

    setCustomMission(teacherPreviewMission);
    setActiveMissionId(teacherPreviewMission.id);
    setWornItemIds([]);
    setScore(null);
    setStatusMessage("교사용 오늘의 날씨 미션을 만들었어요.");
  };

  const checkOutfit = () => {
    if (!activeMission) {
      return;
    }
    const newScore = scoreOutfit(activeMission, wornItemIds);
    setScore(newScore);
    setStatusMessage(newScore.message);
  };

  const confirmFeedback = () => {
    setScore(null);
  };

  const retryMission = () => {
    setWornItemIds([]);
    setScore(null);
    setStatusMessage("같은 미션으로 다시 도전해요.");
  };

  const toggleClassroomMode = () => {
    setIsClassroomMode((currentMode) => {
      const nextMode = !currentMode;
      setStatusMessage(nextMode ? "수업 모드가 켜졌어요." : "수업 모드가 꺼졌어요.");
      return nextMode;
    });
  };

  return (
    <main className={`app-shell${isClassroomMode ? " is-classroom-mode" : ""}`}>
      <header className="app-header">
        <h1>날씨 코디 게임</h1>
        <button
          type="button"
          className="classroom-mode-toggle"
          aria-pressed={isClassroomMode}
          onClick={toggleClassroomMode}
        >
          {isClassroomMode ? "수업 모드 끄기" : "수업 모드 켜기"}
        </button>
      </header>
      <MissionPanel
        missions={availableMissions}
        activeMissionId={activeMissionId}
        onMissionChange={changeMission}
      />
      {isClassroomMode ? (
        <>
          <TeacherWeatherBuilder
            selectedConditionIds={teacherConditionIds}
            previewMission={teacherPreviewMission}
            onToggleCondition={toggleTeacherCondition}
            onCreateMission={createTeacherMission}
          />
          <ClassroomGuide
            mission={activeMission}
            checklist={missionChecklist}
            selectedItemCount={wornItemIds.length}
            score={score}
          />
        </>
      ) : null}
      <MissionChecklist checklist={missionChecklist} />

      <section className="game-layout">
        <CharacterStage
          wornItems={wornItems}
          onDropItem={wearItem}
          onRemoveItem={removeItem}
        />

        <aside className="wardrobe-panel">
          <h2>옷과 준비물</h2>
          <div className="wardrobe-grid">
            {outfitItems.map((item) => (
              <WardrobeItem
                key={item.id}
                item={item}
                isSelected={wornItemIds.includes(item.id)}
                onWear={wearItem}
              />
            ))}
          </div>
        </aside>
      </section>

      <section className="action-bar">
        <p role="status" aria-live="polite">
          {statusMessage}
        </p>
        <button type="button" onClick={checkOutfit}>
          외출하기
        </button>
      </section>

      <FeedbackDialog score={score} onClose={confirmFeedback} onRetry={retryMission} />
    </main>
  );
}

export default App;
