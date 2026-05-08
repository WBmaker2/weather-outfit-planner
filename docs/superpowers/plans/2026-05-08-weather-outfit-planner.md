# Weather Outfit Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Korean classroom drag-and-drop outfit planning game where grade 1-2 students choose weather-appropriate clothes and supplies for a cute character, then receive immediate feedback.

**Architecture:** Use a single-page Vite + React + TypeScript app with a pure scoring module separated from UI state. The UI keeps the current mission, worn item IDs, feedback message, and drag state in React state; all weather rules live in `src/game/weatherOutfit.ts` so scoring can be tested without the browser.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, Playwright, plain CSS, browser local state only.

---

## Current Workspace Notes

- Workspace: `/Users/kimhongnyeon/Dev/codex/weather-outfit-planner`
- Current state: implementation completed. This plan is preserved as the initial execution plan and should not be used as the live source of truth for reimplementation.
- Final source of truth after execution: current committed source files, tests, and `README.md`.
- Post-review fixes changed several details from this original plan: modal overlay/focus behavior, item-specific reason feedback, natural Korean status messages, e2e current-source verification, and favicon/browser QA hygiene.
- User-facing language: Korean 존대말 is not needed inside student UI; student UI should use friendly Korean classroom copy.
- If subagents are used later, AGENTS.md instruction applies: worker subagents should use `GPT-5.3-Codex-Spark` when available; orchestrator and review stay on the main model.

## Completion Addendum

This document records the implementation plan used to build version `0.1.0`. It is not a patch script. Later review fixes intentionally supersede snippets below where they differ from the repository:

- Scoring feedback now explains why missing items matter instead of only listing labels.
- Student-facing status messages avoid placeholder particles and fixed object particles.
- Feedback is rendered inside a real blocking overlay with focus management.
- `npm test` and `npm run test:e2e` no longer pass when tests are missing.
- Playwright rebuilds before preview and does not reuse an already-running preview server.

## Product Scope

The first version should be a complete classroom activity, not a landing page.

- Student sees a mission such as `오늘의 날씨: 비 오고 바람이 불어요`.
- Student drags or taps items from the wardrobe to the character.
- Student can remove worn items before checking.
- Student presses `외출하기`.
- App checks required and unsuitable items for the current weather.
- Success shows `완벽한 외출 준비 끝!`.
- Partial or incorrect outfit gives kind, specific guidance such as `장화를 챙기면 발이 젖지 않아요.`
- Teacher can switch weather missions for repeated play.
- Works on desktop and tablet-sized screens.
- No login, server, AI API, or student data storage in version 1.

## File Structure

Create this structure:

```text
/Users/kimhongnyeon/Dev/codex/weather-outfit-planner
├── README.md
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── playwright.config.ts
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── setupTests.ts
│   ├── vite-env.d.ts
│   ├── components
│   │   ├── CharacterStage.tsx
│   │   ├── FeedbackDialog.tsx
│   │   ├── MissionPanel.tsx
│   │   └── WardrobeItem.tsx
│   └── game
│       ├── weatherOutfit.test.ts
│       └── weatherOutfit.ts
└── tests
    └── weather-outfit.spec.ts
```

Responsibilities:

- `src/game/weatherOutfit.ts`: item catalog, mission catalog, scoring function, pure helper functions.
- `src/game/weatherOutfit.test.ts`: unit tests for weather rules.
- `src/App.tsx`: top-level state, drag/drop handlers, mission switching, check action.
- `src/components/MissionPanel.tsx`: mission title, weather badges, mission selector.
- `src/components/CharacterStage.tsx`: character drop zone and worn items.
- `src/components/WardrobeItem.tsx`: draggable/clickable wardrobe item card.
- `src/components/FeedbackDialog.tsx`: success and guidance feedback.
- `src/App.test.tsx`: user-level component tests.
- `tests/weather-outfit.spec.ts`: Playwright smoke test against built preview.
- `README.md`: classroom purpose, run commands, verification checklist.

---

