import React from 'react';
import  CreateJobOfferView  from './components/jobOffer/CreateJobOfferView';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

// const routes = [
//     {
//         path: '/createJobOffer',
//         name: 'createJobOffer',
//         component: CreateJobOfferView,
//     }
// ];

// const router = createRouter({
//     history: createWebHistory(),
//     routes: routes
// })

const routes = (
    <Routes>
      {/* <Route path="/createJobOffer" exact component= {CreateJobOfferView} /> */}
      {/* <Route path="/about" component={About} />
      <Route component={MissingPage} /> */}
    </Routes>
  );

export default routes;