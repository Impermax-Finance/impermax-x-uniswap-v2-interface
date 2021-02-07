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
  onClick?(): void;
}

export default function InteractionButton({name, onClick, state}: InteractionButtonProps) {
  return (
    <button onClick={onClick} className={'interaction-button ' + state}>
      {name}
      { state === ButtonState.Pending ? ( <Spinner animation="border" size="sm" /> ) : null }
      { state === ButtonState.Done ? ( <FontAwesomeIcon icon={faCheck} /> ) : null }
    </button>
  );
}