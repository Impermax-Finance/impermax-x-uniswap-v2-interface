import React from "react";
import { Button } from "react-bootstrap";
import  "./index.scss";

export enum ButtonStates {
  Disabled = 'disabled',
  Ready = 'ready',
  Pending = 'pending',
  Done = 'done',
}

export interface InteractionButtonProps {
  name: string;
  state: ButtonStates;
  onClick?(): void;
}

export default function InteractionButton({name, onClick, state}: InteractionButtonProps) {
  return (
    <button onClick={onClick} className={'interaction-button ' + state}>{name}</button>
  );
}