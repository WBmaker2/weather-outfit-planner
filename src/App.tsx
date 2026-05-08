import { useState } from "react";
import {
  missions,
  outfitItems,
  scoreOutfit,
  OutfitItem,
  OutfitScore,
} from "./game/weatherOutfit";
import CharacterStage from "./components/CharacterStage";
import FeedbackDialog from "./components/FeedbackDialog";
import MissionPanel from "./components/MissionPanel";
import WardrobeItem from "./components/WardrobeItem";

function App() {
  const [activeMissionId, setActiveMissionId] = useState(missions[0]?.id ?? "");
  const [wornItemIds, setWornItemIds] = useState<string[]>([]);
  const [score, setScore] = useState<OutfitScore | null>(null);
  const [statusMessage, setStatusMessage] = useState("오늘의 날씨 미션을 시작해볼까요?");

  const activeMission = missions.find((mission) => mission.id === activeMissionId) ?? missions[0];
  const wornItems: OutfitItem[] = wornItemIds
    .map((itemId) => outfitItems.find((item) => item.id === itemId))
    .filter((item): item is OutfitItem => Boolean(item));

  const wearItem = (itemId: string) => {
    const newItem = outfitItems.find((item) => item.id === itemId);
    if (!newItem) {
      setStatusMessage("이 물건은 지금 옷장에서 찾을 수 없어요.");
      return;
    }

    setWornItemIds((prevIds) => {
      if (prevIds.includes(itemId)) {
        setStatusMessage("이미 챙긴 물건이에요.");
        return prevIds;
      }

      setStatusMessage(`${newItem.label}를 챙겼어요!`);
      setScore(null);
      return [...prevIds, itemId];
    });
  };

  const removeItem = (itemId: string) => {
    const item = outfitItems.find((wardrobeItem) => wardrobeItem.id === itemId);
    if (!item) {
      return;
    }

    setWornItemIds((prevIds) => prevIds.filter((existingId) => existingId !== itemId));
    setStatusMessage(`${item.label}를 뺐어요.`);
    setScore(null);
  };

  const changeMission = (missionId: string) => {
    setActiveMissionId(missionId);
    setWornItemIds([]);
    setScore(null);
    setStatusMessage("새로운 미션을 골랐어요. 다시 시작해볼까요?");
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

  return (
    <main className="app-shell">
      <h1>날씨 코디 게임</h1>
      <MissionPanel
        missions={missions}
        activeMissionId={activeMissionId}
        onMissionChange={changeMission}
      />

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

      <FeedbackDialog score={score} onClose={confirmFeedback} />
    </main>
  );
}

export default App;
