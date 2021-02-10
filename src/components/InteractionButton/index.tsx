import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import  "./index.scss";

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

export default function InteractionButton({name, onCall, state}: InteractionButtonProps) {
  return (
    <button onClick={state === ButtonState.Ready ? onCall : null} className={'interaction-button ' + state}>
      {name}
      { state === ButtonState.Pending ? ( <Spinner animation="border" size="sm" /> ) : null }
      { state === ButtonState.Done ? ( <FontAwesomeIcon icon={faCheck} /> ) : null }
    </button>
  );
}