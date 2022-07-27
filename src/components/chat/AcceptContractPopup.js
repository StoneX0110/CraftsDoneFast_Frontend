import React, {useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Moment from "moment";

export function AcceptContractPopup(props) {
    let user = '';
    let currentStripeID = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
        currentStripeID = JSON.parse(sessionStorage.getItem('userData')).settings.stripeID;
    }

    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [startingDate, setStartingDate] = useState("");
    const [stripeID, setStripeID] = useState("");
    const handleOpen = () => {
        setOpen(true);
        setPrice(props.contract.price)
        setStartingDate(Moment(props.contract.startingDate).format('DD.MM.YYYY'));
    }
    const handleClose = () => setOpen(false);

    function handleChangeStripeID(event) {
        setStripeID(event.target.value);
    }

    function acceptContract() {
        let state = JSON.parse(JSON.stringify(props.contract));
        state.paymentStatus = 'contractEstablished';
        if (stripeID !== "") {
            user = {
                stripeID : stripeID,
                id: JSON.parse(sessionStorage.getItem('userData')).id,
            }
            axios.post('/api/user/updateUserStripeID', user)
            let sessionData = sessionStorage.getItem('userData');
            let stringArray = sessionData.split('"stripeID":');
            sessionData = stringArray[0] + '"stripeID":';
            let tempData = JSON.parse(JSON.stringify(stripeID));
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
                            {currentStripeID === "" &&
                            <label>Payment Destination</label> &&
                            <input required type="string" name="stripeID" className="form-control"
                                   value={stripeID} onChange={handleChangeStripeID}
                                   id="stripeInput"
                                   placeholder="Insert your StripeID"/>
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