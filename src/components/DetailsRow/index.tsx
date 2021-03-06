import React from "react";
import './index.scss';
import { Row, Col } from "react-bootstrap";
import QuestionHelper from "../QuestionHelper";

interface DetailsRowProps {
  name: string;
  value?: string;
  explanation?: string
  children?: any;
}

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolDetailsRowProps
 */
export default function DetailsRow({ name, value, explanation, children }: DetailsRowProps) {
  return (
    <div className="details-row">
      <div className="name">
        { name }
        { explanation ? (
          <QuestionHelper text={explanation} />
        ) : null }
      </div>
      <div className="value">{ value }{ children }</div>
    </div>
  );
}

interface DetailsRowCustomProps {
  children: any;
}
export function DetailsRowCustom({ children }: DetailsRowCustomProps) {
  return (
    <div className="details-row">{ children }</div>
  );
}