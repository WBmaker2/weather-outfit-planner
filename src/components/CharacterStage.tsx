import type { DragEvent } from 'react'
import type { OutfitItem } from '../game/weatherOutfit'

type CharacterStageProps = {
  wornItems: OutfitItem[]
  onDropItem: (itemId: string) => void
  onRemoveItem: (itemId: string) => void
}

export default function CharacterStage({
  wornItems,
  onDropItem,
  onRemoveItem,
}: CharacterStageProps) {
  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    const droppedItemId = event.dataTransfer.getData('text/plain')

    if (droppedItemId) {
      onDropItem(droppedItemId)
    }
  }

  return (
    <section
      className="character-stage"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="character-area" aria-label="도착 준비 중인 귀여운 캐릭터">
        <p role="img" aria-label="미소짓는 캐릭터" className="character-avatar">
          (•ᴗ•)
        </p>
        <p className="character-hint">
          드래그해서 캐릭터에 옷과 준비물을 올려주세요.
        </p>
      </div>

      <div className="stage-items">
        {wornItems.length === 0 ? (
          <p className="empty-prompt">아직 아무것도 입지 않았어요. 옷을 챙겨보세요.</p>
        ) : (
          wornItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="worn-item-chip"
              aria-label={`${item.label} 빼기`}
              onClick={() => {
                onRemoveItem(item.id)
              }}
            >
              {item.icon} {item.label} 빼기
            </button>
          ))
        )}
      </div>
    </section>
  )
}
