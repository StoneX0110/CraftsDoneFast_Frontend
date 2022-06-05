import logo from './logo.svg';
import './App.css';
import CreateJobOfferView from './components/jobOffer/CreateJobOfferView';
import MyJobOfferView from './components/jobOffer/MyJobOfferView';
import NavbarComponent from './components/NavbarComponent';
import OverviewView from "./components/OverviewView";
import Login from "./components/Login";
import Registration from "./components/Registration";


import DetailJobOfferComponent from './components/jobOffer/DetailJobOfferComponent';
import ReactDOM from "react-dom";
import routes from "./router";
import { BrowserRouter, BrowserRouter as Router, Routes, Route } from "react-router-dom";



import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <div className="App">

      <Router>
        <NavbarComponent />
        {/* <CreateJobOfferView/> */}
        <Routes>
          <Route exact path='/' element={<OverviewView />} />
          <Route exact path='/createJobOffer' element={<CreateJobOfferView />} />
          <Route exact path='/myJobOffer' element={<MyJobOfferView/>} />
          <Route path="/jobOffer/:id" element={<DetailJobOfferComponent />} />
          <Route exact path='/login' element={<Login/>} />
          <Route exact path='/registration' element={<Registration/>} />
        </Routes>
      </Router>

      {/* <CreateJobOfferView /> */}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );


}

export default App;
