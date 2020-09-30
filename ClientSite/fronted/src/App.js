import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Register from "./components/accounts/Register";
import Login from "./components/accounts/Login";
import UnNavbar from "./components/layout/UnNavbar";
import SideBar from "./components/layout/SideBar";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "./components/common/PrivateRoute";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Fragment>
            <div className="container-fluid">
              <div className="row-fluid">
                <UnNavbar />
              </div>
              <div className="row">
                <div className="col-md-2">
                  <SideBar />
                </div>
                <div className="col-md-10">
                  <Switch>
                    <PrivateRoute path="/" exact component={CreateRoom} />
                    <PrivateRoute
                      exact
                      path="/room/:roomID"
                      exact
                      component={Room}
                    />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                  </Switch>
                </div>
              </div>
            </div>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;