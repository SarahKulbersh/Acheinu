import React from 'react'
import { database } from "./firebaseConfig";
import { useState, useEffect } from 'react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import JobCard from './jobCard';
import "./styles/recent_jobs.css"

export function RecentlyPostedJobs() {

  const [postingJobsData, setPostingJobsData] = useState([]);


  useEffect(() => {
    async function getFourLatestJobs() {
      try {
        const postingJobsSubcollection = await getDocs(collectionGroup(database, "postingJobs"));
        const fetchedPostingJobsData = postingJobsSubcollection.docs.map(
          (doc) => doc.data())
          .filter((job) => job.isJobActive);
        fetchedPostingJobsData.sort((a, b) => a.createdAt - b.createdAt);
        setPostingJobsData(fetchedPostingJobsData.slice(-4)); // Take the last 4 jobs
      } catch (error) {
        console.error("Error retrieving jobs", error);
      }
    }

    getFourLatestJobs();
  }, []);

  return (
    <div className='recent_jobs'>
      <h2 className='recent_jobs_heading'>Recently Posted Jobs</h2>
      <div className='recent_job_list'>
        <JobCard postingJobsData={postingJobsData} />
      </div>
    </div>
  );
}
