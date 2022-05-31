import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
// import routes from "./router";
// import { BrowserRouter, BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";

// import OverviewView from "./components/OverviewView";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

axios.interceptors.request.use(
  request => {
    request.headers['access-control-allow-origin'] = null;
    return request;
  },
  error => {
    return Promise.reject(error);
  }
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
