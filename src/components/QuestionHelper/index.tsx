import React, { useCallback, useState } from 'react'
import { HelpCircle as Question } from 'react-feather'
import './index.scss';
import Tooltip from '../Tooltip';

export default function QuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span>
      <Tooltip text={text} show={show} placement="right">
        <div className="question-wrapper" onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <Question size={16} />
        </div>
      </Tooltip>
    </span>
  )
}