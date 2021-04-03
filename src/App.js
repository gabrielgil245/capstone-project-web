import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from "./dashboard";

import React, {useEffect, useState} from "react";

// https://boiling-waters-15789.herokuapp.com/

function Auth() {
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const onSignIn = async () => {
    console.log("test");
  }

  const onSignUp = async () => {
    console.log("test");
  }

  return (
    <>
      {/* Navbar */}
      <div className={"grid grid-cols-12 bg-gray-200"}>
        <h1 className={"col-span-full text-center text-3xl bg-gray-400 p-4"}>Login Form</h1>

        {/* Sign-In */}
        <div className={"col-span-full"}>
          <h1 className={"text-center text-3xl p-2"}>Sign In</h1>
          <form className={"grid grid-cols-12"} onSubmit={onSignIn}>
            <input type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={"Email address"}/>
            <input type="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={"Password"}/>
            <button htmlType={"submit"} 
              className={"p-2 border col-start-5 col-span-4 bg-blue-400 hover:bg-blue-600 text-white rounded font-bold"}>
                Log In
            </button>

          </form>
        </div>

        <br/>

        {/* Sign Up */}
        <div className={"col-span-full"}>
          <h1 className={"text-center text-3xl p-2"}>Sign Up</h1>
          <form className={"grid grid-cols-12"} onSubmit={onSignIn}>
            <input type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={"Email address"}/>
            <input type="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={"Password"}/>
             <input type="password" value={retypePassword} onChange={(event) => setRetypePassword(event.currentTarget.value)} 
              required className={"border col-start-2 col-span-10 rounded p-2 m-4"} placeholder={'Retype Password'}/>
             {(password != retypePassword) && <small className={'text-red-500 font-bold'}>Passwords don't match</small>}
            <button htmlType={"submit"} 
              className={"p-2 border col-start-5 col-span-4 bg-blue-400 hover:bg-blue-600 text-white rounded font-bold"}>
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
