import { useEffect, useState } from "react";
import { delteRedIcon, inboxIcon, nextIcon } from "../../assets";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";


const fetchJobApplicants = async (userId = "123@gmail.com",postingJobId) => {
    try {
        const personDocRef = doc(database, 'person', userId);
        const docsSnap = await getDoc(personDocRef);
        return docsSnap.data();
    } catch (error) {
        console.log(error)
        return [];
    }

}

const fetchJobPosts = async () => {
    try {
        const persons = collection(database, "persons");
        const userId = "123@gmail.com";
        // const userId = sessionStorage.getItem("userId");
        const userRef = doc(persons, userId);
        const subcollectionRef = collection(userRef, "postingJobs");
        const postedJobs = await getDocs(subcollectionRef);

        let applicantsArray = [];

        const asyncFetches = postedJobs.docs.map(async (doc) => {
            const data = doc.data();
            const { identitiesUserApplyes } = data;
            const applicants = [];
            console.log(data)
            if (!!identitiesUserApplyes?.length) {
                const fetchPromises = identitiesUserApplyes.map(async e => {
                    let res = await fetchJobApplicants(e,data.postingJobId);
                    console.log(res)
                        // res.identitiesUserApplye = e;
                    return res||{};
                });
                const results = await Promise.all(fetchPromises);
                applicants.push(...results);
            }

            applicantsArray.push(...applicants);
        });

        await Promise.all(asyncFetches);

        return applicantsArray;
    } catch (error) {
        console.log(error);
        return [];
    }
}

let applications = [];

export const Application = () => {


    const [jobs, setJobs] = useState([])
    const [jobsLength, setJobLength] = useState(20);
    const [page, setPage] = useState(1);
    const jobsPerPage = 5

    const handleDelete = async (index) => {
        const application = applications[index];

        try {
            const persons = collection(database, "persons");
            const userId = "123@gmail.com";
            // const userId = sessionStorage.getItem("userId");
            const userRef = doc(persons, userId);
            const subcollectionRef = collection(userRef, "postingJobs");
            const postedJobs = await getDocs(subcollectionRef);
            // console.log(postedJobs)
            postedJobs.forEach(async doc=>{
                console.log(doc.data())
                const data = doc.data();
                if(data.postingJobId==application.postingJobId){
                    if(data?.identitiesUserApplyes?.length){
                        let filtered = data.identitiesUserApplyes.filter(e=>e!=application.identitiesUserApplye)
                        await updateDoc(doc.ref, { identitiesUserApplyes: filtered });
                    }
                }
            })


            setJobs(prev=>prev.filter((e,i)=>i!=index));
            applications=applications.filter((e,i)=>i!=index);
            console.log('Document deleted successfully.');
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const fetchJobs = async page => {
        if (!applications.length) {
            const result = await fetchJobPosts();
            const usedata = result.map((e, i) => {
                console.log(e)
                e.name = e.name || `test_name_${i}`;
                e.payable = "Accounts Payable"
                if (e.updatedAt) {
                    const date = new Date(e.updatedAt.seconds * 1000);
                    const formattedDate = date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    e.updatedAt = formattedDate;
                }
                return e;
            })
            applications = usedata;
            const startIndex = (page - 1) * jobsPerPage;
            const endIndex = page * jobsPerPage;
            return usedata.slice(startIndex, endIndex);
        } else {
            const startIndex = (page - 1) * jobsPerPage;
            const endIndex = page * jobsPerPage;
            return applications.slice(startIndex, endIndex);
        }
    }

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
            {jobs.map(({ updatedAt = "", firstName = "", lastName="",payable = "" }, i) => (<div key={i} className='job_table_tbody'>
                <div className='job_table_td job_table_td_name app_table_td_name'>{firstName+" "+lastName}
                    <div>{payable}</div>
                </div>
                <div className='job_table_td'>{updatedAt}</div>
                <div className='job_table_td application_action'>
                    <img src={inboxIcon} alt="" />
                    <img src={delteRedIcon} alt="" onClick={() => { handleDelete(i) }} />
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