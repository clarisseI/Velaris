import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";

import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import CryptoAI from "./components/CryptoAI";

import "./App.css";

const App = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="App">
      <div className="navbar">
        <Navbar showAll={showAll} />
      </div>
      <div className="main">
        <Layout style={{ background: 'transparent' }}>
          <div className="routes">
            <Routes>
              <Route 
                exact 
                path="/" 
                element={<Homepage onShowAllChange={setShowAll} />} 
              />
            </Routes>
            
            {/* Floating AI Assistant Widget */}
            <CryptoAI />
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default App;