## Task 1: Project Scaffold and Tooling

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`
- Create: `src/setupTests.ts`

- [ ] **Step 1: Initialize git if the folder is still not a repository**

Run:

```bash
git status --short --branch
```

Expected if not initialized:

```text
fatal: not a git repository (or any of the parent directories): .git
```

Then run:

```bash
git init
```

Expected:

```text
Initialized empty Git repository
```

- [ ] **Step 2: Create npm project files**

Create `package.json`:

```json
{
  "name": "weather-outfit-planner",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.2.0",
    "@testing-library/user-event": "^14.6.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "jsdom": "^26.0.0",
    "typescript": "^5.8.0",
    "vite": "^7.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

If the environment reports a Rolldown or native binding error, retry with:

```bash
PATH=/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin npm install
```

Expected:

```text
added
```

- [ ] **Step 4: Add Vite and TypeScript config**

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
    pool: 'forks',
  },
})
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts", "playwright.config.ts"]
}
```

- [ ] **Step 5: Add HTML and React entrypoint**

Create `index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="초등 1~2학년 통합교과 날씨와 계절 옷차림 드래그 앤 드롭 게임"
    />
    <title>오늘의 날씨 코디네이터: 사계절 옷장</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

Create `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 6: Add temporary App so the scaffold builds**

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <h1>오늘의 날씨 코디네이터</h1>
      <p>사계절 옷장을 준비하고 있어요.</p>
    </main>
  )
}
```

Create `src/App.css`:

```css
:root {
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  color: #18212f;
  background: #f6f8fb;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

button,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}
```

- [ ] **Step 7: Verify scaffold**

Run:

```bash
npm run build
```

Expected:

```text
✓ built
```

- [ ] **Step 8: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json src
git commit -m "chore: scaffold weather outfit planner"
```

Expected:

```text
[main
```

---

## Task 2: Weather Mission Rules and Scoring

**Files:**
- Create: `src/game/weatherOutfit.ts`
- Create: `src/game/weatherOutfit.test.ts`

- [ ] **Step 1: Write failing tests for outfit scoring**

Create `src/game/weatherOutfit.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getItemLabel, missions, scoreOutfit } from './weatherOutfit'

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
    expect(result.message).toContain('장화')
    expect(result.message).toContain('바람막이')
  })

  it('reports unsuitable items for hot sunny weather', () => {
    const mission = missions.find((item) => item.id === 'sunny-hot')
    const result = scoreOutfit(mission!, ['cap', 'water-bottle', 'padded-coat'])

    expect(result.passed).toBe(false)
    expect(result.unsuitableItemIds).toEqual(['padded-coat'])
    expect(result.message).toContain('패딩')
  })
})

