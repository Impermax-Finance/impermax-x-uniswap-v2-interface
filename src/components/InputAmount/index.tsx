import React, { useCallback, useState, useEffect } from "react";
import { InputGroup, Button } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { formatFloat } from "../../utils/format";
import './index.scss';

interface InputAmountProps {
  val: number;
  setVal(input: number): void;
  suffix: string;
  maxTitle: string;
  max: number;
}

export default function InputAmount({val, setVal, suffix, maxTitle, max}: InputAmountProps) {
  const [stringVal, setStringVal] = useState<string>("");
  const onUserInput = (input: string) => setStringVal(input);
  const onMax = () => setStringVal(formatFloat(max).toString());
  useEffect(() => {
    setVal(stringVal ? parseFloat(stringVal) : 0)
  }, [stringVal]);

  return (
    <div className="input-amount">
      <InputGroup className="available">
        {maxTitle}: {formatFloat(max)} {suffix}
      </InputGroup>
      <InputGroup className="input-container mb-3">
        <InputGroup.Prepend className="max-input">
          <button onClick={onMax}>MAX</button>
        </InputGroup.Prepend>
        <NumericalInput value={stringVal} onUserInput={input => {onUserInput(input)}} />
        <InputGroup.Append className="suffix">
          <span>{suffix}</span>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
}