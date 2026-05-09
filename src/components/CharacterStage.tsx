import type { DragEvent } from 'react'
import type { OutfitItem } from '../game/weatherOutfit'
import ItemIllustration from './ItemIllustration'

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
      <ellipse className="avatar-shadow" cx="162" cy="335" rx="92" ry="17" />

      <g className="avatar-backpack-group" aria-hidden="true">
        <path className="avatar-backpack" d="M96 156c-16 18-22 54-15 99h41l6-93z" />
        <path className="avatar-backpack" d="M224 156c17 18 23 54 15 99h-41l-6-93z" />
        <path className="avatar-backpack-strap" d="M123 151c-11 21-16 52-16 92" />
        <path className="avatar-backpack-strap" d="M197 151c11 21 16 52 16 92" />
      </g>

      <g className="character-base">
        <path className="avatar-arm avatar-arm-left" d="M112 167c-25 18-34 45-28 78" />
        <path className="avatar-arm avatar-arm-right" d="M209 167c27 19 36 46 29 79" />
        <path className="avatar-hand" d="M79 242c11-9 24-2 24 10 0 12-12 20-23 14-9-5-10-16-1-24z" />
        <path className="avatar-hand" d="M242 242c-11-9-24-2-24 10 0 12 12 20 23 14 9-5 10-16 1-24z" />
        <path className="avatar-leg" d="M116 297h35v39h-35z" />
        <path className="avatar-leg" d="M171 297h35v39h-35z" />
        <path className="avatar-sock" d="M116 314h35v17h-35z" />
        <path className="avatar-sock" d="M171 314h35v17h-35z" />
        <path className="avatar-shoe" d="M104 328h54c7 0 12 5 12 11v3H97v-4c0-6 2-10 7-10z" />
        <path className="avatar-shoe" d="M163 339c0-6 5-11 12-11h42c5 0 8 4 8 10v4h-62v-3z" />
        <path className="avatar-neck" d="M143 116h36v42h-36z" />
        <circle className="avatar-ear" cx="105" cy="91" r="11" />
        <circle className="avatar-ear" cx="217" cy="91" r="11" />
        <circle className="avatar-head" cx="161" cy="83" r="56" />
        <path className="avatar-hair" d="M106 82c2-43 36-68 75-63 35 5 55 31 49 67-24-22-64-29-103-12-9 4-16 7-21 8z" />
        <path className="avatar-hair-pin" d="M112 67l18-10" />
        <circle className="avatar-eye" cx="141" cy="86" r="6" />
        <circle className="avatar-eye" cx="182" cy="86" r="6" />
        <circle className="avatar-eye-shine" cx="143" cy="83" r="2" />
        <circle className="avatar-eye-shine" cx="184" cy="83" r="2" />
        <circle className="avatar-cheek" cx="131" cy="103" r="7" />
        <circle className="avatar-cheek" cx="192" cy="103" r="7" />
        <path className="avatar-smile" d="M149 108c6 11 19 11 25 0" />
        <path className="avatar-shirt" d="M111 146c14-14 86-14 100 0l22 108H89l22-108z" />
        <path className="avatar-collar" d="M141 148l21 19 20-19" />
        <path className="avatar-pocket" d="M182 194h24v24h-24z" />
        <path className="avatar-heart" d="M193 202c-6-6 2-14 7-7 5-7 13 1 7 7l-7 7z" />
        <path className="avatar-shorts" d="M102 252h117l-10 56h-39l-8-38-9 38h-39l-12-56z" />
      </g>

      {has('short-sleeve') && !hasLayeredTop ? (
        <g className="character-layer" data-testid="character-layer-short-sleeve">
          <path className="shirt-short" d="M106 147c17-18 91-18 108 0l15 48-31 9-9-33h-56l-9 33-32-9z" />
          <path className="shirt-short-body" d="M125 166h70l17 88H108z" />
          <path className="shirt-heart" d="M157 203c-7-7 2-15 8-8 6-7 15 1 8 8l-8 8z" />
        </g>
      ) : null}

      {has('light-jacket') ? (
        <g className="character-layer" data-testid="character-layer-light-jacket">
          <path className="jacket-light" d="M111 146c18-15 83-15 101 0l20 109h-56l-14-76-15 76H91z" />
          <path className="jacket-light-panel" d="M116 158c14 10 29 15 46 15s33-5 47-15" />
          <path className="jacket-zip" d="M162 151v104" />
          <path className="jacket-pocket" d="M112 220h31" />
          <path className="jacket-pocket" d="M181 220h31" />
        </g>
      ) : null}

      {has('windbreaker') ? (
        <g className="character-layer" data-testid="character-layer-windbreaker">
          <path className="windbreaker" d="M106 144c21-18 92-18 113 0l25 112H77z" />
          <path className="windbreaker-panel" d="M120 153c12 10 25 15 42 15s32-5 44-15l16 92H96z" />
          <path className="windbreaker-zip" d="M162 169v84" />
          <path className="windbreaker-rainbow" d="M119 188h86" />
          <path className="windbreaker-rainbow" d="M111 215h101" />
        </g>
      ) : null}

      {has('padded-coat') ? (
        <g className="character-layer" data-testid="character-layer-padded-coat">
          <path className="padded-coat" d="M98 142c25-25 102-25 127 0l31 122H67z" />
          <path className="padded-hood" d="M125 146c11-19 62-19 74 0" />
          <path className="padded-band" d="M91 178h141" />
          <path className="padded-band" d="M82 215h160" />
          <path className="padded-band" d="M75 251h176" />
          <path className="padded-zip" d="M162 154v110" />
          <path className="padded-pocket" d="M101 238h34" />
          <path className="padded-pocket" d="M188 238h34" />
        </g>
      ) : null}

      {has('rain-boots') ? (
        <g className="character-layer" data-testid="character-layer-rain-boots">
          <path className="rain-boot" d="M107 295h47v48H95v-8c0-8 6-14 13-14z" />
          <path className="rain-boot" d="M167 295h47v26c8 0 14 6 14 14v8h-61z" />
          <path className="boot-stripe" d="M110 311h41" />
          <path className="boot-stripe" d="M170 311h41" />
          <path className="boot-heart" d="M124 323c-5-5 1-11 5-5 4-6 11 0 5 5l-5 5z" />
          <path className="boot-heart" d="M184 323c-5-5 1-11 5-5 4-6 11 0 5 5l-5 5z" />
        </g>
      ) : null}

      {has('sandals') ? (
        <g className="character-layer" data-testid="character-layer-sandals">
          <path className="sandal-sole" d="M98 337h69" />
          <path className="sandal-sole" d="M162 337h67" />
          <path className="sandal-strap" d="M119 329l30 14" />
          <path className="sandal-strap" d="M188 329l29 14" />
          <circle className="sandal-flower" cx="134" cy="333" r="4" />
          <circle className="sandal-flower" cx="202" cy="333" r="4" />
        </g>
      ) : null}

      {has('scarf') ? (
        <g className="character-layer" data-testid="character-layer-scarf">
          <path className="scarf-wrap" d="M126 126c19 14 52 14 71 0l7 22c-25 12-60 12-84 0z" />
          <path className="scarf-tail" d="M184 140c18 18 20 46 7 69l-20-10c9-20 7-37-6-51z" />
          <path className="scarf-line" d="M129 142h67" />
          <path className="scarf-line" d="M177 160l20 10" />
        </g>
      ) : null}

      {has('gloves') ? (
        <g className="character-layer" data-testid="character-layer-gloves">
          <path className="glove" d="M75 237c12-10 29-2 30 13 1 14-10 24-25 19-12-4-16-22-5-32z" />
          <path className="glove" d="M246 237c-12-10-29-2-30 13-1 14 10 24 25 19 12-4 16-22 5-32z" />
          <path className="glove-cuff" d="M77 255h25" />
          <path className="glove-cuff" d="M219 255h25" />
        </g>
      ) : null}

      {has('mask') ? (
        <g className="character-layer" data-testid="character-layer-mask">
          <path className="mask-band" d="M132 105c-13-7-18 11-1 15" />
          <path className="mask-band" d="M191 105c13-7 18 11 1 15" />
          <path className="face-mask" d="M135 99c17 13 36 13 53 0v21c-16 14-37 14-53 0z" />
          <path className="mask-line" d="M140 109h43" />
          <path className="mask-line" d="M142 116h39" />
        </g>
      ) : null}

      {has('cap') ? (
        <g className="character-layer" data-testid="character-layer-cap">
          <path className="cap-crown" d="M113 61c21-33 75-33 96 0l-8 23c-27-13-54-13-81 0z" />
          <path className="cap-brim" d="M184 75c29-7 47 2 52 16-23 6-42 2-56-11z" />
          <path className="cap-star" d="M161 54l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" />
        </g>
      ) : null}

      {has('water-bottle') ? (
        <g className="character-layer" data-testid="character-layer-water-bottle">
          <path className="water-bottle" d="M231 210h27l5 68c1 10-6 20-19 20s-20-10-19-20z" />
          <path className="water-cap" d="M235 195h19v17h-19z" />
          <path className="water-label" d="M230 244h31" />
          <path className="water-drop" d="M245 222c8 10 10 15 10 22 0 7-5 12-10 12s-10-5-10-12c0-7 2-12 10-22z" />
          <path className="water-spark" d="M270 213l8-13 8 13-8 13z" />
        </g>
      ) : null}

      {has('umbrella') ? (
        <g className="character-layer" data-testid="character-layer-umbrella">
          <path className="umbrella-stick" d="M73 124v151c0 16 27 16 27 0" />
          <path className="umbrella-top" d="M27 126c20-59 109-59 129 0-26-11-44-11-65 0-20-11-39-11-64 0z" />
          <path className="umbrella-rib" d="M91 65v61" />
          <path className="umbrella-rib" d="M54 126c8-25 20-45 37-61 18 16 30 36 38 61" />
          <path className="umbrella-heart" d="M91 91c-7-7 2-16 8-8 6-8 16 1 8 8l-8 8z" />
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
              <span className="worn-item-icon" aria-hidden="true">
                <ItemIllustration itemId={item.id} />
              </span>
              <span>{item.label} 빼기</span>
            </button>
          ))
        )}
      </div>
    </section>
  )
}
