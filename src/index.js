import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";

const initializeApp = async () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("CRITICAL: Root element #root not found in DOM");
    console.error("Please ensure your public/index.html contains: <div id='root'></div>");
    
    // Create error message in body
    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #0a0a0a;
        color: white;
        font-family: 'Inter', sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="color: #f5222d; margin-bottom: 20px;">Application Error</h1>
          <p style="color: #a0a0a0;">Root element not found. Please check your HTML configuration.</p>
        </div>
      </div>
    `;
    return;
  }

  try {
    // Dynamically import store to avoid module execution errors
    const storeModule = await import("./App/store");
    const store = storeModule.default;

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <Router>
          <Provider store={store}>
            <App />
          </Provider>
        </Router>
      </React.StrictMode>
    );
    
    console.log("✅ App initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing app:", error);
    rootElement.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #0a0a0a;
        color: white;
        font-family: 'Inter', sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="color: #f5222d; margin-bottom: 20px;">Initialization Error</h1>
          <p style="color: #a0a0a0;">${error.message}</p>
          <pre style="color: #666; margin-top: 20px; text-align: left; max-width: 600px; overflow: auto;">${error.stack}</pre>
        </div>
      </div>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM already loaded
  initializeApp();
}