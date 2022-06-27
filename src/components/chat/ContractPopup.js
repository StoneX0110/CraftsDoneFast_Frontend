import React, {useRef, useState} from "react";
import {Button} from "@chatscope/chat-ui-kit-react";
import Popup from "reactjs-popup";
import axios from "axios";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

export function ContractPopup() {
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
    }

    function handleChangePrice(event) {
        setPrice(event.target.value);
    }

    function handleChangeDate(event) {
        setStartingDate(event.target.value);
    }

    return (
            <div>
                <Button border onClick={handleOpen}>Start Payment</Button>
                <Popup open={open} closeOnDocumentClick onClose={handleClose}>
                        <div>
                            <button className="close" onClick={handleClose}>
                                &times;
                            </button>
                            <div className="header">Define Contract Details</div>
                            <div className="form-group">
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
                            <div>
                                <button type="button" /*className="btn btn-primary"*/ onClick={() => {
                                    handleClose();
                                    contractCreation();
                                }}>Confirm Details
                                </button>
                            </div>
                        </div>
                </Popup>
            </div>
        );
}