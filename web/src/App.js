import React from 'react';
import Login from './Login'
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {auth: null}
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin(auth) {
    this.setState({auth: auth})
  }

  render() {
    if (!this.state.auth) {
      return <Login handleLogin={this.handleLogin}/>
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
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
        </header>
      </div>
    );
  }
}

export default App;
