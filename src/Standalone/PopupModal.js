import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export const PopupModal = ({ showModal, handleClose, modalBody }) => {
    return (
        <div>
            <Modal size='lg' animation={false} show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body> {modalBody} </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                 </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
