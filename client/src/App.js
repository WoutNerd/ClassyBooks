import './App.css';
import Navbar from './Navbar';
import { Outlet } from "react-router-dom"
import { StrictMode } from 'react';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="page">
        <StrictMode>
          <Outlet />
        </StrictMode>
      </div>
    </div>
  );
}

export default App;