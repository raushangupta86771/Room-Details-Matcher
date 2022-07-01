import Notes from './Notes'
import Signup from './Signup'
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  let history = useHistory();
  useEffect(() => { //for showing all the notes. which we fetched from mongoDb
    if (localStorage.getItem('token')) {
      history.push("/");
    }
    else {
        history.push("/signup");
    }
    // eslint-disable-next-line
}, []);

  return (
    <>
      <Notes />
    </>
  )
}

export default Home