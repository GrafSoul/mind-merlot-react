import React from "react";
import "./App.css";
import MindARViewer from "./components/mindar-viewer";

function App() {
  return (
    <div className="App">
      <div className="container">
        <MindARViewer />
        <video></video>
      </div>
    </div>
  );
}

export default App;
