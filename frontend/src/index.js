import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional, you can remove this line if you don't have a style
import App from './App'; // Assuming you have an App.js file
import reportWebVitals from './reportWebVitals'; // Optional, you can remove this if you're not using it

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Optional: report web vitals if you want to use it
reportWebVitals();
