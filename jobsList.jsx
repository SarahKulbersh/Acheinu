import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import { database } from "./firebaseConfig";
import { collectionGroup, getDocs } from 'firebase/firestore';
import JobCard from "./jobCard";
import { useState, useEffect } from 'react';
import JobDetails from './jobDetails';
import { SearchBox } from './searchBox';
import { EstPreviewContext } from './Context';
import "./styles/jobResults.css"
import NavBar from "./components/NavBar";
import Footer from "./components/Footer"
export default function JobsList() {

  const searchTerm = useParams().searchTerm;
  const [jobs, setJobs] = useState([]);
  const { estPreview, setEstPreview } = useContext(EstPreviewContext)

  function handleTimePreview() {
    if (estPreview === true)
      setEstPreview(false);
    else
      setEstPreview(true);

  }
  useEffect(() => {
    setEstPreview(false)
    console.log(estPreview)
  }, [])

  useEffect(() => {
    async function fetchJobs() {
      const fetchedJobs = await searchJobs(searchTerm);
      console.log("fetchedJobs", fetchedJobs)
      setJobs(fetchedJobs)
      setEstPreview(false)
      console.log(estPreview)

    }
    fetchJobs();
  }, [searchTerm]);


  async function searchJobs(searchTerm) {

    try {
      const postingJobsSubcollection = await getDocs(collectionGroup(database, "postingJobs"));
      if (searchTerm === '*') {
        const fetchedPostingJobsData = postingJobsSubcollection.docs.map(
          (doc) => doc.data())
          .filter((job) => job.isJobActive);
        return fetchedPostingJobsData;
      }
      else {
        const filteredJobs = postingJobsSubcollection.docs.filter(doc => {
          const jobData = doc.data();
          const normalizedJobTitle = jobData.jobTitle?.toLowerCase();
          const normalizedJobDescription = jobData.jobDescription?.toLowerCase();
          const normalizedSearchTerm = searchTerm.toLowerCase();

          const jobTitleMatch = normalizedJobTitle?.includes(normalizedSearchTerm);
          const jobDescriptionMatch = normalizedJobDescription?.includes(normalizedSearchTerm);

          return (
            (jobTitleMatch || jobDescriptionMatch) &&
            jobData.isJobActive
          )

        });

        const fetchedPostingJobsData = filteredJobs.map(doc => doc.data());
        return fetchedPostingJobsData;
      }
    } catch (error) {
      console.error("Error retrieving jobs", error);
    }
  }

  return (
    <>
        <NavBar />
        <div className='job_results'>
          <SearchBox />
          {jobs.length > 0 && (
            <>
              <div>
                <div className='letssupport'>Show me job times in</div>
                <div className='job_result_zone'>
                  <div className='job_result_zone_est' style={{ borderBottomColor: estPreview === false ? "#DADDE0" : "#2557A7" }} onClick={() => handleTimePreview("est")}>Eastern Standard Time (EST)</div>
                  <div className='job_result_zone_ist' style={{ borderBottomColor: estPreview === true ? "#DADDE0" : "#2557A7" }} onClick={() => handleTimePreview("ist")}>Israel Standard Time (IST)</div>
                </div>
              </div>

              <div className='job_result_box'>

                <div className='recent_job_list'>
                  <JobCard postingJobsData={jobs} />
                </div>
                <JobDetails />
              </div >
            </>
          )}
          {jobs.length === 0 && <p className="no-jobs-message">No jobs found!</p>}

        </div>
        <Footer />
    </>
  )
}
