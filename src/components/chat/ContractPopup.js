import React, {useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import Modal from "react-bootstrap/Modal";
import "./Popup.css"
import axios from "axios";
import Moment from "moment";

export function ContractPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [startingDate, setStartingDate] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function contractCreation() {
        let state = JSON.parse(JSON.stringify(props.contract));
        state.price = price;
        state.startingDate = startingDate;
        state.paymentStatus = 'openContract';
        axios.post('/api/chat/updateContract', state)
            .then(res => {
                props.sendSystemMessage('<Message.CustomContent>' +
                    '<strong>New Contract Proposed:</strong><br />' +
                    'price: ' +
                    '<span style="color:darkred">' + price + '$' + '</span><br />' +
                    'starting date: ' +
                    '<span style="color:darkred">' + Moment(startingDate).format('DD.MM.YYYY') + '</span>' +
                    '</Message.CustomContent>', state);
            })
    }

    function handleChangePrice(event) {
        setPrice(event.target.value);
    }

    function handleChangeDate(event) {
        setStartingDate(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        contractCreation();
        handleClose();
    }

    return (
        <div>
            <Button border onClick={handleOpen}>
                Start Payment
            </Button>
            <Modal show={open} onHide={handleClose}>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                        onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Modal.Header>
                    <Modal.Title>Define Contract Details</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body className="popupMainContainer">
                        <div className="form-group popupInputContainer">
                            <label>Price</label>
                            <input required type="number" min="0" name="price" className="form-control"
                                   value={price} onChange={handleChangePrice}
                                   id="priceInput"
                                   placeholder="Insert Price in Dollar"/>
                            <label>Date</label>
                            <input required type="date" name="startingDate" className="form-control"
                                   value={startingDate} onChange={handleChangeDate}
                                   id="dateInput"/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                            <button type="button" className="btn popupButtonCancel" onClick={handleClose}>Cancel</button>
                            <button id="submit" type="submit" className="btn popupButton">Confirm Details</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}