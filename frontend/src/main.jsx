import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import App from "./App";
import store from "./app/store";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// 🌐 Axios global config
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          newestOnTop
          theme="dark"
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
