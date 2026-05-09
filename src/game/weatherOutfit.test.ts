import { describe, expect, it } from 'vitest'
import {
  buildCustomWeatherMission,
  getItemLabel,
  getMissionChecklist,
  missions,
  scoreOutfit,
} from './weatherOutfit'

describe('scoreOutfit', () => {
  it('passes rainy windy weather when umbrella, rain boots, and windbreaker are selected', () => {
    const mission = missions.find((item) => item.id === 'rain-wind')

    expect(mission).toBeDefined()
    expect(scoreOutfit(mission!, ['umbrella', 'rain-boots', 'windbreaker'])).toEqual({
      passed: true,
      missingItemIds: [],
      unsuitableItemIds: [],
      message: '완벽한 외출 준비 끝!',
    })
  })

  it('reports missing required items with child-friendly guidance', () => {
    const mission = missions.find((item) => item.id === 'rain-wind')
    const result = scoreOutfit(mission!, ['umbrella'])

    expect(result.passed).toBe(false)
    expect(result.missingItemIds).toEqual(['rain-boots', 'windbreaker'])
    expect(result.message).toContain('장화는 발이 젖지 않아요.')
    expect(result.message).toContain('바람막이는 찬 바람을 막아요.')
  })

  it('reports unsuitable items for hot sunny weather', () => {
    const mission = missions.find((item) => item.id === 'sunny-hot')
    const result = scoreOutfit(mission!, ['cap', 'short-sleeve', 'water-bottle', 'padded-coat'])

    expect(result.passed).toBe(false)
    expect(result.unsuitableItemIds).toEqual(['padded-coat'])
    expect(result.message).toBe('패딩은 오늘 날씨와 맞지 않아요.')
    expect(result.message).not.toContain('패딩는')
    expect(result.message).not.toContain('을/를')
    expect(result.message).not.toContain('은/는')
  })

  it('uses natural particle for scarf in sunny-hot mismatch', () => {
    const mission = missions.find((item) => item.id === 'sunny-hot')
    const result = scoreOutfit(mission!, ['cap', 'short-sleeve', 'water-bottle', 'scarf'])

    expect(result.passed).toBe(false)
    expect(result.unsuitableItemIds).toEqual(['scarf'])
    expect(result.message).toBe('목도리는 오늘 날씨와 맞지 않아요.')
    expect(result.message).not.toContain('목도리은')
    expect(result.message).toContain('목도리')
  })

  it('uses natural sentence shapes for both missing and unsuitable items together', () => {
    const mission = missions.find((item) => item.id === 'rain-wind')
    const result = scoreOutfit(mission!, ['sandals', 'short-sleeve'])

    expect(result.passed).toBe(false)
    expect(result.message).toContain('우산은 비를 피할 수 있어요.')
    expect(result.message).toContain('장화는 발이 젖지 않아요.')
    expect(result.message).toContain('바람막이는 찬 바람을 막아요.')
    expect(result.message).toContain('샌들, 반팔은 오늘 날씨와 맞지 않아요.')
  })
})

describe('getItemLabel', () => {
  it('returns the Korean label for known item ids', () => {
    expect(getItemLabel('umbrella')).toBe('우산')
  })
})

describe('getMissionChecklist', () => {
  it('marks required rainy mission items as complete or missing in real time', () => {
    const mission = missions.find((item) => item.id === 'rain-wind')
    const checklist = getMissionChecklist(mission!, ['umbrella'])

    expect(checklist.requiredItems).toEqual([
      { itemId: 'umbrella', label: '우산', status: 'complete' },
      { itemId: 'rain-boots', label: '장화', status: 'missing' },
      { itemId: 'windbreaker', label: '바람막이', status: 'missing' },
    ])
  })

  it('lists selected unsuitable items separately', () => {
    const mission = missions.find((item) => item.id === 'rain-wind')
    const checklist = getMissionChecklist(mission!, ['sandals'])

    expect(checklist.unsuitableItems).toEqual([
      { itemId: 'sandals', label: '샌들', status: 'complete' },
    ])
  })
})

describe('buildCustomWeatherMission', () => {
  it('returns null when no teacher weather condition is selected', () => {
    expect(buildCustomWeatherMission([])).toBeNull()
  })

  it('combines rain, wind, heat, and dust into one teacher mission without duplicates', () => {
    const mission = buildCustomWeatherMission(['rain', 'wind', 'heat', 'dust'])

    expect(mission).toMatchObject({
      id: 'teacher-custom-rain-wind-heat-dust',
      title: '오늘의 날씨: 비, 바람, 더움, 먼지 조건이 있어요',
      requiredItemIds: [
        'umbrella',
        'rain-boots',
        'windbreaker',
        'cap',
        'short-sleeve',
        'water-bottle',
        'mask',
        'light-jacket',
      ],
      unsuitableItemIds: ['sandals', 'padded-coat', 'scarf', 'gloves'],
    })
    expect(mission?.lessonRule).toContain('필요한 준비물: 우산, 장화, 바람막이')
    expect(mission?.lessonRule).not.toContain('을/를')
    expect(mission?.discussionQuestions).toHaveLength(3)
  })
})
