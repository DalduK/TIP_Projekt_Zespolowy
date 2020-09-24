import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import Register from "./accounts/Register";
import Login from "./accounts/Login";
import UnNavbar from "./layout/UnNavbar";
import { Provider } from "react-redux";
import store from "../store";
import PrivateRoute from "./common/PrivateRoute";
import CreateRoom from "./funcionality/CreateRoom";
import Room from "./funcionality/Room";

class App extends Component {
  render() {
    return (
        <Provider store={store}>
        <Router>
          <Fragment>
            <UnNavbar />
            <div className="container">
              <Switch>
                {/*<PrivateRoute exact path="/" component={() => {return "test"}} />*/}
                <PrivateRoute path="/" exact component={CreateRoom} />
                <Route path="/room/:roomID" component={Room} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
              </Switch>
            </div>
          </Fragment>
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
