import './App.css';
import CreateJobOfferView from './components/jobOffer/CreateJobOfferView';
import MyJobOfferView from './components/jobOffer/MyJobOfferView';
import NavbarComponent from './components/NavbarComponent';
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Registration from "./components/Registration";


import DetailJobOfferComponent from './components/jobOffer/DetailJobOfferComponent';
import ReactDOM from "react-dom";
import { BrowserRouter, BrowserRouter as Router, Routes, Route } from "react-router-dom";



import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <div className="App">

      <Router>
        <NavbarComponent/>
        <Routes>
          <Route exact path='/' element={<Homepage/>} />
          <Route exact path='/createJobOffer' element={<CreateJobOfferView/>} />
          <Route exact path='/myJobOffers' element={<MyJobOfferView/>} />
          <Route path="/jobOffer/:id" element={<DetailJobOfferComponent/>} />
          <Route exact path='/login' element={<Login/>} />
          <Route exact path='/registration' element={<Registration/>} />
        </Routes>
      </Router>
    </div>
  );


}

export default App;
