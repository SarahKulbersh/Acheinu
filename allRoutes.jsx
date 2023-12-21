import React from 'react'
import { Route, Routes } from 'react-router-dom';
import "./styles/index.css";
import { PostJobForm } from './postJobForm';
import { JobApplyForm } from './jobApplyForm';
import LandingPage from './landingPage';
import JobsList from './jobsList';
import { SignIn } from './signIn';
import Dashboard from './dashboard';
import { SignUp } from './signUp';

export default function AllRoutes() {
  return (
    <Routes>
      <Route path='/post' element={<PostJobForm />} />
      <Route path='/apply' element={<JobApplyForm />} />
      <Route path='/' element={<LandingPage />} />
      <Route path='jobsList/:searchTerm' element={<JobsList />} />
      <Route path='dashboard/:tab' element={<Dashboard />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />

    </Routes>

  )
}
