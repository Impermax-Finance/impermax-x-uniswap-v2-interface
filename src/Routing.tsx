 import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";


export default function Routing() {
  return (
    <div className="routing">
      <Router>
          <Switch>
            <Route path="/" exact>
              <div className="main">Main</div>
            </Route>
          </Switch>
      </Router>
    </div>
  );
}