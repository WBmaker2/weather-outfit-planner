import {
  WeatherConditionId,
  WeatherMission,
  weatherConditions,
  getItemLabel,
} from '../game/weatherOutfit'
import ItemIllustration from './ItemIllustration'

type TeacherWeatherBuilderProps = {
  selectedConditionIds: WeatherConditionId[]
  previewMission: WeatherMission | null
  onToggleCondition: (conditionId: WeatherConditionId) => void
  onCreateMission: () => void
}

function PreviewItems({ title, itemIds }: { title: string; itemIds: string[] }) {
  if (itemIds.length === 0) {
    return null
  }

  return (
    <div className="teacher-weather-preview-group">
      <h3>{title}</h3>
      <ul className="teacher-weather-preview-items">
        {itemIds.map((itemId) => (
          <li key={itemId}>
            <span className="teacher-weather-item-icon" aria-hidden="true">
              <ItemIllustration itemId={itemId} />
            </span>
            <span>{getItemLabel(itemId)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TeacherWeatherBuilder({
  selectedConditionIds,
  previewMission,
  onToggleCondition,
  onCreateMission,
}: TeacherWeatherBuilderProps) {
  return (
    <section className="teacher-weather-builder" aria-labelledby="teacher-weather-title">
      <div className="teacher-weather-header">
        <div>
          <p className="teacher-weather-eyebrow">교사용 도구</p>
          <h2 id="teacher-weather-title">오늘의 날씨 만들기</h2>
        </div>
        <button
          type="button"
          className="teacher-weather-create"
          onClick={onCreateMission}
          disabled={!previewMission}
        >
          미션 만들기
        </button>
      </div>

      <div className="weather-condition-grid" aria-label="날씨 조건 선택">
        {weatherConditions.map((condition) => {
          const isSelected = selectedConditionIds.includes(condition.id)

          return (
            <button
              key={condition.id}
              type="button"
              className="weather-condition-toggle"
              aria-pressed={isSelected}
              onClick={() => {
                onToggleCondition(condition.id)
              }}
            >
              <span className="weather-condition-icon" aria-hidden="true">
                {condition.icon}
              </span>
              <span className="weather-condition-copy">
                <span className="weather-condition-label">{condition.label}</span>
                <span className="weather-condition-description">{condition.description}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="teacher-weather-preview" aria-live="polite">
        {previewMission ? (
          <>
            <div className="teacher-weather-preview-title">
              <p>미리보기</p>
              <strong>{previewMission.title}</strong>
            </div>
            <PreviewItems title="필요한 준비물" itemIds={previewMission.requiredItemIds} />
            <PreviewItems title="다시 볼 물건" itemIds={previewMission.unsuitableItemIds} />
          </>
        ) : (
          <p className="teacher-weather-empty">
            비, 바람, 더움, 먼지 중 하나 이상을 골라 오늘의 날씨 미션을 만들 수 있어요.
          </p>
        )}
      </div>
    </section>
  )
}
