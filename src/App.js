// import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import NoteState from './context/notes/NoteState';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from "react";
import Home from './components/Home'
import Signup from './components/Signup';
import Login from './components/Login';
import MyNote from './components/MyNote';

function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/log">
              <Login />
            </Route>
            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route exact path="/mynote">
              <MyNote/>
            </Route>
          </Switch>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
