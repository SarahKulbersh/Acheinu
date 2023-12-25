import { useEffect, useState } from "react";
import { nextIcon } from "../../assets";
import { collection } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { getDocs, getDoc } from "firebase/firestore";

const initState = [{
    name: "Bookkeeper", createdAt: "July 23 2023", payable: "Accounts Payable"
}, {
    name: "Accounts Payable", createdAt: "July 23 2023", payable: "Accounts Payable"
}, {
    name: "Inventory Management", createdAt: "July 23 2023", payable: "Accounts Payable"
}, {
    name: "Underwriter", createdAt: "July 23 2023", payable: "Accounts Payable"
}, {
    name: "Interior Designer", createdAt: "July 23 2023", payable: "Accounts Payable"
}, {
    name: "CRM Manager", createdAt: "July 23 2023", payable: "Accounts Payable"
}
]

for (let i = 0; i < 33; i++) initState.push(initState[Math.floor(Math.random() * 5)])

export const Applications = () => {

    const [jobs, setJobs] = useState([])
    const [jobsLength, setJobLength] = useState(36);
    const [page, setPage] = useState(1);
    const jobsPerPage = 6

    const fetchJobs = async page => {
        return (initState.slice((page - 1) * jobsPerPage, page * jobsPerPage))
    }


    useEffect(() => {
        fetchJobs()
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
            {jobs.map(({ createdAt = "", name = "", payable = "" }, i) => (<div key={i} className='job_table_tbody'>
                <div className='job_table_td job_table_td_name app_table_td_name'>{name}
                    <div>{payable}</div>
                </div>
                <div className='job_table_td'>{createdAt}</div>
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