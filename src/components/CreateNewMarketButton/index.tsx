import { Link } from 'react-router-dom';
import { Button, Row, Container } from 'react-bootstrap';
import './index.scss';
import { useWallet } from 'use-wallet';

export default function CreateNewMarketButton(): JSX.Element | null {
  const { account } = useWallet();
  if (!account) return null;
  return (
    <Container className='create-new-market'>
      <Row>
        <Link to='/create-new-pair'>
          <Button>
            Create New Market
          </Button>
        </Link>
      </Row>
    </Container>
  );
}
