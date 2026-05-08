import { useEffect, useRef } from 'react'
import type { OutfitScore } from '../game/weatherOutfit'

type FeedbackDialogProps = {
  score: OutfitScore | null
  onClose: () => void
}

export default function FeedbackDialog({ score, onClose }: FeedbackDialogProps) {
  const dialogTitleId = 'feedback-dialog-title'
  const dialogMessageId = 'feedback-dialog-message'
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (score) {
      closeButtonRef.current?.focus()
    }
  }, [score])

  if (!score) {
    return null
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogTitleId}
      aria-describedby={dialogMessageId}
      className="feedback-dialog"
    >
      <h3 id={dialogTitleId}>
        {score.passed ? '잘했어요!' : '다시 챙겨 볼까요?'}
      </h3>
      <p id={dialogMessageId}>{score.message}</p>
      <button
        type="button"
        ref={closeButtonRef}
        onClick={onClose}
      >
        확인
      </button>
    </section>
  )
}
