import './App.css';
import InsertJobOfferView from './components/jobOffer/InsertJobOfferView';
import MyJobOfferView from './components/jobOffer/MyJobOfferView';
import MyJobOfferRequestsView from "./components/jobOffer/MyJobOfferRequestsView";
import NavbarComponent from './components/NavbarComponent';
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Registration from "./components/Registration";
import UserView from "./components/user/UserView";
import {ChatView} from "./components/chat/ChatView";
import AboutUs from './components/AboutUs';


import DetailJobOfferComponent from './components/jobOffer/DetailJobOfferComponent';
import ReactDOM from "react-dom";
import { BrowserRouter, BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";



import "bootstrap/dist/css/bootstrap.css";

function App() {

  var isLoggedIn = JSON.parse(sessionStorage.getItem("userData")) !== null;

  return (
    <div className="App">

      <Router>
        <NavbarComponent/>
        <Routes>
          <Route exact path='/' element={<Homepage/>} />
          <Route exact path='/createJobOffer' element={isLoggedIn ? <InsertJobOfferView/> : <Navigate to={{pathname: "/login"}}/>}/>
          <Route exact path='/user/profile/:username' element={<UserView/>}/>
          <Route exact path='/myJobOffers' element={isLoggedIn ? <MyJobOfferView/> : <Navigate to={{pathname: "/"}}/>}/>
          <Route exact path='/myJobOfferRequests' element={isLoggedIn ? <MyJobOfferRequestsView/> : <Navigate to={{pathname: "/"}}/>}/>
          <Route path="/jobOffer/:id" element={<DetailJobOfferComponent/>} />
          <Route exact path='/login' element={isLoggedIn ? <Navigate to={{pathname: "/"}}/> :<Login/>} />
          <Route exact path='/registration' element={isLoggedIn ? <Navigate to={{pathname: "/"}}/> : <Registration/>} />
          <Route exact path='/messages' element={isLoggedIn ? <ChatView/> : <Navigate to={{pathname: "/login"}}/>}/>
          <Route exact path='/aboutUs' element={<AboutUs/>}/>

        </Routes>
      </Router>
    </div>
  );


}

export default App;
