import React from 'react'
import { useContext, useEffect } from 'react'
import { JobContext, idJobToApplyContext, EstPreviewContext } from './Context'
import { useNavigate } from 'react-router-dom';
import "./styles/jobResults.css"
import { applyIcon } from './assets'
import parse from 'html-react-parser';

export default function JobDetails() {
  const { estPreview, setEstPreview } = useContext(EstPreviewContext)
  const { job, setJob } = useContext(JobContext);
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") ?? null;
  const { setJobToApplyId } = useContext(idJobToApplyContext)

  // time comes from the database like this "20:00 PM" => "20:00"
  function convertTo24HourFormat(timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }
// depending if the user is viewing the jobs in EST or IST
  function convertTime(timeString, isEST) {
    console.log("timeString", timeString)
    const timeStr = convertTo24HourFormat(timeString)
    console.log("timestr", timeStr)
    const [hours, minutes] = timeString.split(":");
    const timeObj = new Date();
    timeObj.setHours(hours);
    timeObj.setMinutes("00");
    if (isEST) {
      if (estPreview === true) {
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      } else {
        timeObj.setHours(timeObj.getHours() + 7);
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      }
    } else {
      if (estPreview === true) {
        timeObj.setHours(timeObj.getHours() - 7);
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      } else {
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      }
    }
  }
  useEffect(() => { }, [job])
  if (!job) {
    return null;
  }
  function handleApply(jobId) {
    setJobToApplyId(jobId);
    console.log(jobId)
    console.log("userId", userId)
    if (sessionStorage.getItem("userId") === null) {
      navigate('/signin')

    }
    else {
      navigate('/apply')
    }

  }


  return (
    <div className='job_result_cnt'>
    <h4>{job.jobTitle}</h4>
    <button className='job_result_btn' onClick={() => handleApply(job.postingJobId)}>Apply <img src={applyIcon} alt=""/></button>
    {/* <h5>Job type</h5> */}
    <div className='job_result_tags'>
      <div>Full Time</div>
      <div>{job.startedTimeFrom && job.endedTimeIn ? (
        <>
          {convertTime(job.startedTimeFrom, job.isEST).replace(" ", "")}{" - "}
          {convertTime(job.endedTimeIn, job.isEST).replace(" ", "")}
          {job.isEST ? " EST" : "Israel time"}
        </>
      ) : null}</div>
    </div>
    <text>{parse(job.jobDescription)}</text>
  </div>
  );
}