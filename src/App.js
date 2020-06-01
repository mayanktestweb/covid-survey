import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store'

import Home from './views/Home'
import Koka from './views/Koka'
import AdminLogin from './views/AdminLogin'
import AdminDashboard from './views/AdminDashboard';
import SurveyOfficers from './views/SurveyOfficers';
import AreaBlocks from './views/AreaBlocks';
import ContainmentAreas from './views/ContainmentAreas';
import QuarantineCenters from './views/QuarantineCenters';
import AddContainmentSource from './views/AddContainmentSource';
import Main from './views/survey/Main';
import Login from './views/survey/Login';
import Dashboard from './views/survey/Dashboard';
import GeneralInformation from './views/survey/GeneralInformation';
import FamilyMembers from './views/survey/FamilyMembers';
import FamilyHead from './views/survey/FamilyHead';
import Symptoms from './views/survey/Symptoms';

import TestComponent from './views/TestComponent';
import Deseases from './views/survey/Deseases';
import Pregnancy from './views/survey/Pregnancy';
import TravelDetails from './views/survey/TravelDetails';
import ContactExposure from './views/survey/ContactExposure';
import SelectForSample from './views/survey/SelectForSample';
import QuarantineStatus from './views/survey/QuarantineStatus';
import GeneralReport from './views/GeneralReport';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/koka">
            <Koka />
          </Route>
          <Route exact path="/admin/login">
            <AdminLogin />
          </Route>
          <Route exact path="/admin/dashboard">
            <AdminDashboard />
          </Route>
          <Route exact path="/admin/survey_officers">
            <SurveyOfficers />
          </Route>
          <Route exact path="/admin/areablocks">
            <AreaBlocks />
          </Route>
          <Route exact path="/admin/containment_areas">
            <ContainmentAreas />
          </Route>
          <Route exact path="/admin/quarantine_centers">
            <QuarantineCenters />
          </Route>
          <Route exact path="/admin/add_containment_source">
            <AddContainmentSource />
          </Route>
          <Route exact path="/admin/general_report">
            <GeneralReport />
          </Route>


          <Route exact path="/survey" >
            <Main />
          </Route>
          <Route exact path="/survey/login" >
            <Login />
          </Route>
          <Route exact path="/survey/dashboard" >
            <Dashboard />
          </Route>
          <Route exact path="/survey/general_information" >
            <GeneralInformation />
          </Route>
          <Route exact path="/survey/family_members" >
            <FamilyMembers />
          </Route>
          <Route exact path="/survey/family_head">
            <FamilyHead />
          </Route>
          <Route exact path="/survey/symptoms">
            <Symptoms />
          </Route>
          <Route exact path="/survey/deseases">
            <Deseases />
          </Route>
          <Route exact path="/survey/pregnancy">
            <Pregnancy />
          </Route>
          <Route exact path="/survey/travel_details">
            <TravelDetails />
          </Route>
          <Route exact path="/survey/contact_exposure">
            <ContactExposure />
          </Route>
          <Route exact path="/survey/select_for_sample">
            <SelectForSample />
          </Route>
          <Route exact path="/survey/quarantine_status">
            <QuarantineStatus />
          </Route>


          <Route exact path="/test">
            <TestComponent />
          </Route>

        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
