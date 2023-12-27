import { backArrowIcon, deleteIcon, editIcon } from "../../assets";
import { useEffect, useState } from "react";
import { JobApplyFormEdit } from "../JobApplyFormEdit.jsx";
import { doc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { database } from "../../firebaseConfig.js";

const profileDetailsInit = {
    firstName: "",
    lastName: "",
    phone: "+1 732 924 3241",
    email: "iliasdemo@gmail.com",
    address: "Brooklyn, New York",
    education: "Master’s degree CUNY school of medicine",
    skills: ["QuickBooks", "Microsoft Excel"],
    educationTime: "April 2015 to April 2019",
    cityName: "",
    work: {
        jobTitle: "UI UX Designer",
        company: "Fiverr/Upwork ",
        description: "",
        JobPeriodToYear: "",
        JobPeriodToMonth:"",
        JobPeriodFromYear: "",
        JobPeriodFromMonth: ""
    }
}
export const MyResume = () => {

    const [profileDetails, setProfileDetails] = useState(profileDetailsInit);
    const [page, setPage] = useState(-1)

    const fetchDetails = async () => {
        try {
            const userId = sessionStorage.getItem("userId")
            const personDocRef = doc(database, 'person', userId);
            const docsSnap = await getDoc(personDocRef);
            const userData = docsSnap?.data();
            console.log(userData)
            setProfileDetails(userData);
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        fetchDetails();
    }, [])

    return (
        <div className='my_resume'>
            {page < 0 ? (<div className='my_resume_box'>
                <div className='resume_prof_details'>
                    <div className='resume_prof_edit_head'>
                        <div className="my_resume_name">{profileDetails.firstName + " " + profileDetails.lastName}</div>
                        <div className='my_resume_edit_imgs'>
                            <img src={editIcon} alt="" onClick={() => setPage(1)} />
                        </div>
                    </div>
                    <div className="resume_desc_details">{profileDetails.phone}</div>
                    <div className="resume_desc_details">{profileDetails.email}</div>
                    <div className="resume_desc_details">{profileDetails.address}</div>
                </div>
                <div className='resume_prof_details'>
                    <div className='resume_prof_edit_head'>
                        <div className="my_resume_name">Work experience</div>
                        <div className='my_resume_edit_imgs'>
                            <img src={editIcon} alt="" onClick={() => setPage(2)} />
                            <img src={deleteIcon} onClick={() => { setProfileDetails(prev => ({ ...prev, jobTitle: "", company: "" })) }} alt="" />
                        </div>
                    </div>
                    <div className="resume_desc_details">{profileDetails.work?.jobTitle}</div>
                    <div className="resume_desc_details">{profileDetails.work?.company}</div>
                </div>
                <div className='resume_prof_details'>
                    <div className='resume_prof_edit_head'>
                        <div className="my_resume_name">Education</div>
                        <div className='my_resume_edit_imgs'>
                            <img src={editIcon} alt="" onClick={() => setPage(3)} />
                            <img src={deleteIcon} onClick={() => { setProfileDetails(prev => ({ ...prev, educationTime: "", education: "" })) }} alt="" />
                        </div>
                    </div>
                    <div className="resume_desc_details">{profileDetails.education}</div>
                    <div className="resume_desc_details">{profileDetails.educationTime}</div>
                </div>
                <div className='resume_prof_details'>
                    <div className='resume_prof_edit_head'>
                        <div className="my_resume_name">Skills</div>
                        <div className='my_resume_edit_imgs'>
                            <img src={editIcon} alt="" onClick={() => setPage(4)} />
                            <img src={deleteIcon} onClick={() => { setProfileDetails(prev => ({ ...prev, skills: [] })) }} alt="" />
                        </div>
                    </div>
                    {!!profileDetails.length && profileDetails.skills.map((e, i) => (
                        <div key={i} className="resume_desc_details">{e}</div>
                    ))}
                </div>
            </div>) : (<JobApplyFormEdit setProfileDetails={setProfileDetails} profileDetails={profileDetails} setPage={setPage} page={page} />)}
        </div>
    )
}