import React from "react";


interface LendingPoolsColProps {
  valueA: string;
  valueB: string;
}

export function LendingPoolsCol({valueA, valueB}: LendingPoolsColProps) {
  return (
    <div className="col">
      <div>
        {valueA}
      </div>
      <div>
        {valueB}
      </div>
    </div>
  );
}