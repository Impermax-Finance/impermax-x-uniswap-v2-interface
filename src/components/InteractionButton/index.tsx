// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './index.scss';

export enum ButtonState {
  Disabled = 'disabled',
  Ready = 'ready',
  Pending = 'pending',
  Done = 'done',
}

export interface InteractionButtonProps {
  name: string;
  state: ButtonState;
  onCall(): void;
}

export default function InteractionButton({ name, onCall, state }: InteractionButtonProps): JSX.Element {
  return (
    <button
      onClick={state === ButtonState.Ready ? onCall : null}
      className={'interaction-button ' + state}>
      {name}
      {state === ButtonState.Pending ? (<Spinner
        animation='border'
        size='sm' />) : null}
      {state === ButtonState.Done ? (<FontAwesomeIcon icon={faCheck} />) : null}
    </button>
  );
}
