import React, { useState } from "react";
import './index.css';
import 'fontsource-roboto';
import { Paper } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import InformationPage from "./pages/InformationPage";
import RegisterUser from "./pages/RegisterUser";
import PrivateRoute from "./components/Router/PrivateRouter"
import axios from 'axios';
import { isExpired } from "react-jwt";

export const jwtToken = localStorage.getItem("authorization");
axios.interceptors.request.use(
  function(config:any) {
    if (jwtToken && !isExpired(jwtToken)) {
      config.headers["authorization"] = "Bearer " + jwtToken;
    }
    return config;
  },
  function(err:any) {
    return Promise.reject(err);
  }
);

function App() {  
  const storedState = localStorage.getItem("dark-mode") === "true" || false;
  const [darkState, setDarkState] = useState<boolean>(storedState);

  const palletType = darkState ? "dark" : "light";
  const theme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: "#791822",
        light: "#e4d1d3",
        dark: "#541017"
      },
      secondary: {
        main: "#aaaaaa",
        light: "#bbbbbb",
        dark: "#767676"
      },
    }
  });
  const handleThemeChange = () => {
    localStorage.setItem("dark-mode", String(!darkState));
    setDarkState(!darkState);
  };

  const landingPage = <InformationPage darkMode={darkState} />
  const registerUser = <RegisterUser darkMode={darkState} />

  return (
    <ThemeProvider theme={theme}>
      <Paper className="background" style={{ height: "100vh" }}>
        <Router>
          <div>
            <Footer darkMode={darkState} handleThemeChange={handleThemeChange} />
            <Switch>
              <Route path="/login">
                <LoginPage darkMode={darkState} />
              </Route>
              <PrivateRoute path="/register" component={registerUser} />
              <PrivateRoute path="/" component={landingPage} />
            </Switch>
          </div>
        </Router>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
