import React from "react";
import { useNavigate } from 'react-router-dom';
export default function BackButtonComponent(props) {

    let navigate = useNavigate();
    

    return (
        <div className="image border-success mb-3 text-left">
            <label onClick={() => {props.to ? navigate(props.to) : navigate(-1)}} className="">{props.text ? "Go back to " + props.text : "Go back"}</label>
        </div>
    );
}