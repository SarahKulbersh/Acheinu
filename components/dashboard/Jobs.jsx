import { useEffect, useState } from "react";
import { nextIcon } from "../../assets";
import { collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { UpdatePostJobForm } from "../../updatePostJobForm";
import { backArrowIcon } from "../../assets"

export const Jobs = () => {

    const [jobs, setJobs] = useState([])
    const [jobsLength, setJobLength] = useState(0);
    const [page, setPage] = useState(1);
    const [showUpdateJob, setShowUpdateJob] = useState(false)
    const [jobIdForUpdate, setJobIdForUpdate] = useState('')
    const [jobForUpdate, setJobForUpdate] = useState()

    const jobsPerPage = 6
    const handleAction = async (e, jobId, job) => {
        console.log(job)

        const selectedValue = e.target.value;
        console.log("value", selectedValue)
        if (selectedValue === "Edit") {
            // Open edit modal for the selected job
            setJobIdForUpdate(jobId)
            setJobForUpdate(job)
            setShowUpdateJob(true)
        } else if (selectedValue === "Delete") {
            handleDelete(jobId)
            // Confirm deletion and delete the selected job
        } 

    }

    const handleDelete = async (jobId) => {
        console.log("delete")
        const userId = sessionStorage.getItem("userId")
        const postingJobsRef = collection(database, `persons/${userId}/postingJobs`);
        const jobDoc = await doc(postingJobsRef, jobId);
        try {
            await updateDoc(jobDoc, {
                isJobActive: false
            });
            console.log("update successful")

        } catch (error) {
            console.error("Error updating field:", error);
        }

    }
    const fetchPostingJobs = async page => {
        const userId = sessionStorage.getItem("userId")
        const postingJobsRef = collection(database, `persons/${userId}/postingJobs`);
        const docsSnap = await getDocs(postingJobsRef);

        const jobs = docsSnap.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        })).filter((job) => job.isJobActive)
        setJobLength(jobs.length)
        setJobs(jobs);
        return (jobs.slice((page-1)*jobsPerPage,page*jobsPerPage))
    };
    useEffect(() => {
        setJobs(jobs.slice(0, 6))
    }, [])

    useEffect(() => {
        fetchPostingJobs(page).then((r)=> {
            setJobs(r)
        })
    }, [page]);

    return (
        <>
            {showUpdateJob === true &&
                <div className="fullscreen_white_div">
                    <img onClick={() => { setShowUpdateJob(false) }} style={{marginLeft:'5%'}} src={backArrowIcon} alt="" />
                    <UpdatePostJobForm jobId={jobIdForUpdate} job={jobForUpdate} />
                </div>
            }
            {showUpdateJob === false &&
                <>
                    <div className='job_dashboard'>

                        <h2 className="job_dashboard_title">My Jobs ({jobsPerPage})</h2>
                        <div className='job_table'>
                            <div className='job_table_thead'>
                                <div className='job_table_th job_table_td_name'>Job Title</div>
                                <div className='job_table_th'>Job Posted On</div>
                                <div className='job_table_th'>Actions</div>
                            </div>
                            {jobs?.map(({ createdAt = "", jobTitle = "", id }, i) => (<div key={i} className='job_table_tbody'>
                                <div className='job_table_td job_table_td_name'>{jobTitle}</div>
                                <div className='job_table_td'>created {new Date(createdAt.seconds * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                                <div className='job_table_td'>
                                    <select onChange={(e) => handleAction(e, id, jobs[i])} className="job_table_select">
                                        <option value="Actions">Actions</option>
                                        <option value="Edit">Edit</option>
                                        <option value="Delete">Delete</option>
                                    </select>
                                </div>
                            </div>))}
                            <div className='pagination_boxes'>
                                {(new Array(Math.ceil(jobsLength / jobsPerPage)).fill((0))
                                    .map((e, i) => (
                                        <div key={i} style={i + 1 === page ? { color: "blue", background: "#DADDE0" } : {}}
                                            onClick={() => { setPage(i + 1) }}
                                            className={'pagination_box'}>{i + 1}
                                        </div>)))}
                                <img
                                    onClick={() => (jobsLength / jobsPerPage) > page ? setPage(c => c + 1) : setPage(1)}
                                    src={nextIcon} alt="" className='' />
                            </div>
                        </div>
                    </div>

                </>
            }
        </>

    )
}