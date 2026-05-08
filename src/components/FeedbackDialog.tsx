import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import type { OutfitScore } from '../game/weatherOutfit'

type FeedbackDialogProps = {
  score: OutfitScore | null
  onClose: () => void
  onRetry: () => void
}

export default function FeedbackDialog({ score, onClose, onRetry }: FeedbackDialogProps) {
  const dialogTitleId = 'feedback-dialog-title'
  const dialogMessageId = 'feedback-dialog-message'
  const dialogRef = useRef<HTMLElement | null>(null)
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
      const focusableButtons = Array.from(
        dialogRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [],
      )
      const firstButton = focusableButtons[0]
      const lastButton = focusableButtons.at(-1)

      if (!firstButton || !lastButton) {
        return
      }

      if (event.shiftKey && document.activeElement === firstButton) {
        event.preventDefault()
        lastButton.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastButton) {
        event.preventDefault()
        firstButton.focus()
      }
    }
  }

  return (
    <div className="dialog-backdrop" onKeyDown={handleKeyDown} role="presentation">
      <section
        ref={dialogRef}
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
        <div className="dialog-actions">
          <button type="button" className="secondary-action" onClick={onRetry}>
            다시 도전
          </button>
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </section>
    </div>
  )
}
