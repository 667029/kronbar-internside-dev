// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { isExpired } from "react-jwt";

interface IProps {
    component:any,
    path:string
}

const PrivateRoute = ({ component: Component, ...rest }:IProps) => {
  const jwtToken = localStorage.getItem("authorization");
  const isLoggedIn = jwtToken !== null && !isExpired(jwtToken);
  
  return <Route {...rest} render={props =>
    isLoggedIn ? (Component) : (
    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}/>
}

export default PrivateRoute