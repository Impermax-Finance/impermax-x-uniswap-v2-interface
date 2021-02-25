import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import React, { ReactElement } from 'react';
import './index.scss';

export const InteractionModalFooter = styled(Modal.Footer)`
`

export const InteractionModalBody = styled(Modal.Body)`
  padding: 25px;
`

const StyledHeader = styled(Modal.Header)`
`

interface InteractionModalHeaderProps {
  value: string;
}

export const InteractionModalHeader = ({ value }: InteractionModalHeaderProps) => (<StyledHeader closeButton>
  <Modal.Title>
    { value }
  </Modal.Title>
</StyledHeader>);

const StyledModal = styled(Modal)`
`

interface InteractionModalProps {
  children: ReactElement;
  show: boolean;
  toggleShow: Function;
}

export default function InteractionModal(props: InteractionModalProps) {
  const { show, children, toggleShow} = props;
  return (<StyledModal
    show={show}
    onHide={() => toggleShow(false)}
  >
    {children}
  </StyledModal>);
}

interface InteractionModalContainerProps {
  title: string;
  children: ReactElement;
  show: boolean;
  toggleShow: Function;
}

export function InteractionModalContainer({title, show, toggleShow, children}: InteractionModalContainerProps) {
  return (
    <InteractionModal show={show} toggleShow={toggleShow}>
      <>
        <InteractionModalHeader value={title} />
        <InteractionModalBody>{children}</InteractionModalBody>
      </>
    </InteractionModal>
  );
}