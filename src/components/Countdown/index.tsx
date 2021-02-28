import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import './index.scss';

function atLeastTwoChars(n: number) : string {
  if (n >= 10) return n.toString();
  return "0" + n.toString();
}

export default function Countdown({time_diff}: {time_diff: number}) {
  const hours = Math.floor(time_diff / 3600);
  const minutes = Math.floor(time_diff % 3600 / 60);
  const seconds = time_diff % 60;
  return(<div className='countdown'>
    <Container>
      {atLeastTwoChars(hours) + ':' + atLeastTwoChars(minutes) + ':' + atLeastTwoChars(seconds)}
    </Container>
  </div>);
}