describe('getItemLabel', () => {
  it('returns the Korean label for known item ids', () => {
    expect(getItemLabel('umbrella')).toBe('우산')
  })
})
```

- [ ] **Step 2: Run unit tests and verify they fail**

Run:

```bash
npm test -- src/game/weatherOutfit.test.ts
```

Expected:

```text
FAIL
Cannot find module './weatherOutfit'
```

- [ ] **Step 3: Implement mission catalog and scoring**

Create `src/game/weatherOutfit.ts`:

```ts
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

  const guidance: string[] = []

  if (missingItemIds.length > 0) {
    guidance.push(`${missingItemIds.map(getItemLabel).join(', ')}을/를 더 챙겨요.`)
  }

  if (unsuitableItemIds.length > 0) {
    guidance.push(`${unsuitableItemIds.map(getItemLabel).join(', ')}은/는 오늘 날씨와 맞지 않아요.`)
  }

  return {
    passed,
    missingItemIds,
    unsuitableItemIds,
    message: guidance.join(' '),
  }
}
```

- [ ] **Step 4: Run unit tests and verify they pass**

Run:

```bash
npm test -- src/game/weatherOutfit.test.ts
```

Expected:

```text
PASS src/game/weatherOutfit.test.ts
```

- [ ] **Step 5: Commit scoring rules**

Run:

```bash
git add src/game/weatherOutfit.ts src/game/weatherOutfit.test.ts
git commit -m "feat: add weather outfit scoring rules"
```

Expected:

```text
[main
```

---

## Task 3: Interactive Outfit Game UI

**Files:**
- Create: `src/components/MissionPanel.tsx`
- Create: `src/components/CharacterStage.tsx`
- Create: `src/components/WardrobeItem.tsx`
- Create: `src/components/FeedbackDialog.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create mission panel**

Create `src/components/MissionPanel.tsx`:

```tsx
import type { WeatherMission } from '../game/weatherOutfit'

type MissionPanelProps = {
  missions: WeatherMission[]
  activeMission: WeatherMission
  onMissionChange: (missionId: string) => void
}

export function MissionPanel({ missions, activeMission, onMissionChange }: MissionPanelProps) {
  return (
    <section className="mission-panel" aria-labelledby="mission-title">
      <div className="mission-weather-icon" aria-hidden="true">
        {activeMission.weatherIcon}
      </div>
      <div>
        <p className="eyebrow">통합교과 날씨 미션</p>
        <h1 id="mission-title">{activeMission.title}</h1>
        <p>{activeMission.description}</p>
      </div>
      <label className="mission-selector">
        <span>날씨 바꾸기</span>
        <select
          value={activeMission.id}
          onChange={(event) => onMissionChange(event.target.value)}
          aria-label="날씨 미션 선택"
        >
          {missions.map((mission) => (
            <option key={mission.id} value={mission.id}>
              {mission.title.replace('오늘의 날씨: ', '')}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}
```

- [ ] **Step 2: Create wardrobe item button with drag support**

Create `src/components/WardrobeItem.tsx`:

```tsx
import type { OutfitItem } from '../game/weatherOutfit'

type WardrobeItemProps = {
  item: OutfitItem
  isSelected: boolean
  onWear: (itemId: string) => void
}

export function WardrobeItem({ item, isSelected, onWear }: WardrobeItemProps) {
  return (
    <button
      className={`wardrobe-item ${isSelected ? 'is-selected' : ''}`}
      type="button"
      draggable
      onClick={() => onWear(item.id)}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', item.id)
        event.dataTransfer.effectAllowed = 'copy'
      }}
      aria-pressed={isSelected}
    >
      <span className="item-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span>{item.label}</span>
    </button>
  )
}
```

- [ ] **Step 3: Create character drop zone**

Create `src/components/CharacterStage.tsx`:

```tsx
import type { OutfitItem } from '../game/weatherOutfit'

type CharacterStageProps = {
  wornItems: OutfitItem[]
  onDropItem: (itemId: string) => void
  onRemoveItem: (itemId: string) => void
}

export function CharacterStage({ wornItems, onDropItem, onRemoveItem }: CharacterStageProps) {
  return (
    <section
      className="character-stage"
      aria-labelledby="character-title"
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
      }}
      onDrop={(event) => {
        event.preventDefault()
        const itemId = event.dataTransfer.getData('text/plain')
        if (itemId) {
          onDropItem(itemId)
        }
      }}
    >
      <div className="character-card">
        <h2 id="character-title">외출 준비 캐릭터</h2>
        <div className="character-illustration" aria-hidden="true">
          <div className="character-head">🙂</div>
          <div className="character-body" />
        </div>
        <div className="worn-items" aria-label="캐릭터가 착용한 아이템">
          {wornItems.length === 0 ? (
            <p className="empty-state">옷과 준비물을 이곳에 놓아 보세요.</p>
          ) : (
            wornItems.map((item) => (
              <button
                className="worn-chip"
                key={item.id}
                type="button"
                onClick={() => onRemoveItem(item.id)}
                aria-label={`${item.label} 빼기`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create feedback dialog**

Create `src/components/FeedbackDialog.tsx`:

```tsx
import type { OutfitScore } from '../game/weatherOutfit'

type FeedbackDialogProps = {
  score: OutfitScore | null
  onClose: () => void
}

export function FeedbackDialog({ score, onClose }: FeedbackDialogProps) {
  if (!score) {
    return null
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className={`feedback-dialog ${score.passed ? 'is-success' : 'is-guidance'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <div className="feedback-icon" aria-hidden="true">
          {score.passed ? '🎉' : '💡'}
        </div>
        <h2 id="feedback-title">{score.passed ? '잘했어요!' : '다시 챙겨 볼까요?'}</h2>
        <p>{score.message}</p>
        <button type="button" onClick={onClose}>
          확인
        </button>
      </section>
    </div>
  )
}
```

- [ ] **Step 5: Connect app state and handlers**

Replace `src/App.tsx`:

```tsx
import { useMemo, useState } from 'react'
import { CharacterStage } from './components/CharacterStage'
import { FeedbackDialog } from './components/FeedbackDialog'
import { MissionPanel } from './components/MissionPanel'
import { WardrobeItem } from './components/WardrobeItem'
import {
  missions,
  outfitItems,
  scoreOutfit,
  type OutfitScore,
} from './game/weatherOutfit'

export default function App() {
  const [activeMissionId, setActiveMissionId] = useState(missions[0].id)
  const [wornItemIds, setWornItemIds] = useState<string[]>([])
  const [score, setScore] = useState<OutfitScore | null>(null)
  const [statusMessage, setStatusMessage] = useState('날씨 미션을 보고 옷과 준비물을 골라 보세요.')

  const activeMission = missions.find((mission) => mission.id === activeMissionId) ?? missions[0]
  const wornItems = useMemo(
    () => outfitItems.filter((item) => wornItemIds.includes(item.id)),
    [wornItemIds],
  )

  function wearItem(itemId: string) {
    setWornItemIds((current) => {
      if (current.includes(itemId)) {
        return current
      }

      const next = [...current, itemId]
      const item = outfitItems.find((candidate) => candidate.id === itemId)
      setStatusMessage(`${item?.label ?? '아이템'}을/를 챙겼어요.`)
      return next
    })
  }

  function removeItem(itemId: string) {
    setWornItemIds((current) => current.filter((candidate) => candidate !== itemId))
    const item = outfitItems.find((candidate) => candidate.id === itemId)
    setStatusMessage(`${item?.label ?? '아이템'}을/를 다시 옷장에 넣었어요.`)
  }

  function changeMission(missionId: string) {
    setActiveMissionId(missionId)
    setWornItemIds([])
    setScore(null)
    setStatusMessage('새 날씨 미션입니다. 다시 준비해 보세요.')
  }

  function checkOutfit() {
    const result = scoreOutfit(activeMission, wornItemIds)
    setScore(result)
    setStatusMessage(result.message)
  }

  return (
    <main className="app-shell">
      <MissionPanel
        missions={missions}
        activeMission={activeMission}
        onMissionChange={changeMission}
      />

      <section className="game-layout" aria-label="날씨에 맞는 옷차림 고르기">
        <CharacterStage wornItems={wornItems} onDropItem={wearItem} onRemoveItem={removeItem} />

        <aside className="wardrobe-panel" aria-labelledby="wardrobe-title">
          <div className="panel-heading">
            <p className="eyebrow">사계절 옷장</p>
            <h2 id="wardrobe-title">옷과 준비물</h2>
          </div>
          <div className="wardrobe-grid">
            {outfitItems.map((item) => (
              <WardrobeItem
                key={item.id}
                item={item}
                isSelected={wornItemIds.includes(item.id)}
                onWear={wearItem}
              />
            ))}
          </div>
        </aside>
      </section>

      <section className="action-bar" aria-label="외출 준비 확인">
        <p role="status" aria-live="polite">
          {statusMessage}
        </p>
        <button className="primary-action" type="button" onClick={checkOutfit}>
          외출하기
        </button>
      </section>

      <FeedbackDialog score={score} onClose={() => setScore(null)} />
    </main>
  )
}
```

- [ ] **Step 6: Run type check through build**

Run:

```bash
npm run build
```

Expected:

```text
✓ built
```

- [ ] **Step 7: Commit interactive UI**

Run:

```bash
git add src/App.tsx src/components
git commit -m "feat: build interactive outfit game"
```

Expected:

```text
[main
```

---

## Task 4: Classroom Visual Design and Responsive Layout

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Replace CSS with game layout**

Replace `src/App.css`:

```css
:root {
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  color: #1c2433;
  background: #eef5f7;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

button,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.3)),
    #eef5f7;
}

.mission-panel,
.action-bar {
  width: min(1120px, 100%);
  margin: 0 auto;
  border: 2px solid #d9e6e7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(30, 54, 74, 0.1);
}

.mission-panel {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 18px;
}

.mission-weather-icon {
  width: 82px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #e2f4ff;
  font-size: 48px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #597087;
  font-size: 0.86rem;
  font-weight: 800;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 8px;
  font-size: clamp(1.55rem, 1.3rem + 1vw, 2.3rem);
  line-height: 1.2;
}

h2 {
  margin-bottom: 10px;
  font-size: 1.25rem;
}

.mission-panel p:last-child,
.action-bar p {
  margin-bottom: 0;
}

.mission-selector {
  display: grid;
  gap: 6px;
  min-width: 190px;
  color: #34465a;
  font-weight: 700;
}

.mission-selector select {
  min-height: 44px;
  border: 2px solid #bfd3d7;
  border-radius: 8px;
  padding: 0 10px;
  background: #ffffff;
  color: #1c2433;
}

.game-layout {
  width: min(1120px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(300px, 420px);
  gap: 18px;
  align-items: stretch;
}

.character-stage,
.wardrobe-panel {
  min-height: 520px;
  border: 2px solid #d9e6e7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(30, 54, 74, 0.1);
}

.character-stage {
  display: grid;
  place-items: center;
  padding: 20px;
}

.character-card {
  width: min(460px, 100%);
  display: grid;
  justify-items: center;
  gap: 16px;
}

.character-illustration {
  width: min(300px, 82vw);
  aspect-ratio: 3 / 4;
  position: relative;
  display: grid;
  justify-items: center;
  align-content: start;
  padding-top: 28px;
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 18%, #ffe1c8 0 42px, transparent 43px),
    linear-gradient(180deg, #d7f2ff 0 46%, #eaf7df 46% 100%);
  border: 3px dashed #98bfd0;
}

.character-head {
  font-size: 56px;
  line-height: 1;
  z-index: 1;
}

.character-body {
  width: 112px;
  height: 160px;
  margin-top: 8px;
  border-radius: 46px 46px 32px 32px;
  background: #79b8d7;
  border: 6px solid #477d9e;
}

.worn-items {
  width: 100%;
  min-height: 92px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #f5f8fa;
}

.empty-state {
  margin: 0;
  color: #607489;
  font-weight: 700;
  text-align: center;
}

.worn-chip {
  min-height: 42px;
  display: inline-flex;
  gap: 6px;
  align-items: center;
  border: 2px solid #b7d6df;
  border-radius: 8px;
  padding: 8px 10px;
  background: #ffffff;
  color: #1c2433;
  font-weight: 800;
}

.wardrobe-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
}

.panel-heading h2 {
  margin-bottom: 0;
}

.wardrobe-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.wardrobe-item {
  min-height: 104px;
  display: grid;
  place-items: center;
  gap: 8px;
  border: 2px solid #cbd9df;
  border-radius: 8px;
  padding: 12px 8px;
  background: #ffffff;
  color: #1c2433;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(30, 54, 74, 0.08);
}

.wardrobe-item:hover,
.wardrobe-item:focus-visible,
.worn-chip:hover,
.worn-chip:focus-visible,
.primary-action:focus-visible,
.feedback-dialog button:focus-visible {
  outline: 4px solid #ffcf5a;
  outline-offset: 2px;
}

.wardrobe-item.is-selected {
  border-color: #3b7f70;
  background: #e3f5ee;
}

.item-icon {
  font-size: 34px;
  line-height: 1;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
}

.action-bar p {
  font-weight: 800;
  color: #34465a;
}

.primary-action,
.feedback-dialog button {
  min-height: 50px;
  border: 0;
  border-radius: 8px;
  padding: 0 22px;
  background: #21685d;
  color: #ffffff;
  font-weight: 900;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(19, 29, 42, 0.42);
}

.feedback-dialog {
  width: min(440px, 100%);
  border-radius: 8px;
  padding: 24px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 26px 70px rgba(17, 28, 42, 0.28);
}

.feedback-dialog.is-success {
  border-top: 10px solid #2f9e6d;
}

.feedback-dialog.is-guidance {
  border-top: 10px solid #ffb545;
}

.feedback-icon {
  margin-bottom: 10px;
  font-size: 54px;
}

@media (max-width: 860px) {
  .app-shell {
    padding: 14px;
  }

  .mission-panel,
  .game-layout,
  .action-bar {
    width: 100%;
  }

  .mission-panel,
  .game-layout,
  .action-bar {
    grid-template-columns: 1fr;
  }

  .mission-panel {
    align-items: start;
  }

  .mission-selector {
    width: 100%;
  }

  .game-layout {
    display: grid;
  }

  .character-stage,
  .wardrobe-panel {
    min-height: auto;
  }

  .action-bar {
    display: grid;
  }

  .primary-action {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .wardrobe-grid {
    grid-template-columns: 1fr;
  }

  .mission-weather-icon {
    width: 66px;
    font-size: 38px;
  }
}
```

- [ ] **Step 2: Run build**

Run:

```bash
npm run build
```

Expected:

```text
✓ built
```

- [ ] **Step 3: Commit visual layout**

Run:

```bash
git add src/App.css
git commit -m "style: design classroom outfit game layout"
```

Expected:

```text
[main
```

---

## Task 5: Component Tests and Accessibility Feedback

**Files:**
- Create: `src/App.test.tsx`
- Modify: `src/App.tsx` if tests reveal missing accessible labels

- [ ] **Step 1: Write UI tests**

Create `src/App.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Weather Outfit Planner app', () => {
  it('shows the first weather mission and wardrobe', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /비 오고 바람이 불어요/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /우산/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /장화/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /외출하기/ })).toBeInTheDocument()
  })

  it('passes the rainy mission after selecting umbrella, rain boots, and windbreaker', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /우산/ }))
    await user.click(screen.getByRole('button', { name: /장화/ }))
    await user.click(screen.getByRole('button', { name: /바람막이/ }))
    await user.click(screen.getByRole('button', { name: /외출하기/ }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('완벽한 외출 준비 끝!')).toBeInTheDocument()
  })

  it('gives guidance when required rainy items are missing', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /우산/ }))
    await user.click(screen.getByRole('button', { name: /외출하기/ }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/장화/)).toBeInTheDocument()
    expect(within(dialog).getByText(/바람막이/)).toBeInTheDocument()
  })

  it('resets worn items when the weather mission changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /우산/ }))
    expect(screen.getByRole('button', { name: /우산 빼기/ })).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('날씨 미션 선택'), 'sunny-hot')
    expect(screen.queryByRole('button', { name: /우산 빼기/ })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /햇볕이 강하고 더워요/ })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run UI tests and verify failures or pass**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected after previous tasks:

```text
PASS src/App.test.tsx
```

If the `우산 빼기` query fails because the accessible name includes an icon, inspect with:

```bash
npm test -- src/App.test.tsx --reporter=verbose
```

Then update the remove button `aria-label` in `src/components/CharacterStage.tsx` to keep the exact label:

```tsx
aria-label={`${item.label} 빼기`}
```

- [ ] **Step 3: Run all unit and component tests**

Run:

```bash
npm test
```

Expected:

```text
PASS
```

- [ ] **Step 4: Commit tests**

Run:

```bash
git add src/App.test.tsx src/components/CharacterStage.tsx
git commit -m "test: cover outfit game interactions"
```

Expected:

```text
[main
```

---

## Task 6: Browser Smoke Test and Responsive Verification

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/weather-outfit.spec.ts`

- [ ] **Step 1: Add Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile-safari-size',
      use: { ...devices['iPhone 13'] },
    },
  ],
})
```

- [ ] **Step 2: Add Playwright smoke test**

Create `tests/weather-outfit.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('student can complete the rainy outfit mission', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /비 오고 바람이 불어요/ })).toBeVisible()

  await page.getByRole('button', { name: /우산/ }).click()
  await page.getByRole('button', { name: /장화/ }).click()
  await page.getByRole('button', { name: /바람막이/ }).click()
  await page.getByRole('button', { name: /외출하기/ }).click()

  await expect(page.getByRole('dialog')).toContainText('완벽한 외출 준비 끝!')
})

