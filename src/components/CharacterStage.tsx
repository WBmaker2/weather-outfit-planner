import type { DragEvent } from 'react'
import type { OutfitItem } from '../game/weatherOutfit'

type CharacterStageProps = {
  wornItems: OutfitItem[]
  onDropItem: (itemId: string) => void
  onRemoveItem: (itemId: string) => void
}

type CharacterAvatarProps = {
  wornItems: OutfitItem[]
}

function CharacterAvatar({ wornItems }: CharacterAvatarProps) {
  const selectedItemIds = new Set(wornItems.map((item) => item.id))
  const has = (itemId: string) => selectedItemIds.has(itemId)
  const hasLayeredTop = has('windbreaker') || has('light-jacket') || has('padded-coat')

  return (
    <svg
      className="character-svg"
      viewBox="0 0 320 360"
      role="img"
      aria-label="옷차림이 바뀌는 초등학생 캐릭터"
    >
      <ellipse className="avatar-shadow" cx="162" cy="335" rx="86" ry="15" />

      <g className="character-base">
        <path className="avatar-neck" d="M143 116h36v39h-36z" />
        <circle className="avatar-head" cx="161" cy="82" r="55" />
        <path className="avatar-hair" d="M109 82c1-41 32-66 68-60 33 5 52 30 48 66-28-22-72-24-116-6z" />
        <circle className="avatar-ear" cx="106" cy="90" r="10" />
        <circle className="avatar-ear" cx="216" cy="90" r="10" />
        <circle className="avatar-eye" cx="142" cy="85" r="5" />
        <circle className="avatar-eye" cx="181" cy="85" r="5" />
        <path className="avatar-smile" d="M149 105c6 12 20 12 26 0" />
        <path className="avatar-arm avatar-arm-left" d="M111 166c-24 19-32 43-27 75" />
        <path className="avatar-arm avatar-arm-right" d="M209 166c26 20 34 45 27 76" />
        <path className="avatar-hand" d="M78 242c10-8 21-2 21 9 0 10-10 18-20 13-8-4-9-15-1-22z" />
        <path className="avatar-hand" d="M241 242c-10-8-21-2-21 9 0 10 10 18 20 13 8-4 9-15 1-22z" />
        <path className="avatar-shirt" d="M112 146c14-13 84-13 98 0l20 109H92l20-109z" />
        <path className="avatar-shorts" d="M104 252h113l-10 56h-37l-8-38-9 38h-38l-11-56z" />
        <path className="avatar-leg" d="M115 306h35v28h-35z" />
        <path className="avatar-leg" d="M171 306h35v28h-35z" />
        <path className="avatar-shoe" d="M106 328h51c6 0 11 5 11 11v3h-69v-4c0-6 2-10 7-10z" />
        <path className="avatar-shoe" d="M164 339c0-6 5-11 11-11h40c5 0 8 4 8 10v4h-59v-3z" />
      </g>

      {has('short-sleeve') && !hasLayeredTop ? (
        <g className="character-layer" data-testid="character-layer-short-sleeve">
          <path className="shirt-short" d="M107 147c16-18 89-18 106 0l15 47-30 8-9-32H132l-9 32-31-8 15-47z" />
          <path className="shirt-short-body" d="M126 166h68l17 87h-102l17-87z" />
        </g>
      ) : null}

      {has('light-jacket') ? (
        <g className="character-layer" data-testid="character-layer-light-jacket">
          <path className="jacket-light" d="M111 146c18-14 82-14 100 0l19 107h-54l-14-74-15 74H92l19-107z" />
          <path className="jacket-zip" d="M162 149v104" />
        </g>
      ) : null}

      {has('windbreaker') ? (
        <g className="character-layer" data-testid="character-layer-windbreaker">
          <path className="windbreaker" d="M106 144c21-17 91-17 112 0l24 112H78l28-112z" />
          <path className="windbreaker-panel" d="M120 153c11 10 25 15 42 15s32-5 43-15l15 92H96l24-92z" />
          <path className="windbreaker-zip" d="M162 169v83" />
        </g>
      ) : null}

      {has('padded-coat') ? (
        <g className="character-layer" data-testid="character-layer-padded-coat">
          <path className="padded-coat" d="M99 142c25-24 101-24 126 0l30 121H68l31-121z" />
          <path className="padded-band" d="M92 178h139" />
          <path className="padded-band" d="M84 215h158" />
          <path className="padded-band" d="M76 251h174" />
          <path className="padded-zip" d="M162 154v109" />
        </g>
      ) : null}

      {has('rain-boots') ? (
        <g className="character-layer" data-testid="character-layer-rain-boots">
          <path className="rain-boot" d="M108 296h45v47H95v-8c0-8 6-14 13-14z" />
          <path className="rain-boot" d="M168 296h45v25c8 0 14 6 14 14v8h-59z" />
          <path className="boot-stripe" d="M110 311h41" />
          <path className="boot-stripe" d="M170 311h41" />
        </g>
      ) : null}

      {has('sandals') ? (
        <g className="character-layer" data-testid="character-layer-sandals">
          <path className="sandal-sole" d="M98 336h68" />
          <path className="sandal-sole" d="M162 336h66" />
          <path className="sandal-strap" d="M119 329l29 13" />
          <path className="sandal-strap" d="M188 329l28 13" />
        </g>
      ) : null}

      {has('scarf') ? (
        <g className="character-layer" data-testid="character-layer-scarf">
          <path className="scarf-wrap" d="M127 126c18 14 51 14 69 0l7 21c-25 12-58 12-82 0l6-21z" />
          <path className="scarf-tail" d="M184 140c17 18 19 45 7 68l-20-10c9-19 7-36-6-50z" />
        </g>
      ) : null}

      {has('gloves') ? (
        <g className="character-layer" data-testid="character-layer-gloves">
          <path className="glove" d="M75 237c12-10 28-2 29 13 1 13-10 23-24 18-12-4-15-21-5-31z" />
          <path className="glove" d="M245 237c-12-10-28-2-29 13-1 13 10 23 24 18 12-4 15-21 5-31z" />
        </g>
      ) : null}

      {has('mask') ? (
        <g className="character-layer" data-testid="character-layer-mask">
          <path className="face-mask" d="M136 100c16 12 35 12 51 0v20c-16 14-35 14-51 0z" />
          <path className="mask-line" d="M140 110h43" />
        </g>
      ) : null}

      {has('cap') ? (
        <g className="character-layer" data-testid="character-layer-cap">
          <path className="cap-crown" d="M114 62c20-32 73-32 94 0l-7 22c-27-12-53-12-80 0z" />
          <path className="cap-brim" d="M184 75c28-6 45 2 50 16-22 5-40 1-54-11z" />
        </g>
      ) : null}

      {has('water-bottle') ? (
        <g className="character-layer" data-testid="character-layer-water-bottle">
          <path className="water-bottle" d="M231 210h26l5 67c1 10-6 19-18 19s-19-9-18-19z" />
          <path className="water-cap" d="M235 196h18v16h-18z" />
          <path className="water-label" d="M230 243h30" />
          <path className="water-spark" d="M269 213l8-13 8 13-8 13z" />
        </g>
      ) : null}

      {has('umbrella') ? (
        <g className="character-layer" data-testid="character-layer-umbrella">
          <path className="umbrella-stick" d="M73 125v150c0 16 26 16 26 0" />
          <path className="umbrella-top" d="M28 126c19-58 107-58 126 0-25-10-43-10-63 0-20-10-39-10-63 0z" />
          <path className="umbrella-rib" d="M91 66v60" />
          <path className="umbrella-rib" d="M54 126c8-25 20-45 37-60 17 15 29 35 37 60" />
        </g>
      ) : null}
    </svg>
  )
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
        <CharacterAvatar wornItems={wornItems} />
        <p className="character-hint">
          오늘 외출 준비 중이에요.
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
