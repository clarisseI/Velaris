import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import store from "./App/store"; // Normal import is safer here

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Router>
        {/* If 'store' is undefined here, the app crashes immediately */}
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </React.StrictMode>
  );
}