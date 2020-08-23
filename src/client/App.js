import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import {LinkContainer} from "react-router-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./Login";
import Dashboard from "./components/Dashboard";
import VideoCall from "./VideoCall";

function App() {
  return (
    <Router>
      <div>
        <Navbar className="justify-content-center">
          <Nav>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/projects">
              <Nav.Link>Projects</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/dashboard">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/call">
              <Nav.Link>Call</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar>
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
      </div>
    </Router>
  );
}

export default App;
