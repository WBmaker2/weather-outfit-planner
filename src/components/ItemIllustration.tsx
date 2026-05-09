import type { ReactNode } from 'react'

type ItemIllustrationProps = {
  itemId: string
  className?: string
}

const artworkByItemId: Record<string, ReactNode> = {
  umbrella: (
    <>
      <path className="item-shadow" d="M13 51c8 4 30 4 38 0" />
      <path className="item-stroke item-wood" d="M31 25v24c0 6 9 6 9 0" />
      <path className="item-stroke item-umbrella-canopy" d="M9 28c7-23 39-23 46 0-9-5-15-5-23 0-8-5-15-5-23 0z" />
      <path className="item-stroke item-umbrella-panel" d="M32 8v20" />
      <path className="item-line item-light" d="M20 28c3-9 7-15 12-20 5 5 9 11 12 20" />
      <circle className="item-spark" cx="47" cy="16" r="3" />
    </>
  ),
  'rain-boots': (
    <>
      <path className="item-shadow" d="M12 52c8 4 32 4 41 0" />
      <path className="item-stroke item-boot" d="M14 15h16v27h7c4 0 7 3 7 7v4H14z" />
      <path className="item-stroke item-boot item-boot-pair" d="M35 13h16v29h4c4 0 7 3 7 7v4H35z" />
      <path className="item-line item-light" d="M17 28h12" />
      <path className="item-line item-light" d="M38 28h12" />
      <path className="item-heart" d="M23 39c-5-4 1-10 5-5 4-5 10 1 5 5l-5 5z" />
    </>
  ),
  windbreaker: (
    <>
      <path className="item-shadow" d="M16 52c8 4 25 4 33 0" />
      <path className="item-stroke item-windbreaker" d="M19 17c6-6 20-6 26 0l8 33H11z" />
      <path className="item-stroke item-windbreaker-panel" d="M23 19c4 5 8 7 13 7s10-2 14-7l4 29H10l5-29z" />
      <path className="item-line item-deep" d="M32 27v22" />
      <path className="item-line item-light" d="M19 37h11" />
      <path className="item-line item-light" d="M35 37h11" />
    </>
  ),
  'short-sleeve': (
    <>
      <path className="item-shadow" d="M15 52c8 4 26 4 34 0" />
      <path className="item-stroke item-shirt" d="M18 17c4-5 23-5 28 0l9 14-10 7-4-9v22H23V29l-5 9-10-7z" />
      <path className="item-line item-light" d="M26 20c4 4 9 4 13 0" />
      <path className="item-heart" d="M34 35c-4-4 1-9 4-5 3-4 8 1 4 5l-4 4z" />
    </>
  ),
  cap: (
    <>
      <path className="item-shadow" d="M14 49c8 4 31 4 39 0" />
      <path className="item-stroke item-cap" d="M14 31c3-14 31-20 39-4l-3 11c-11-7-23-7-36 0z" />
      <path className="item-stroke item-cap-brim" d="M39 33c12-4 20 0 23 7-9 3-18 1-25-4z" />
      <path className="item-line item-light" d="M20 30c7-5 17-7 27-2" />
    </>
  ),
  'water-bottle': (
    <>
      <path className="item-shadow" d="M20 54c6 3 19 3 25 0" />
      <path className="item-stroke item-water-cap" d="M25 9h15v10H25z" />
      <path className="item-stroke item-water-bottle" d="M22 19h21l4 27c1 7-4 12-14 12s-15-5-14-12z" />
      <path className="item-line item-light" d="M23 36h21" />
      <path className="item-drop" d="M33 24c6 8 8 12 8 17 0 5-4 9-8 9s-8-4-8-9c0-5 2-9 8-17z" />
    </>
  ),
  'padded-coat': (
    <>
      <path className="item-shadow" d="M15 53c8 4 30 4 38 0" />
      <path className="item-stroke item-padded" d="M17 16c7-8 23-8 30 0l8 37H9z" />
      <path className="item-line item-light" d="M15 28h34" />
      <path className="item-line item-light" d="M12 39h41" />
      <path className="item-line item-light" d="M32 18v35" />
      <path className="item-line item-deep" d="M19 48h9" />
      <path className="item-line item-deep" d="M37 48h9" />
    </>
  ),
  scarf: (
    <>
      <path className="item-shadow" d="M15 52c8 4 30 4 38 0" />
      <path className="item-stroke item-scarf" d="M15 23c11 10 25 10 36 0l4 13c-13 8-31 8-44 0z" />
      <path className="item-stroke item-scarf-tail" d="M39 33c9 8 10 18 5 26l-12-5c5-8 4-14-2-19z" />
      <path className="item-line item-light" d="M18 34h30" />
      <path className="item-line item-light" d="M38 45l10 4" />
    </>
  ),
  gloves: (
    <>
      <path className="item-shadow" d="M14 52c8 4 32 4 41 0" />
      <path className="item-stroke item-glove" d="M16 29c0-8 9-12 15-6l1 1 2-7c1-4 7-3 7 1l-1 15c-1 11-18 15-24 5z" />
      <path className="item-stroke item-glove item-glove-pair" d="M47 29c0-8-9-12-15-6l-1 1-2-7c-1-4-7-3-7 1l1 15c1 11 18 15 24 5z" />
      <path className="item-line item-light" d="M18 40h15" />
      <path className="item-line item-light" d="M31 40h15" />
    </>
  ),
  sandals: (
    <>
      <path className="item-shadow" d="M12 52c8 4 32 4 41 0" />
      <path className="item-line item-sandal" d="M10 45h22" />
      <path className="item-line item-sandal" d="M34 45h22" />
      <path className="item-line item-sandal-strap" d="M16 33l12 12" />
      <path className="item-line item-sandal-strap" d="M47 33L35 45" />
      <circle className="item-spark" cx="22" cy="31" r="3" />
      <circle className="item-spark" cx="42" cy="31" r="3" />
    </>
  ),
  mask: (
    <>
      <path className="item-shadow" d="M16 52c8 4 25 4 33 0" />
      <path className="item-line item-mask-band" d="M14 30c-9-5-9 17 0 12" />
      <path className="item-line item-mask-band" d="M50 30c9-5 9 17 0 12" />
      <path className="item-stroke item-mask" d="M15 27c10 9 24 9 34 0v18c-9 9-25 9-34 0z" />
      <path className="item-line item-muted" d="M20 34h24" />
      <path className="item-line item-muted" d="M21 41h22" />
    </>
  ),
  'light-jacket': (
    <>
      <path className="item-shadow" d="M16 52c8 4 26 4 34 0" />
      <path className="item-stroke item-light-jacket" d="M19 17c6-5 20-5 26 0l8 34H11z" />
      <path className="item-line item-light" d="M32 18v32" />
      <path className="item-line item-deep" d="M20 33h10" />
      <path className="item-line item-deep" d="M35 33h10" />
      <path className="item-heart" d="M32 24c-3-3 1-7 3-4 2-3 6 1 3 4l-3 3z" />
    </>
  ),
}

export default function ItemIllustration({
  itemId,
  className = '',
}: ItemIllustrationProps) {
  const artwork = artworkByItemId[itemId] ?? (
    <>
      <path className="item-shadow" d="M16 52c8 4 25 4 33 0" />
      <path className="item-stroke item-fallback" d="M32 10l6 15 16 1-12 10 4 16-14-8-14 8 4-16-12-10 16-1z" />
    </>
  )

  return (
    <svg
      className={`item-illustration ${className}`.trim()}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      {artwork}
    </svg>
  )
}
