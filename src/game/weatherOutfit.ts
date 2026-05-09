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
  lessonRule: string
  teacherPrompt: string
  discussionQuestions: string[]
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

export type ChecklistStatus = 'complete' | 'missing'

export type MissionChecklistItem = {
  itemId: string
  label: string
  status: ChecklistStatus
}

export type MissionChecklist = {
  requiredItems: MissionChecklistItem[]
  unsuitableItems: MissionChecklistItem[]
}

export const outfitItems: OutfitItem[] = [
  { id: 'umbrella', label: '우산', icon: '☂️', category: 'supply' },
  { id: 'rain-boots', label: '장화', icon: '🥾', category: 'shoes' },
  { id: 'windbreaker', label: '바람막이', icon: '🧥', category: 'clothes' },
  { id: 'short-sleeve', label: '반팔', icon: '👕', category: 'clothes' },
  { id: 'cap', label: '모자', icon: '🧢', category: 'accessory' },
  { id: 'water-bottle', label: '물병', icon: '💧', category: 'supply' },
  { id: 'padded-coat', label: '패딩', icon: '🧥', category: 'clothes' },
  { id: 'scarf', label: '목도리', icon: '🧣', category: 'accessory' },
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
    lessonRule: '비 오는 날에는 발과 몸이 젖지 않도록 우산, 장화, 바람막이를 챙겨요.',
    teacherPrompt: '비와 바람이 함께 있으면 어떤 준비가 더 필요할까요?',
    discussionQuestions: [
      '우산과 장화는 각각 어떤 불편함을 막아줄까요?',
      '바람이 부는 날 바람막이가 필요한 까닭을 말해볼까요?',
      '비 오는 날 샌들을 신으면 어떤 일이 생길까요?',
    ],
    weatherIcon: '🌧️',
    requiredItemIds: ['umbrella', 'rain-boots', 'windbreaker'],
    unsuitableItemIds: ['sandals', 'short-sleeve'],
  },
  {
    id: 'sunny-hot',
    title: '오늘의 날씨: 햇볕이 강하고 더워요',
    description: '시원하게 입고, 햇볕과 갈증을 조심해요.',
    lessonRule: '햇볕이 강한 날에는 모자로 눈을 보호하고 물병으로 수분을 챙겨요.',
    teacherPrompt: '더운 날 오래 밖에 있으면 우리 몸에 어떤 변화가 생길까요?',
    discussionQuestions: [
      '햇볕이 강한 날 모자는 우리 몸을 어떻게 도와줄까요?',
      '물병을 챙기지 않으면 어떤 불편함이 생길까요?',
      '더운 날 패딩과 목도리가 어울리지 않는 까닭은 무엇일까요?',
    ],
    weatherIcon: '☀️',
    requiredItemIds: ['cap', 'short-sleeve', 'water-bottle'],
    unsuitableItemIds: ['padded-coat', 'scarf', 'gloves'],
  },
  {
    id: 'snow-cold',
    title: '오늘의 날씨: 눈 오고 추워요',
    description: '몸을 따뜻하게 지키고, 손과 목도 챙겨요.',
    lessonRule: '눈 오고 추운 날에는 몸, 목, 손을 따뜻하게 감싸요.',
    teacherPrompt: '추운 날 우리 몸을 따뜻하게 지키는 방법을 말해볼까요?',
    discussionQuestions: [
      '추운 날 패딩은 몸을 어떻게 보호해줄까요?',
      '목도리와 장갑 중 오늘 가장 먼저 챙기고 싶은 것은 무엇인가요?',
      '눈 오는 날 반팔을 입으면 어떤 점이 불편할까요?',
    ],
    weatherIcon: '❄️',
    requiredItemIds: ['padded-coat', 'scarf', 'gloves'],
    unsuitableItemIds: ['sandals', 'short-sleeve'],
  },
  {
    id: 'spring-dust',
    title: '오늘의 날씨: 봄바람과 먼지가 있어요',
    description: '얇은 겉옷과 마스크로 건강하게 나가요.',
    lessonRule: '봄바람과 먼지가 있는 날에는 얇은 겉옷과 마스크로 몸을 지켜요.',
    teacherPrompt: '먼지가 많은 날 숨쉬기와 옷차림은 어떻게 준비하면 좋을까요?',
    discussionQuestions: [
      '먼지가 많은 날 마스크는 왜 도움이 될까요?',
      '봄바람이 불 때 얇은 겉옷을 챙기는 까닭은 무엇일까요?',
      '패딩은 왜 오늘 날씨에는 너무 답답할 수 있을까요?',
    ],
    weatherIcon: '🌬️',
    requiredItemIds: ['light-jacket', 'mask'],
    unsuitableItemIds: ['padded-coat'],
  },
]

export function getItemLabel(itemId: string): string {
  return outfitItems.find((item) => item.id === itemId)?.label ?? itemId
}

export function getMissionChecklist(
  mission: WeatherMission,
  selectedItemIds: string[],
): MissionChecklist {
  const selected = new Set(selectedItemIds)

  return {
    requiredItems: mission.requiredItemIds.map((itemId) => ({
      itemId,
      label: getItemLabel(itemId),
      status: selected.has(itemId) ? 'complete' : 'missing',
    })),
    unsuitableItems: mission.unsuitableItemIds
      .filter((itemId) => selected.has(itemId))
      .map((itemId) => ({
        itemId,
        label: getItemLabel(itemId),
        status: 'complete',
      })),
  }
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
    const missingGuidanceMap: Record<string, string> = {
      umbrella: '우산은 비를 피할 수 있어요.',
      'rain-boots': '장화는 발이 젖지 않아요.',
      windbreaker: '바람막이는 찬 바람을 막아요.',
      'short-sleeve': '반팔은 더운 날 덜 덥고 편하게 있어요.',
      cap: '모자는 햇볕이 강할 때 눈을 가려줘요.',
      'water-bottle': '물병은 목마를 때 바로 마실 수 있어요.',
      'padded-coat': '패딩은 추위를 막고 몸을 따뜻하게 해줘요.',
      scarf: '목도리는 목이 차가워지는 걸 막아줘요.',
      gloves: '장갑은 손이 차가워질 때 따뜻하게 지켜줘요.',
      'light-jacket': '얇은 겉옷은 봄바람을 부드럽게 막아줘요.',
      mask: '마스크는 먼지를 덜 마셔요.',
    }

    messagePieces.push(
      missingItemIds
        .map((itemId) => missingGuidanceMap[itemId] ?? `${getItemLabel(itemId)}도 챙겨요.`)
        .join(' '),
    )
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
