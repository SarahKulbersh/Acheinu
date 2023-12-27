import { useEffect, useState } from "react";
import { nextIcon } from "../../assets";
import { collection, doc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { getDocs, getDoc } from "firebase/firestore";

const initState = [{
    firstName: "Bookkeeper", updatedAt: "July 23 2023", payable: "Accounts Payable"
}, {
    firstName: "Accounts Payable", updatedAt: "July 23 2023", payable: "Accounts Payable"
}, {
    firstName: "Inventory Management", updatedAt: "July 23 2023", payable: "Accounts Payable"
}, {
    firstName: "Underwriter", updatedAt: "July 23 2023", payable: "Accounts Payable"
}, {
    firstName: "Interior Designer", updatedAt: "July 23 2023", payable: "Accounts Payable"
}, {
    firstName: "CRM Manager", updatedAt: "July 23 2023", payable: "Accounts Payable"
}
]


let applicationsBackup = [];

export const Applications = () => {

    const [jobs, setJobs] = useState([])
    const [jobsLength, setJobLength] = useState(36);
    const [page, setPage] = useState(1);
    const jobsPerPage = 6

    const fetchJobs = async page => {

        if(applicationsBackup.length) 
            return applicationsBackup.slice((page - 1) * jobsPerPage, page * jobsPerPage);

        const persons = collection(database, "persons");
        const userId = "123@gmail.com";
        // const userId = sessionStorage.getItem("userId");
        const userRef = doc(persons, userId);
        const subcollectionRef = collection(userRef, "applyJobs");
        const applyJobs = await getDocs(subcollectionRef);
        const applications = [];
        applyJobs.forEach(doc=>{
            const data = doc.data();
            data.updatedAt = new Date((data.updatedAt?.seconds||1000)*1000).toDateString();
            applications.push(data);
        })
        applicationsBackup = applications;
        return applications.slice((page - 1) * jobsPerPage, page * jobsPerPage);
    }


    useEffect(() => {
        fetchJobs(1)
        setJobs(initState.slice(0, 6))
    }, [])

    useEffect(() => {
        fetchJobs(page).then((r) => {
            setJobs(r)
        })
    }, [page]);

    return (<div className='job_dashboard'>
        <h2 className="job_dashboard_title">My Applications ({jobsPerPage})</h2>
        <div className='job_table'>
            <div className='job_table_thead'>
                <div className='job_table_th job_table_td_name'>Applicants</div>
                <div className='job_table_th'>Applied Date</div>
                <div className='job_table_th'>Actions</div>
            </div>
            {jobs.map(({ updatedAt = "", firstName = "",lastName="", payable = "" }, i) => (<div key={i} className='job_table_tbody'>
                <div className='job_table_td job_table_td_name app_table_td_name'>{firstName+" "+lastName}
                    <div>{payable}</div>
                </div>
                <div className='job_table_td'>{updatedAt}</div>
                <div className='job_table_td job_table_td_action'>
                    View application
                </div>
            </div>))}
            <div className='pagination_boxes'>
                {(new Array(Math.floor(jobsLength / jobsPerPage)).fill((0))
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

    )
}