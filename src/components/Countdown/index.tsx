import Container from 'react-bootstrap/Container';
import './index.scss';

function atLeastTwoChars(n: number) : string {
  if (n >= 10) return n.toString();
  return '0' + n.toString();
}

// eslint-disable-next-line camelcase
export default function Countdown({ time_diff: timeDiff }: {time_diff: number}): JSX.Element {
  const hours = Math.floor(timeDiff / 3600);
  const minutes = Math.floor(timeDiff % 3600 / 60);
  const seconds = timeDiff % 60;
  return (
    <div className='countdown'>
      <Container>
        {atLeastTwoChars(hours) + ':' + atLeastTwoChars(minutes) + ':' + atLeastTwoChars(seconds)}
      </Container>
    </div>
  );
}