test('layout keeps core controls visible on a phone-sized viewport', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /비 오고 바람이 불어요/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /우산/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /외출하기/ })).toBeVisible()
})
```

- [ ] **Step 3: Build before browser smoke**

Run:

```bash
npm run build
```

Expected:

```text
✓ built
```

- [ ] **Step 4: Run Playwright**

Run:

```bash
npm run test:e2e
```

Expected:

```text
2 passed
```

- [ ] **Step 5: Commit browser verification**

Run:

```bash
git add playwright.config.ts tests/weather-outfit.spec.ts
git commit -m "test: add browser smoke for weather outfit planner"
```

Expected:

```text
[main
```

---

## Task 7: README and Classroom Release Notes

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

Create `README.md`:

```md
# 오늘의 날씨 코디네이터: 사계절 옷장

Weather Outfit Planner는 초등 1~2학년 통합교과 활동을 위한 날씨별 옷차림 게임입니다. 학생은 오늘의 날씨 미션을 보고 옷과 준비물을 골라 캐릭터에게 입힌 뒤, `외출하기`로 스스로 점검합니다.

## 수업 연결

- 대상: 1~2학년군 바른 생활 / 슬기로운 생활
- 성취기준: [2슬04-01] 날씨와 계절의 변화를 관찰하고 생활과 관련지어 탐구한다.
- 성취기준: [2바04-01] 날씨와 계절에 맞는 생활 수칙을 알고 실천한다.
- 활동 의도: 날씨를 아는 데서 끝나지 않고 알맞은 옷차림과 준비물을 스스로 고르는 실천을 돕습니다.

## 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npm test
npm run build
npm run test:e2e
```

## 0.1.0

- 비와 바람, 더운 햇볕, 눈과 추위, 봄바람과 먼지 미션을 제공합니다.
- 옷장 아이템을 클릭하거나 드래그해서 캐릭터에게 입힐 수 있습니다.
- `외출하기`를 누르면 성공 칭찬 또는 빠진 준비물 안내가 나옵니다.
- 데스크톱과 휴대폰 크기에서 핵심 조작이 보이도록 반응형 레이아웃을 적용했습니다.
```

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
npm run test:e2e
```

Expected:

```text
PASS
✓ built
2 passed
```

- [ ] **Step 3: Commit docs**

Run:

```bash
git add README.md
git commit -m "docs: add classroom guide"
```

Expected:

```text
[main
```

---

## Self-Review Checklist

- Spec coverage: mission text, character area, item list, drag/drop or click-to-wear, `외출하기`, success popup, weather-specific scoring, Korean classroom copy, and grade 1-2 target are each covered by Tasks 2-7.
- Placeholder scan: no task relies on undefined future work; each implementation step has concrete files, code, command, and expected result.
- Type consistency: `OutfitItem`, `WeatherMission`, `OutfitScore`, `scoreOutfit`, `missions`, and `outfitItems` are defined in Task 2 and reused consistently in Tasks 3-6.
- Risk note: native HTML drag/drop is supported for mouse use; click-to-wear is intentionally included so tablet and accessibility users can complete the activity without drag precision.

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-05-08-weather-outfit-planner.md`.

1. **Subagent-Driven (recommended)** - Dispatch a fresh worker per task, review between tasks, and use `GPT-5.3-Codex-Spark` for worker subagents when available.
2. **Inline Execution** - Execute tasks in this session using `superpowers:executing-plans`, with checkpoints after each task.
