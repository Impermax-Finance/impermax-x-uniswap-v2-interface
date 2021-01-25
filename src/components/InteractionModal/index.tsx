import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import React, { ReactElement } from 'react';

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
  onHide: Function;
}

export default function InteractionModal(props: InteractionModalProps) {
  const { show, children, onHide} = props;
  return (<StyledModal
    show={show}
    onHide={onHide}
  >
    {children}
  </StyledModal>);
}