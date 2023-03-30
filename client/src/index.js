//css
import './App.css';
//react
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';

//pages
import App from './App';
import NoPage from './pages/NoPage';
import StudentLogin from './pages/student/studentLogin';
import TeacherLogin from './pages/teacher/teacherLogin';
import Dashboard from './pages/teacher/teacherDashboard';
import TeacherLibrary from './pages/teacher/teacherLibrary';
import AddUser from './pages/admin/addUser';
import UserTyperChoise from './userTypeChoise';
import Test from "./pages/test";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<UserTyperChoise />} />
        <Route path='*' element={<NoPage/>} />
        <Route path='leerling' element={<StudentLogin />} />
        <Route path='leerkracht' element={<TeacherLogin />} />
        <Route path='overzicht' element={<Dashboard/>}/>
        <Route path='bibliotheek' element={<TeacherLibrary/>}/>
        <Route path='leerling-toevoegen' element={<AddUser/>}/>
        <Route path='test' element={<Test/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
);