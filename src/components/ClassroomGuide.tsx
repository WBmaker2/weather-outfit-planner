import type { MissionChecklist, OutfitScore, WeatherMission } from '../game/weatherOutfit'

type LessonStepStatus = 'complete' | 'active' | 'upcoming'

type LessonStep = {
  id: string
  label: string
  status: LessonStepStatus
}

type ClassroomGuideProps = {
  mission: WeatherMission
  checklist: MissionChecklist
  selectedItemCount: number
  score: OutfitScore | null
}

function getLessonSteps({
  checklist,
  selectedItemCount,
  score,
}: Pick<ClassroomGuideProps, 'checklist' | 'selectedItemCount' | 'score'>): LessonStep[] {
  const hasSelectedItems = selectedItemCount > 0
  const isChecklistReady =
    checklist.requiredItems.every((item) => item.status === 'complete') &&
    checklist.unsuitableItems.length === 0
  const hasPassedOuting = score?.passed === true

  return [
    { id: 'read-weather', label: '날씨 읽기', status: 'complete' },
    {
      id: 'choose-outfit',
      label: '옷과 준비물 고르기',
      status: hasSelectedItems ? 'complete' : 'active',
    },
    {
      id: 'check-list',
      label: '체크리스트 확인',
      status: isChecklistReady ? 'complete' : hasSelectedItems ? 'active' : 'upcoming',
    },
    {
      id: 'go-out',
      label: '외출하기',
      status: hasPassedOuting ? 'complete' : isChecklistReady ? 'active' : 'upcoming',
    },
  ]
}

function getProgressValue(steps: LessonStep[]) {
  return steps.filter((step) => step.status === 'complete').length
}

export default function ClassroomGuide({
  mission,
  checklist,
  selectedItemCount,
  score,
}: ClassroomGuideProps) {
  const steps = getLessonSteps({ checklist, selectedItemCount, score })
  const progressValue = getProgressValue(steps)
  const progressPercent = (progressValue / steps.length) * 100

  return (
    <section className="classroom-guide" aria-labelledby="classroom-guide-title">
      <div className="classroom-guide-header">
        <div>
          <p className="classroom-guide-eyebrow">수업 모드</p>
          <h2 id="classroom-guide-title">외출 준비 수업 흐름</h2>
        </div>
        <p className="classroom-guide-count" aria-label={`수업 흐름 ${progressValue}단계 완료, 전체 ${steps.length}단계`}>
          {progressValue}/{steps.length}
        </p>
      </div>

      <div
        className="classroom-progress"
        role="progressbar"
        aria-label="수업 흐름 진행률"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={progressValue}
      >
        <span className="classroom-progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <ol className="classroom-steps" aria-label="수업 단계">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`classroom-step is-${step.status}`}
          >
            <span className="classroom-step-number" aria-hidden="true">{index + 1}</span>
            <span className="classroom-step-label">{step.label}</span>
            <span className="classroom-step-status">
              {step.status === 'complete' ? '완료' : step.status === 'active' ? '지금' : '다음'}
            </span>
          </li>
        ))}
      </ol>

      <div className="discussion-cards" aria-labelledby="discussion-card-title">
        <h3 id="discussion-card-title">학생 발표 질문</h3>
        <div className="discussion-card-grid">
          {mission.discussionQuestions.map((question, index) => (
            <article className="discussion-card" key={question}>
              <span className="discussion-card-number" aria-hidden="true">Q{index + 1}</span>
              <p>{question}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
