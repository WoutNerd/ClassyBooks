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
import TeacherLib from './pages/teacher/teacherLibrary';
import AddUser from './pages/admin/addUser';
import UserTyperChoise from './userTypeChoise';
import AddMaterial from './pages/admin/addMaterial';
import StudentLib from './pages/student/studentLibrary';
import ManageUsers from './pages/admin/manageUsers';
import TeacherChangePassword from './pages/teacher/teacherChangePassword';
import StudentChangePassword from './pages/student/studentChangePassword';
import ChangeUserPass from './pages/admin/changeUserPass';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <BrowserRouter>
                <Routes>
                        <Route path="/" element={<App />}>
                                <Route index element={<UserTyperChoise />} />
                                <Route path='*' element={<NoPage />} />
                                <Route path='leerling' element={<StudentLogin />} />
                                <Route path='leerkracht' element={<TeacherLogin />} />

                                <Route path='leerkracht/overzicht' element={<Dashboard />} />
                                <Route path='leerkracht/bibliotheek' element={<TeacherLib />} />
                                <Route path='leerkracht/verander-wachtwoord' element={<TeacherChangePassword />} />

                                <Route path='beheer/gebruiker-toevoegen' element={<AddUser />} />
                                <Route path='beheer/gebruikers-beheren' element={<ManageUsers />} />
                                <Route path='beheer/boek-toevoegen' element={<AddMaterial />} />
                                <Route path='beheer/verander-gebruiker-wachtwoord' element={<ChangeUserPass />} />

                                <Route path='leerling/bibliotheek' element={<StudentLib />} />
                                <Route path='leerling/verander-wachtwoord' element={<StudentChangePassword />} />


                        </Route>
                </Routes>
        </BrowserRouter>
);