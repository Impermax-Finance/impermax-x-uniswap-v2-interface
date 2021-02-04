import React from "react";
import './index.scss';
import { Row, Col } from "react-bootstrap";

interface DetailsRowProps {
  name: string;
  value?: string;
  children?: any;
}

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolDetailsRowProps
 */
export default function DetailsRow({ name, value, children }: DetailsRowProps) {
  return (
    <div className="details-row">
      <div className="name">{ name }</div>
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