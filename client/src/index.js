//css
import './index.css';

//react
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';

//pages
import App from './App';
import UserTypeChose from './pages/userTypeChose';
import NoPage from './pages/NoPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<UserTypeChose />} />
        <Route about element={<NoPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);