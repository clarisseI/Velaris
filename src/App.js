import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { Homepage, CryptoAI } from "./components";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div className="main">
        <Layout style={{ background: 'transparent' }}>
          <div className="routes">
            <Routes>
              <Route exact path="/" element={<Homepage />} />
            </Routes>
            <CryptoAI />
          </div>
        </Layout>
      </div>
    </div>
  );
};

export default App;