import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./Login";
import Dashboard from "./components/Dashboard";
import VideoCall from "./VideoCall";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/projects" />
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/call">
          <VideoCall />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
