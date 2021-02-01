import React, { useCallback, useState, useEffect } from "react";
import { InputGroup, Button } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { formatFloat } from "../../utils/format";
import './index.scss';

interface InputAmountProps {
  val: string;
  setVal: Function;
  suffix: string;
  maxTitle: string;
  max: number;
}

export default function InputAmount({val, setVal, suffix, maxTitle, max}: InputAmountProps) {

  const onUserInput = (input: string) => setVal(input);
  const onMax = () => setVal(max.toString());

  return (
    <div className="input-amount">
      <InputGroup className="available">
        {maxTitle}: {formatFloat(max)} {suffix}
      </InputGroup>
      <InputGroup className="input-container mb-3">
        <InputGroup.Prepend className="max-input">
          <button onClick={onMax}>MAX</button>
        </InputGroup.Prepend>
        <NumericalInput value={val} onUserInput={input => {onUserInput(input)}} />
        <InputGroup.Append className="suffix">
          <span>{suffix}</span>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
}