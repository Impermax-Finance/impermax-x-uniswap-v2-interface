
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  Button,
  Row,
  Container
} from 'react-bootstrap';

import './index.scss';

const CreateNewMarketButton = (): JSX.Element | null => {
  const { account } = useWeb3React<Web3Provider>();

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
};

export default CreateNewMarketButton;
