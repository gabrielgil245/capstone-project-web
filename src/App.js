import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from "./dashboard";

import React, {useEffect, useState} from "react";
import { Divider, notification } from 'antd';

// https://boiling-waters-15789.herokuapp.com/

function Auth() {

  let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const [emailLogin, setEmailLogin] = useState('');
  const [emailSignUp, setEmailSignUp] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [passwordSignUp, setPasswordSignUp] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const onSignIn = async (event) => {
    event.preventDefault();
    // console.log(emailLogin);
    // console.log(passwordLogin);

    let loginBody = { 
      email: emailLogin,
      password: passwordLogin
    }

    let options = {
      method: 'POST',
      body: JSON.stringify(loginBody),
      headers: {}
    };
    options.headers["Accept"] = "application/json, text/plain, */*";
    options.headers["Content-Type"] = "application/json;charset=utf-8";
    // console.log(options);
    
    const res = await fetch(`${apiUrl}/api/v1/login`, options);

    let data = await res.json();
    // console.log(data);
    if(data.token){
      localStorage.setItem('token', data.token);
      window.location.href='/dashboard';
    }
    
  }

  const onSignUp = async (event) => {
    event.preventDefault();
    // console.log(emailSignUp);
    // console.log(passwordSignUp);

    let signupBody = { 
      email: emailSignUp,
      password: passwordSignUp
    }

    let options = {
      method: 'POST',
      body: JSON.stringify(signupBody),
      headers: {}
    };
    options.headers["Accept"] = "application/json, text/plain, */*";
    options.headers["Content-Type"] = "application/json;charset=utf-8";
    // console.log(options);
    
    const res = await fetch(`${apiUrl}/api/v1/signup`, options);
    
    let data = await res.json();
    console.log(data);
    if(data.success){
      notification['success']({
        message:'Received',
        description:
        "All set! You may now login using your credentials.",
      })
    }

  }

  return (
    <>
      {/* Navbar */}
      <div className={"grid grid-cols-12 bg-gray-200"}>
        <h1 className={"col-span-full text-center text-3xl bg-gray-400 p-4"}>Login Form</h1>

        {/* Log In */}
        <div className={"col-span-full"}>
          <h1 className={"text-center text-3xl p-2"}>Sign In</h1>
          <form className={"grid grid-cols-12"} onSubmit={onSignIn}>
            <input type="email" value={emailLogin} onChange={(event) => setEmailLogin(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={"Email address"}/>
            <input type="password" value={passwordLogin} onChange={(event) => setPasswordLogin(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={"Password"}/>
            <button htmlType={"submit"} 
              className={"p-2 m-2 border col-start-5 col-span-4 bg-blue-400 hover:bg-blue-600 text-white rounded font-bold"}>
                Log In
            </button>

          </form>
        </div>

        <Divider className={"col-span-full"} />

        {/* Sign Up */}
        <div className={"col-span-full"}>
          <h1 className={"text-center text-3xl p-2"}>Sign Up</h1>
          <form className={"grid grid-cols-12"} onSubmit={onSignUp}>
            <input type="email" value={emailSignUp} onChange={(event) => setEmailSignUp(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={"Email address"}/>
            <input type="password" value={passwordSignUp} onChange={(event) => setPasswordSignUp(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={"Password"}/>
             <input type="password" value={retypePassword} onChange={(event) => setRetypePassword(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={'Retype Password'}/>
             {(passwordSignUp != retypePassword) && <small className={'text-red-500 font-bold'}>Passwords don't match</small>}
            <button htmlType={"submit"} 
              className={"p-2 m-2 border col-start-5 col-span-4 bg-blue-400 hover:bg-blue-600 text-white rounded font-bold"}>
                Sign Up
            </button>

          </form>
        </div>
      </div>

    </>
  );
}

function App() {
    
  return (
    <>
      <Router>
          <div>
              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                  <Route path="/dashboard">
                      <Dashboard />
                  </Route>
                  <Route path="/">
                      <Auth />
                  </Route>
              </Switch>
          </div>
      </Router>
    </>
  );
}

export default App;
