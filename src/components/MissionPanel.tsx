import type { WeatherMission } from '../game/weatherOutfit'

type MissionPanelProps = {
  missions: WeatherMission[]
  activeMissionId: string
  onMissionChange: (missionId: string) => void
}

export default function MissionPanel({
  missions,
  activeMissionId,
  onMissionChange,
}: MissionPanelProps) {
  const activeMission =
    missions.find((mission) => mission.id === activeMissionId) ?? missions[0]

  if (!activeMission) {
    return null
  }

  return (
    <section className="mission-panel">
      <div className="mission-weather" aria-label="현재 미션 날씨">
        <span className="weather-icon" aria-hidden="true">
          {activeMission.weatherIcon}
        </span>
        <p className="mission-subtitle">지금 챙겨야 할 날씨 미션이에요.</p>
      </div>

      <h2 className="mission-title">{activeMission.title}</h2>
      <p className="mission-description">{activeMission.description}</p>

      <label htmlFor="mission-select" className="mission-select-label">
        날씨 미션 선택
      </label>
      <select
        id="mission-select"
        value={activeMission.id}
        onChange={(event) => onMissionChange(event.target.value)}
      >
        {missions.map((mission) => (
          <option key={mission.id} value={mission.id}>
            {mission.title}
          </option>
        ))}
      </select>
    </section>
  )
}
