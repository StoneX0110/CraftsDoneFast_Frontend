import './App.css';
import CreateJobOfferView from './components/jobOffer/CreateJobOfferView';
import MyJobOfferView from './components/jobOffer/MyJobOfferView';
import NavbarComponent from './components/NavbarComponent';
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Registration from "./components/Registration";


import DetailJobOfferComponent from './components/jobOffer/DetailJobOfferComponent';
import ReactDOM from "react-dom";
import { BrowserRouter, BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";



import "bootstrap/dist/css/bootstrap.css";

function App() {

  var isLoggedIn = sessionStorage.getItem("userData") !== null;

  return (
    <div className="App">

      <Router>
        <NavbarComponent/>
        <Routes>
          <Route exact path='/' element={<Homepage/>} />
          <Route exact path='/createJobOffer' element={<CreateJobOfferView/>} />
          <Route exact path='/myJobOffers' element={isLoggedIn ? <MyJobOfferView/> : <Navigate to={{pathname: "/"}}/>}/>
          <Route path="/jobOffer/:id" element={<DetailJobOfferComponent/>} />
          <Route exact path='/login' element={isLoggedIn ? <Navigate to={{pathname: "/"}}/> :<Login/>} />
          <Route exact path='/registration' element={isLoggedIn ? <Navigate to={{pathname: "/"}}/> : <Registration/>} />
        </Routes>
      </Router>
    </div>
  );


}

export default App;
