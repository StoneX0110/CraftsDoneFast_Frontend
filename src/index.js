import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import context from 'react-bootstrap/esm/AccordionContext';
import { useNavigate } from "react-router-dom";
// import routes from "./router";
// import { BrowserRouter, BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";

// import OverviewView from "./components/OverviewView";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*
axios.interceptors.request.use(
  request => {
    request.headers['access-control-allow-origin'] = null;
    return request;
  },
  error => {
    return Promise.reject(error);
  }
)
*/

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // console.log("test" + error);
  if (typeof(error.response) === "undefined") {
    alert(error);
  }
  else if (error.response.status === 403) {
    alert("Forbidden. Please log in to use this functionality.");
    localStorage.setItem('userData', null);
    window.location = "/login";
    // var navigate = useNavigate();
    // navigate('/login', { replace: true });
    // sessionStorage.removeItem("user");
  } else {
    const error = error;
    console.log(error);
    // if (typeof(error) === "undefined") {
    //   console.log("undef");
    // }
    console.log(error.response.data.message);
    alert(error.response.data.message);
    // router.push("/");
    // context.history.push("/");
    // var navigate = useNavigate();
    // navigate('/', { replace: true });
  }
});

axios.interceptors.request.use(
  request => {
    const user = JSON.parse(localStorage.getItem('userData'));
    // console.log(user);
    if (user !== null) {
      // console.log("add authentication");
      // console.log(user.accessToken);
      // console.log("add: " + JSON.parse(user.accessToken) + " ----- " + JSON.parse(user.signature));
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
