import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Landing from "./components/Layout/Landing";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Verify from "./components/Auth/Verify";
import Forgot from "./components/Auth/Forgot";
import Token from "./components/Auth/Token";

import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./components/User/Dashboard";
import AddPersonal from "./components/User/Personal/AddPersonal";
import ShowPersonal from "./components/User/Personal/ShowPersonal";
import AddTeam from "./components/User/Team/AddTeam";
import ShowTeam from "./components/User/Team/ShowTeam";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser, setNotAuth } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      store.dispatch(loadUser());
    } else {
      store.dispatch(setNotAuth());
    }
  }, []);
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/verify" component={Verify} />
            <Route exact path="/forgot" component={Forgot} />
            <Route exact path="/token/:id" component={Token} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/addProject" component={AddPersonal} />
            <PrivateRoute exact path="/addTeamProject" component={AddTeam} />
            <PrivateRoute
              exact
              path="/viewPersonal/:id"
              component={ShowPersonal}
            />
            <PrivateRoute exact path="/viewTeam/:id" component={ShowTeam} />
          </Switch>
          <Footer />
        </Router>
      </div>
    </Provider>
  );
};

export default App;
