import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Register from "./components/accounts/Register";
import Login from "./components/accounts/Login";
import UnNavbar from "./components/layout/UnNavbar";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "./components/common/PrivateRoute";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import Rooms from "./routes/Rooms";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Fragment>
            <UnNavbar />
            <div className="container">
              <Switch>
                {/* <PrivateRoute
                  exact
                  path="/"
                  component={() => {
                    return "test";
                  }}
                /> */}
                <Route path="/" exact component={CreateRoom} />
                <Route exact path="/room/:roomID" exact component={Room} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
              </Switch>
            </div>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
