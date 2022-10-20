import './App.css';
import Navbar from './Navbar';
import {Outlet} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="page">
        <Outlet />
      </div>
    </div>
  );
}

export default App;