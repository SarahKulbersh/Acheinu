import React from 'react'
import RecentJobs from './components/RecentJobs'
import LookForWork from './components/LookForWork'
import LetsSupport from './components/LetsSupport'
import Footer from './components/Footer';
import NavBar from './components/NavBar';



export default function Home() {
  return (
    <div>
      <NavBar />
      <LetsSupport />
      <RecentJobs />
      <LookForWork />
      <Footer />
    </div>
  )
}
