import './App.css';
import Navbar from './Navbar';
import UserTypeChose from './pages/userTypeChose';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="page">
        <UserTypeChose />
      </div>
    </div>
  );
}

export default App;