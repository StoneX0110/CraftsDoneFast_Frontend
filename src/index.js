import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import context from 'react-bootstrap/esm/AccordionContext';
import { useNavigate } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (typeof(error.response) === "undefined") {
    alert(error);
  }
  else if (error.response.status === 403) {
    alert("Forbidden. Please log in to use this functionality.");
    sessionStorage.setItem('userData', null);
    window.location = "/login";
  }
  else {
    console.log(error.response.data.message);
    alert(error.response.data.message);
  }
});

axios.interceptors.request.use(
  request => {
    const user = JSON.parse(sessionStorage.getItem('userData'));
    if (user !== null) {
      request.headers['x-access-token'] = user.accessToken;
      request.headers['x-access-signature'] = user.signature;
      request.headers['access-control-allow-origin'] = null;
    }
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
