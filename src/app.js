import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";
import Index from "./popup/popup";

/* https://sentry.io/ */

import Raven from "raven-js";
Raven.config(
  "https://8b41de86e2804ad5be6a6020b5afa2e7@sentry.io/268709"
).install();

render(<Index />, document.getElementById("root"));
