# Classroom Mode Follow-Up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the deployed Weather Outfit Planner into a more classroom-ready activity by adding teacher-facing lesson support directly in the app and documenting a short pilot flow.

**Architecture:** Keep the app as a single-page React/Vite classroom game. Extend the existing mission data with practical rule text, keep UI state in `App.tsx`, and add no server, login, or persistence. Tests protect the new classroom controls and feedback flow.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, Playwright, plain CSS, GitHub Pages.

---

## Scope

This follow-up implements three classroom-facing features:

- `수업 모드`: a toggle that enlarges the mission/stage rhythm and signals class demonstration mode.
- `생활 수칙 보기`: an expandable mission note that explains the practical habit for the selected weather.
- `다시 도전`: a dialog action that closes feedback and clears the current outfit for the same mission.

It also adds lightweight teacher docs:

- `docs/teacher-guide.md`
- `docs/pilot-checklist.md`

## File Structure

- Modify: `src/game/weatherOutfit.ts`
  - Add `lessonRule` and `teacherPrompt` to each mission.
- Modify: `src/components/MissionPanel.tsx`
  - Add lesson-rule disclosure and teacher prompt copy.
- Modify: `src/components/FeedbackDialog.tsx`
  - Add a `다시 도전` action and keep modal focus behavior stable.
- Modify: `src/App.tsx`
  - Add classroom mode state and retry handler.
- Modify: `src/App.css`
  - Style classroom mode, lesson note, retry action, and responsive controls.
- Modify: `src/App.test.tsx`
  - Cover classroom mode, lesson note, retry flow, and existing success path.
- Modify: `tests/weather-outfit.spec.ts`
  - Smoke the lesson note and retry flow in the browser.
- Create: `docs/teacher-guide.md`
- Create: `docs/pilot-checklist.md`
- Modify: `README.md`
  - Link the new teacher docs.

---

## Task 1: Mission Data and Lesson Note

- [x] **Step 1: Add mission fields**

Add these fields to `WeatherMission` in `src/game/weatherOutfit.ts`:

```ts
lessonRule: string
teacherPrompt: string
```

Each mission gets one practical rule and one short teacher prompt. Example for rain:

```ts
lessonRule: '비 오는 날에는 발과 몸이 젖지 않도록 우산, 장화, 바람막이를 챙겨요.',
teacherPrompt: '비와 바람이 함께 있으면 어떤 준비가 더 필요할까요?',
```

- [x] **Step 2: Render the lesson note**

In `src/components/MissionPanel.tsx`, add a native `<details className="mission-rule">` with summary text `생활 수칙 보기`, then render `activeMission.lessonRule` and `activeMission.teacherPrompt`.

- [x] **Step 3: Verify**

Run:

```bash
npm test
npm run build
```

Expected: all tests and build pass.

## Task 2: Classroom Mode and Retry Flow

- [x] **Step 1: Add app state**

In `src/App.tsx`, add:

```ts
const [isClassroomMode, setIsClassroomMode] = useState(false)
```

Use class name `app-shell is-classroom-mode` when enabled.

- [x] **Step 2: Add toggle**

Render a button labeled `수업 모드 켜기` or `수업 모드 끄기`. Toggling updates `statusMessage` to `수업 모드가 켜졌어요.` or `수업 모드가 꺼졌어요.`

- [x] **Step 3: Add retry**

In `src/App.tsx`, add a retry handler that clears `wornItemIds`, clears `score`, and announces `같은 미션으로 다시 도전해요.`

Pass it to `FeedbackDialog` as `onRetry`.

- [x] **Step 4: Add dialog button**

In `src/components/FeedbackDialog.tsx`, render a secondary button labeled `다시 도전`. Keep `확인` focused on open and keep Escape/Tab behavior.

- [x] **Step 5: Verify**

Run:

```bash
npm test
npm run build
```

Expected: all tests and build pass.

## Task 3: Tests, Docs, and Browser Smoke

- [x] **Step 1: Add tests**

Add React Testing Library coverage for:

- `생활 수칙 보기` reveals mission rule and prompt.
- `수업 모드 켜기` toggles to `수업 모드 끄기`.
- `다시 도전` clears worn chips and keeps the same mission.

- [x] **Step 2: Add browser smoke**

Update Playwright to open the lesson note, complete the rainy mission, click `다시 도전`, and confirm worn chips clear.

- [x] **Step 3: Add docs**

Create `docs/teacher-guide.md` with a 10-15 minute lesson flow and `docs/pilot-checklist.md` with pre-class/device/student-flow checks.

- [x] **Step 4: Verify**

Run:

```bash
npm test
npm run build
npm run test:e2e
```

Expected: all checks pass.

## Self-Review Checklist

- Spec coverage: all three selected implementation features have code, tests, and teacher docs.
- Placeholder scan: no TBD/TODO/future-only requirements.
- Type consistency: `lessonRule`, `teacherPrompt`, `onRetry`, and `isClassroomMode` are named consistently across tasks.
