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
import Leerling from './pages/student';
import Leerkracht from './pages/teacherLogin';
import Klas from './pages/class';
import Overzicht from './pages/teacher';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<UserTypeChose />} />
        <Route path='leerkracht' element={<Leerkracht />} />
        <Route path='leerling' element={<Leerling />} />
        <Route path='*' element={<NoPage/>} />
        <Route path='klas' element={<Klas/>} />
        <Route path='overzicht' element={<Overzicht/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
);