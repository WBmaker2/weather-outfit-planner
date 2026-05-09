import type { MissionChecklist as MissionChecklistData } from '../game/weatherOutfit'
import ItemIllustration from './ItemIllustration'

type MissionChecklistProps = {
  checklist: MissionChecklistData
}

export default function MissionChecklist({ checklist }: MissionChecklistProps) {
  const completedCount = checklist.requiredItems.filter(
    (item) => item.status === 'complete',
  ).length
  const totalCount = checklist.requiredItems.length

  return (
    <section className="mission-checklist" aria-labelledby="mission-checklist-title">
      <div className="mission-checklist-header">
        <div>
          <p className="mission-checklist-eyebrow">외출 전 점검</p>
          <h2 id="mission-checklist-title">준비물 체크리스트</h2>
        </div>
        <p className="mission-checklist-count" aria-label={`필수 준비 ${completedCount}개 완료, 전체 ${totalCount}개`}>
          {completedCount}/{totalCount}
        </p>
      </div>

      <ul className="mission-checklist-items" aria-live="polite">
        {checklist.requiredItems.map((item) => (
          <li
            key={item.itemId}
            className={`mission-checklist-item is-${item.status}`}
          >
            <span className="checklist-item-icon" aria-hidden="true">
              <ItemIllustration itemId={item.itemId} />
            </span>
            <span className="checklist-item-label">{item.label}</span>
            <span className="checklist-item-status">
              {item.status === 'complete' ? '완료' : '아직'}
            </span>
          </li>
        ))}
      </ul>

      {checklist.unsuitableItems.length > 0 ? (
        <div className="mission-checklist-warning" role="status">
          <strong>다시 볼 물건</strong>
          <span>
            {checklist.unsuitableItems.map((item) => `${item.label} 빼기`).join(', ')}
          </span>
        </div>
      ) : null}
    </section>
  )
}
