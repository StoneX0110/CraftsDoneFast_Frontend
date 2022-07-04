import React, {useRef, useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import Popup from "reactjs-popup";
import "./Popup.css"
import axios from "axios";

export function ContractPopup(props) {
    let user = '';
    if (sessionStorage.getItem('userData') && JSON.parse(sessionStorage.getItem('userData')) !== null) {
        user = JSON.parse(sessionStorage.getItem('userData')).username;
    }

    const inputRef = useRef();
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [startingDate, setStartingDate] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function contractCreation() {
        console.log(`Propose Contract: \n
        Price: ${price}\n
        Starting Date: ${startingDate}`)
        let state = JSON.parse(JSON.stringify(props.contract));
        state.price = price;
        state.startingDate = startingDate;
        state.paymentStatus = 'openContract';
        axios.post('/api/chat/updateContract', state)
            .then(res => {
                console.log(res.data);
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
                <Button border onClick={handleOpen}>Start Payment</Button>
                <Popup open={open} closeOnDocumentClick onClose={handleClose}>
                    <form onSubmit={handleSubmit}>
                        <div className="popupMainContainer">
                            <button className="close" onClick={handleClose}>
                                &times;
                            </button>
                            <div className="header">Define Contract Details</div>
                            <div className="form-group popupInputContainer">
                                <label>Price</label>
                                <input required type="number" name="price" className="form-control"
                                       value={price} onChange={handleChangePrice}
                                       id="priceInput"
                                       placeholder="Insert Price..."/>
                                <label>Date</label>
                                <input required type="date" name="startingDate" className="form-control"
                                       value={startingDate} onChange={handleChangeDate}
                                       id="dateInput"/>
                            </div>
                            <div className="popupButtonContainer">
                                <button type="submit" className="btn popupButton">Confirm Details
                                </button>
                            </div>
                        </div>
                    </form>
                </Popup>
            </div>
        );
}