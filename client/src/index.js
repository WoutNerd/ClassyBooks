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
import UserTyperChoise from './pages/userTypeChoise';
import AddMaterial from './pages/admin/addMaterial';
import StudentLib from './pages/student/studentLibrary';
import ManageUsers from './pages/admin/manageUsers';
import TeacherChangePassword from './pages/teacher/teacherChangePassword';
import StudentChangePassword from './pages/student/studentChangePassword';
import ChangeUserPass from './pages/admin/changeUserPass';
import ManageMaterials from './pages/admin/manageMaterial';
import ReturnBooks from './pages/student/return';
import Pupils from './pages/teacher/teacherPupils';
import TeacherChangeUser from './pages/teacher/teacherChangeUsers';
import JsonImport from './pages/admin/jsonimport';
import ChangeMaterial from './pages/admin/changeBook';
import AdminChangeUsers from './pages/admin/adminChangeUsers';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <BrowserRouter>
                <Routes>
                        <Route path="/" element={<App />}>
                                <Route index element={<UserTyperChoise />} />
                                <Route path='*' element={<NoPage />} />

                                <Route path='leerkracht' element={<TeacherLogin />} >
                                        <Route path='overzicht' element={<Dashboard />} />
                                        <Route path='bibliotheek' element={<TeacherLib />} />
                                        <Route path='verander-wachtwoord' element={<TeacherChangePassword />} />
                                        <Route path='leerlingen' element={<Pupils />}>
                                                <Route path='bewerken' element={<TeacherChangeUser />} />
                                        </Route>
                                </Route>

                                <Route path='beheer'>
                                        <Route path='gebruiker-toevoegen' element={<AddUser />} />
                                        <Route path='gebruikers-beheren' element={<ManageUsers />}>
                                                <Route path='bewerken' element={<AdminChangeUsers />} />
                                        </Route>
                                        <Route path='boek-toevoegen' element={<AddMaterial />} />
                                        <Route path='verander-gebruiker-wachtwoord' element={<ChangeUserPass />} />
                                        <Route path='boeken-beheren' element={<ManageMaterials />}>
                                                <Route path='boeken-beheren/bewerken' element={<ChangeMaterial />} />
                                        </Route>
                                        <Route path='json-upload' element={<JsonImport />} />
                                </Route>



                                <Route path='leerling' element={<StudentLogin />}>
                                        <Route path='bibliotheek' element={<StudentLib />} />
                                        <Route path='verander-wachtwoord' element={<StudentChangePassword />} />
                                        <Route path='lever-in' element={<ReturnBooks />} />
                                </Route>

                        </Route>
                </Routes>
        </BrowserRouter >
);