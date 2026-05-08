import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import type { OutfitScore } from '../game/weatherOutfit'

type FeedbackDialogProps = {
  score: OutfitScore | null
  onClose: () => void
}

export default function FeedbackDialog({ score, onClose }: FeedbackDialogProps) {
  const dialogTitleId = 'feedback-dialog-title'
  const dialogMessageId = 'feedback-dialog-message'
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!score) {
      const previous = previouslyFocusedElementRef.current
      if (previous && typeof previous.focus === 'function') {
        previous.focus()
      }
      return
    }

    previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButtonRef.current?.focus()
  }, [score])

  if (!score) {
    return null
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      closeButtonRef.current?.focus()
    }
  }

  return (
    <div className="dialog-backdrop" onKeyDown={handleKeyDown} role="presentation">
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
    </div>
  )
}
