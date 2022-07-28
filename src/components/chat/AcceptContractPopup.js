import React, {useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Moment from "moment";

export function AcceptContractPopup(props) {
    let user = '';
    let currentIBAN = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
        currentIBAN = JSON.parse(sessionStorage.getItem('userData')).settings.IBAN;
    }

    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [startingDate, setStartingDate] = useState("");
    const [IBAN, setIBAN] = useState("");
    const handleOpen = () => {
        setOpen(true);
        setPrice(props.contract.price)
        setStartingDate(Moment(props.contract.startingDate).format('DD.MM.YYYY'));
    }
    const handleClose = () => setOpen(false);

    function handleChangeIBAN(event) {
        setIBAN(event.target.value);
    }

    function acceptContract() {
        let state = JSON.parse(JSON.stringify(props.contract));
        state.paymentStatus = 'contractEstablished';
        if (IBAN !== "") {
            user = {
                IBAN : IBAN,
                id: JSON.parse(sessionStorage.getItem('userData')).id,
            }
            axios.post('/api/user/updateUserIBAN', user)
            let sessionData = sessionStorage.getItem('userData');
            let stringArray = sessionData.split('"IBAN":');
            sessionData = stringArray[0] + '"IBAN":';
            let tempData = JSON.parse(JSON.stringify(IBAN));
            sessionData += JSON.stringify(tempData) + '}}';
            sessionStorage.setItem('userData', sessionData);
        }
        axios.post('/api/chat/updateContract', state)
            .then(res => {
                props.sendSystemMessage('<Message.CustomContent>' +
                    '<strong>Accepted Contract:</strong><br />' +
                    'price: ' +
                    '<span style="color:darkred">' + price + '$' + '</span><br />' +
                    'starting date: ' +
                    '<span style="color:darkred">' + startingDate + '</span>' +
                    '</Message.CustomContent>', state);
            })
    }

    function handleSubmit(event) {
        event.preventDefault();
        acceptContract();
        handleClose();
    }

    return (
        <div>
            <Button border onClick={handleOpen}>
                Accept Contract
            </Button>
            <Modal show={open} onHide={handleClose}>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Modal.Header>
                    <Modal.Title>Do you wish to accept the Contract Details?</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body className="popupMainContainer">
                        <div className="popupInputContainer">
                            <div className="card-text col-auto text-center">
                                <label>Starting Date: {startingDate}</label>
                            </div>
                            <div className="card-text col-auto text-center">
                                <label>Price: {price}$</label>
                            </div>
                            {currentIBAN === "" &&
                            <label>Payment Destination</label> &&
                            <input required type="string" name="IBAN" className="form-control"
                                   value={IBAN} onChange={handleChangeIBAN}
                                   id="ibanInput"
                                   placeholder="Insert your IBAN"/>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn popupButtonCancel" onClick={handleClose}>Cancel</button>
                        <button id="submit" type="submit" className="btn popupButton">Accept Contract Details</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}