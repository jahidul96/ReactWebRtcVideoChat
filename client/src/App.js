import "./App.css";
import React from "react";
import TopComp from "./components/TopComp";
import CallNotify from "./components/CallNotify";
import Videos from "./components/Videos";

function App() {
  return (
    <div className="container">
      <div className="contentWrapper">
        <h2 className="logoText">ChatApp demo</h2>
        <TopComp />
        <Videos />
        <CallNotify />
      </div>
    </div>
  );
}

export default App;
