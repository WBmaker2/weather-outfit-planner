export type OutfitItem = {
  id: string
  label: string
  icon: string
  category: 'clothes' | 'supply' | 'shoes' | 'accessory'
}

export type WeatherMission = {
  id: string
  title: string
  description: string
  weatherIcon: string
  requiredItemIds: string[]
  unsuitableItemIds: string[]
}

export type OutfitScore = {
  passed: boolean
  missingItemIds: string[]
  unsuitableItemIds: string[]
  message: string
}

export const outfitItems: OutfitItem[] = [
  { id: 'umbrella', label: '우산', icon: '☂️', category: 'supply' },
  { id: 'rain-boots', label: '장화', icon: '🥾', category: 'shoes' },
  { id: 'windbreaker', label: '바람막이', icon: '🧥', category: 'clothes' },
  { id: 'short-sleeve', label: '반팔', icon: '👕', category: 'clothes' },
  { id: 'cap', label: '모자', icon: '🧢', category: 'accessory' },
  { id: 'water-bottle', label: '물병', icon: '💧', category: 'supply' },
  { id: 'padded-coat', label: '패딩', icon: '🧣', category: 'clothes' },
  { id: 'scarf', label: '목도리', icon: '🧶', category: 'accessory' },
  { id: 'gloves', label: '장갑', icon: '🧤', category: 'accessory' },
  { id: 'sandals', label: '샌들', icon: '🩴', category: 'shoes' },
  { id: 'mask', label: '마스크', icon: '😷', category: 'supply' },
  { id: 'light-jacket', label: '얇은 겉옷', icon: '🥼', category: 'clothes' },
]

export const missions: WeatherMission[] = [
  {
    id: 'rain-wind',
    title: '오늘의 날씨: 비 오고 바람이 불어요',
    description: '젖지 않고, 찬 바람도 막을 준비가 필요해요.',
    weatherIcon: '🌧️',
    requiredItemIds: ['umbrella', 'rain-boots', 'windbreaker'],
    unsuitableItemIds: ['sandals', 'short-sleeve'],
  },
  {
    id: 'sunny-hot',
    title: '오늘의 날씨: 햇볕이 강하고 더워요',
    description: '시원하게 입고, 햇볕과 갈증을 조심해요.',
    weatherIcon: '☀️',
    requiredItemIds: ['cap', 'short-sleeve', 'water-bottle'],
    unsuitableItemIds: ['padded-coat', 'scarf', 'gloves'],
  },
  {
    id: 'snow-cold',
    title: '오늘의 날씨: 눈 오고 추워요',
    description: '몸을 따뜻하게 지키고, 손과 목도 챙겨요.',
    weatherIcon: '❄️',
    requiredItemIds: ['padded-coat', 'scarf', 'gloves'],
    unsuitableItemIds: ['sandals', 'short-sleeve'],
  },
  {
    id: 'spring-dust',
    title: '오늘의 날씨: 봄바람과 먼지가 있어요',
    description: '얇은 겉옷과 마스크로 건강하게 나가요.',
    weatherIcon: '🌬️',
    requiredItemIds: ['light-jacket', 'mask'],
    unsuitableItemIds: ['padded-coat'],
  },
]

export function getItemLabel(itemId: string): string {
  return outfitItems.find((item) => item.id === itemId)?.label ?? itemId
}

function getKoreanTailConsonant(label: string): boolean {
  const lastChar = label.at(-1)
  if (!lastChar) {
    return false
  }

  const code = lastChar.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) {
    return false
  }

  return ((code - 0xac00) % 28) !== 0
}

function formatUnsuitableMessage(itemLabels: string[]): string {
  const topic = itemLabels.join(', ')
  const particle = getKoreanTailConsonant(itemLabels.at(-1) ?? '') ? '은' : '는'

  return `${topic}${particle} 오늘 날씨와 맞지 않아요.`
}

export function scoreOutfit(mission: WeatherMission, selectedItemIds: string[]): OutfitScore {
  const selected = new Set(selectedItemIds)
  const missingItemIds = mission.requiredItemIds.filter((itemId) => !selected.has(itemId))
  const unsuitableItemIds = mission.unsuitableItemIds.filter((itemId) => selected.has(itemId))
  const passed = missingItemIds.length === 0 && unsuitableItemIds.length === 0

  if (passed) {
    return {
      passed,
      missingItemIds,
      unsuitableItemIds,
      message: '완벽한 외출 준비 끝!',
    }
  }

  const messagePieces: string[] = []

  if (missingItemIds.length > 0) {
    messagePieces.push(`${missingItemIds.map(getItemLabel).join(', ')}도 챙겨요.`)
  }

  if (unsuitableItemIds.length > 0) {
    messagePieces.push(formatUnsuitableMessage(unsuitableItemIds.map(getItemLabel)))
  }

  return {
    passed,
    missingItemIds,
    unsuitableItemIds,
    message: messagePieces.join(' '),
  }
}
