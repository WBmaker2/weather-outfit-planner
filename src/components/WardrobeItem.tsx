import type { OutfitItem } from '../game/weatherOutfit'
import ItemIllustration from './ItemIllustration'

type WardrobeItemProps = {
  item: OutfitItem
  isSelected: boolean
  onWear: (itemId: string) => void
}

export default function WardrobeItem({
  item,
  isSelected,
  onWear,
}: WardrobeItemProps) {
  return (
    <button
      className="wardrobe-item"
      type="button"
      aria-pressed={isSelected}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', item.id)
        event.dataTransfer.effectAllowed = 'move'
      }}
      onClick={() => {
        onWear(item.id)
      }}
    >
      <span className="wardrobe-item-icon" aria-hidden="true">
        <ItemIllustration itemId={item.id} />
      </span>
      <span>{item.label}</span>
    </button>
  )
}
