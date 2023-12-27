import React, { useState, useContext, useEffect } from 'react'
import { Card, Button, Container, Form } from 'react-bootstrap';
import { collection, setDoc, doc, serverTimestamp, updateDoc, arrayUnion, getDoc, Timestamp } from "firebase/firestore";
import { database } from "./firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { idJobToApplyContext } from './Context';
import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import "./styles/jobApplyForm.css"
import { addMore, backArrowIcon, crossIcon, deleteIcon, dragIcon, orLineIcon, uploadIcon } from "./assets/index"
import Footer from './components/Footer';
import NavBar from './components/NavBar';

export function JobApplyForm() {

    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId") ?? null;
    const [cardNumber, setCardNumber] = useState(1);
    const jobToApplyId = sessionStorage.getItem("jobId")

    const SaveAndExit = ({ changeTo }) => {
        return (<div className='job_save_exit'>
            <div className='job_save_exit_head'>
                {cardNumber !== 1 && <img onClick={() => { setCardNumber(changeTo) }} className='' src={backArrowIcon} alt="" />}
                <div className='job_save_exit_text' onClick={(e) => navigate(-1)}>Exit</div>
            </div>
            <div className='job_save_exit_progress'>
                <div style={{ width: `${((cardNumber / 5) * 100)}%` }} className='job_save_exit_complete'></div>
                <div style={{ width: `${(((5 - cardNumber) / 5) * 100)}%` }} className='job_save_exit_left'></div>
            </div>
        </div>)
    }

    // handling errors in card number 1
    const [errors, setErrors] = useState({}); // To store error messages
    const errorValues = Object.values(errors);

    const validation = {

        firstName: () => {
            if (firstName.length === 0) {
                return "First name is required.";
            }

            const nameRegex = /^[\u0590-\u05FFa-zA-Z]+$/u;
            return nameRegex.test(firstName.trim());
        },

        lastName: () => {
            if (lastName === '') {
                return "Last name is required.";
            }

            const nameRegex = /^[\u0590-\u05FFa-zA-Z]+$/u;
            return nameRegex.test(lastName.trim());
        },
        city: () => {
            if (city === '')
                return true;

            const nameRegex = /^[a-zA-Z .'-]+$/;
            return nameRegex.test(city.trim());
        },
        phone: () => {
            if (phone === '') {
                return "Phone is required.";
            }
            const phoneNumberRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
            return phoneNumberRegex.test(phone.trim());
        }
    };
    const handleBlur = (field) => {

        const error = validation[field](field === 'phone' ? phone : field.trim()); // Trim the value for firstName and lastName
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error || 'Invalid input',
        }));
    };

    // card 1
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneAreaCode, setPhoneAreaCode] = useState('')
    const [resumeOption, setResumeOption] = useState('')

    //card 2
    async function submitUserDetailsNoResume() {
        const userId = sessionStorage.getItem("userId")
        const userRef = doc(database, "person", userId)
        const additionalData = {
            city: city,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            updatedAt: serverTimestamp()
        }
        try {
            await updateDoc(userRef, additionalData);
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }
    const handleContinueBtn = (e) => {
        e.preventDefault();
        if (resumeOption === 1)
            setCardNumber(3);
        else if (resumeOption === 2)
            setCardNumber(4)
        else if (resumeOption === 3) {
            try {
                submitUserDetailsNoResume()
                // updateIdentitiesUserApplies()
                addToApplicationsCollection()
                updateApplyJobs()
            } catch (err) {
                console.log(err)
            }
            navigate(-1)
        }
    }
    //card 3 - file uploading
    const [imgFile, setImageFile] = useState('');

    async function submitUserFileDetails(fileName) {

        const userRef = doc(database, "person", userId)
        const additionalData = {
            city: city,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            resumeFileName: fileName,
            updatedAt: serverTimestamp()
        }
        try {
            await updateDoc(userRef, additionalData);
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }
    const uploadFile = async () => {
        const myId = uuidv4()

        if (imgFile != null) {
            // db ref
            const refFIle = ref(storage, "resumes/" + imgFile.name + myId);
            // uploading file bytes
            await uploadBytes(refFIle, imgFile);

            const fileName = imgFile.name + myId
            await submitUserFileDetails(fileName)
            // await updateIdentitiesUserApplies()
            await addToApplicationsCollection()
        }
    };


    // card 4 - education
    const today = new Date();
    const currentYear = today.getFullYear();
    const years = [...Array(31).keys()].map((year) => currentYear - year);

    const [education, setEducation] = useState([
        {
            educationLevel: "",
            schoolName: "",
            studyName: "",
            timeOfStudyFromMonth: "",
            timeOfStudyFromYear: "",
            timeOfStudyToMonth: "",
            timeOfStudyToYear: ""
        }])
    const handleEducationChange = (event, index) => {
        let { name, value } = event.target;
        let onChangeValue = [...education];
        onChangeValue[index][name] = value;
        setEducation(onChangeValue);
    };
    const handleAddEducationInput = () => {
        setEducation([...education, {
            educationLevel: "",
            schoolName: "",
            studyName: "",
            timeOfStudyFromMonth: "",
            timeOfStudyFromYear: "",
            timeOfStudyToMonth: "",
            timeOfStudyToYear: ""
        }]);
    };
    const handleDeleteInput = (index) => {
        const newArray = [...education];
        newArray.splice(index, 1);
        setEducation(newArray);
    };
    //card 5 - work history
    const [jobs, setJobs] = useState([
        {
            company: "",
            description: "",
            timeOfWorkFromMonth: "",
            timeOfWorkFromYear: "",
            timeOfWorkToMonth: "",
            timeOfWorkToYear: "",
            title: ""
        }])
    const handleWorkHistoryChange = (event, index) => {
        let { name, value } = event.target;
        let onChangeValue = [...jobs];
        onChangeValue[index][name] = value;
        setJobs(onChangeValue);
    };
    const handleAddWorkHistoryInput = () => {
        setJobs([...jobs, {
            company: "",
            description: "",
            timeOfWorkFromMonth: "",
            timeOfWorkFromYear: "",
            timeOfWorkToMonth: "",
            timeOfWorkToYear: "",
            title: ""
        }]);
    };
    const handleDeleteWorkHistoryInput = (index) => {
        const newArray = [...jobs];
        newArray.splice(index, 1);
        setJobs(newArray);
    };
    //card 6 - skills
    const [skills, setSkills] = useState([])
    const [inputValue, setInputValue] = useState('');

    const handleSkillInputChange = (event) => {
        setInputValue(event.target.value);
    };
    const addSkill = () => {
        setSkills([...skills, inputValue]);
        setInputValue('');
    };
    const removeSkill = (index) => {
        setSkills(skills.filter((item, i) => i !== index));
    };

    // functions for submitting applications
    const getCurrentDateTimeString = () => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        const hours = currentDate.getHours().toString().padStart(2, "0");
        const minutes = currentDate.getMinutes().toString().padStart(2, "0");
        const seconds = currentDate.getSeconds().toString().padStart(2, "0");

        return `${hours}_${minutes}_${seconds}_${year}_${month}_${day}`;
    }
    function submitApply() {

        skills?.map(s => (
            submitSkills(s)
        ))
        education?.map(e => (
            submitEducation(e)
        ))
        jobs?.map(job => (
            submitWorkHistory(job)
        ))
        submitUserDetails()
        updateApplyJobs()
        // updateIdentitiesUserApplies()
        addToApplicationsCollection()
        navigate(-1)
    }
    async function submitSkills(s) {

        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
        const words = s.split(" ");
        const firstWord = words[0];
        const subcollectionRef = collection(userRef, "skills");
        try {
            await setDoc(doc(subcollectionRef, firstWord), {
                createdAt: serverTimestamp(),
                skillName: s
            });

        } catch (error) {
            console.error("Error adding document:", error);
        }
    }
    async function submitEducation(e) {
        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
        const DocId = `${e.timeOfStudyFromYear}-${e.timeOfStudyToYear}`
        const subcollectionRef = collection(userRef, "educations");

        try {
            await setDoc(doc(subcollectionRef, DocId), {
                educationLevel: e.educationLevel,
                schoolName: e.schoolName,
                studyName: e.studyName,
                timeOfStudyFromMonth: e.timeOfStudyFromMonth,
                timeOfStudyFromYear: e.timeOfStudyFromYear,
                timeOfStudyToMonth: e.timeOfStudyToMonth,
                timeOfStudyToYear: e.timeOfStudyToYear
            });
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }
    async function submitWorkHistory(job) {

        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
        const docId = `${job.timeOfWorkFromYear}-${job.timeOfWorkToYear}`
        const subcollectionRef = collection(userRef, "workHistory");
        try {
            await setDoc(doc(subcollectionRef, docId), {
                company: job.company,
                description: job.description,
                title: job.title,
                timeOfWorkFromMonth: job.timeOfWorkFromMonth,
                timeOfWorkFromYear: job.timeOfWorkFromYear,
                timeOfWorkToMonth: job.timeOfWorkToMonth,
                timeOfWorkToYear: job.timeOfWorkToYear
            });
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }
    async function updateApplyJobs() {

        const persons = collection(database, "person");
        const userRef = doc(persons, userId);

        const subcollectionRef = collection(userRef, "applyJobs");
        try {
            await setDoc(doc(subcollectionRef, getCurrentDateTimeString()), {
                applyId: getCurrentDateTimeString(),
                postJobId: jobToApplyId,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }
    function extractDateTime(str) {
        const string = str + ''
        const dateTime = string.split("_");
        const timeAndDate = dateTime.slice(0, 6).join("_");
        return timeAndDate;
    }
    function extractEmailFromDateString(dateString) {
        const str = dateString + ''
        const substrings = str.split('_');

        const email = substrings[substrings.length - 1];
        return email;
    }
    async function updateIdentitiesUserApplies() {
        const persons = collection(database, "person");
        const userRef = doc(persons, extractEmailFromDateString(jobToApplyId));
        const docId = extractDateTime(jobToApplyId)
        const subcollectionRef = collection(userRef, "postingJobs");

        try {
            await updateDoc(doc(subcollectionRef, docId), {
                identitiesUserApplyes: arrayUnion(userId)
            });
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }
    async function submitUserDetails() {

        const userRef = doc(database, "person", userId)
        const additionalData = {
            city: city,
            firstName: firstName,
            lastName: lastName,
            isActive: true,
            phoneNumber: phone,
            updatedAt: serverTimestamp()
        }
        try {
            await updateDoc(userRef, additionalData);
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }
    async function addToApplicationsCollection() {
        const employeeId = extractEmailFromDateString(sessionStorage.getItem("jobId"));
        const postDate = extractDateTime(sessionStorage.getItem("jobId"))
        const userId = sessionStorage.getItem("userId");
        const applicationDocId = employeeId + "_#_" + postDate + "_#_" + userId;

        try {
            await setDoc(doc(database, "jobApplications", applicationDocId), {
                createdAt: serverTimestamp(),
                firstName: firstName,
                lastName: lastName,
                jobTitle: sessionStorage.getItem("jobTitle"),
            });
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }

    return (
        <>
            <NavBar />
            <Container className='job_apply_form' style={{paddingTop:"100px"}}>

                {cardNumber === 1 &&
                    <Card>
                        <Card.Body className='job_apply_form_body'>
                            <SaveAndExit />

                            <Form className='job_form_apply_fields'>
                                <h4>Add your contact information</h4>
                                <div className='job_apply_field'>
                                    <Form.Label className='job_form_field'>First name</Form.Label>
                                    <Form.Control className='job_form_input' type='text' onChange={(e) => setFirstName(e.target.value)} onBlur={() => handleBlur('firstName')} required value={firstName} />
                                    {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                                </div>
                                <div className='job_apply_field'>
                                    <Form.Label className='job_form_field'>Last name</Form.Label>
                                    <Form.Control className='job_form_input' type='text' onChange={(e) => setLastName(e.target.value)} onBlur={() => handleBlur('lastName')} required value={lastName} />
                                    {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                                </div>
                                <div className='job_apply_field'>
                                    <label htmlFor="email" className='job_form_field'>Email</label>
                                    <input type="email" className='job_form_input' id="email" onChange={(e) => setEmail(e.target.value)} defaultValue={userId} readOnly />
                                </div>
                                <div className='job_apply_field'>
                                    <Form.Label>City (optional)</Form.Label>
                                    <Form.Control type='text' onChange={(e) => setCity(e.target.value)} onBlur={() => handleBlur('city')} />
                                    {errors.city && <p className="error-message">{errors.city}</p>}
                                </div>
                                <div className='job_apply_field'>
                                    <Form.Label htmlFor="phone" className='job_form_field' onChange={(e) => setPhone(e.target.value)} required value={phone} onBlur={() => handleBlur('phone')}>Phone number</Form.Label>
                                    <div className='job_form_phone_input'>
                                        <Form.Select size="lg" className='job_form_phone_code' onChange={(e) => setPhoneAreaCode(e.target.value)} required value={phoneAreaCode}>
                                            <option>+1</option>
                                        </Form.Select>
                                        <Form.Control className='job_form_input' type='text' id="phone" name="phone" onChange={(e) => setPhone(e.target.value)} value={phone} onBlur={() => handleBlur('phone')} />
                                    </div>
                                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                                </div>
                                <button className='job_form_submit' type='button' onClick={() => {

                                    // Validate all fields before submission
                                    for (const field in validation) {
                                        handleBlur(field);
                                    }
                                    if (firstName === '' || lastName === '' || phone === '') {
                                        return; // Do not proceed with signUp function if any required field is empty
                                    }

                                    if (errorValues.every(value => value === true)) {
                                        setCardNumber(2);
                                    }
                                }}>Continue</button>
                            </Form>
                        </Card.Body>
                    </Card>
                }
                {cardNumber === 2 &&
                    <Card>
                        <Card.Body className='job_apply_form_body'>
                            <SaveAndExit changeTo={1} />


                            <Form className='job_form_apply_fields'>
                                <h4>Add a resume for the employer</h4>

                                <Container type='button' className='job_apply_upload_box' onClick={(e) => setResumeOption(1)} style={resumeOption === 1 ? { border: "navy 1px solid" } : null}>
                                    <img src={uploadIcon} className='uplaod_icon' alt="" />
                                    <div>
                                        <h4 className='job_form_head_field'>Upload a resume</h4>
                                        <p className='job_form_upload_desc'>Accepted file types: PDF, DOCX</p>
                                    </div>
                                </Container>
                                <img src={orLineIcon} alt="" />
                                <Container className='job_apply_upload_box' type='button' onClick={(e) => setResumeOption(2)} style={resumeOption === 2 ? { border: "navy 1px solid" } : null}>
                                    <img src={uploadIcon} className='uplaod_icon' alt="" />
                                    <div>
                                        <p className='job_form_upload_desc_rec'>Recommended</p>
                                        <h4 className='job_form_head_field'>Build a Logoipsum Resume</h4>
                                        <p className='job_form_upload_desc'>We’ll guide you through it, there are only a few steps</p>
                                    </div>
                                </Container>
                                <img src={orLineIcon} alt="" />
                                <Container type='button' className='job_apply_upload_box' onClick={(e) => setResumeOption(3)} style={resumeOption === 3 ? { border: "navy 1px solid" } : null}>
                                    <img src={uploadIcon} className='uplaod_icon' alt="" />
                                    <div>
                                        <h4 className='job_form_head_field'>Continue without a resume</h4>
                                        <p className='job_form_upload_desc'>We highly recommend that you provide a resume!</p>
                                    </div>
                                </Container>
                                <br />
                                <button className='job_form_submit' onClick={(e) => handleContinueBtn(e)}>Continue</button>

                            </Form>
                            
                        </Card.Body>
                    </Card>
                }
                {cardNumber === 3 &&
                    <Card>
                        <Card.Body className='job_apply_form_body'>
                            <Form className='job_form_apply_fields'>
                                <SaveAndExit changeTo={2} />

                                <div className='job_form_resume_head'>
                                    <h5>Upload a resume</h5>
                                    <img src={crossIcon} alt="" />
                                </div>
                                <label htmlFor='resume_file'>
                                    <h6 className='job_form_resume_accept'>Acceptable files: docx,pdf</h6>
                                    <Container className='job_form_resume_box'>
                                        <img src={dragIcon} alt="" />
                                        <h6>Drag and drop here, or</h6>
                                        <h6>Select a file</h6>
                                    </Container>
                                    {/* <input type='file' onChange={(e) => { setImageFile(e.target.files[0]) }} accept=".docx,.pdf" /> */}

                                    <input type='file' placeholder='' id='resume_file' onChange={(e) => { setImageFile(e.target.files[0]) }} accept=".docx,.pdf" />
                                </label>
                                <div className='job_form_resume_upload_btns'>
                                    <button className='job_form_resume_canel_btn'>Cancel</button>
                                    <button className='job_form_resume_upload_btn' onClick={uploadFile}>Upload</button>
                                    {/* <Button onClick={uploadFile}>Upload</Button> */}
                                </div>
                                <div>
                                    <p>uploading resume file</p>
                                    <input type='file' onChange={(e) => { setImageFile(e.target.files[0]) }} accept=".docx,.pdf" />
                                    <button onClick={uploadFile} >upload file</button>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                }
                {cardNumber === 4 &&
                    <Card>
                        <Card.Body className='job_apply_form_body'>
                            <Form className='job_form_apply_fields'>
                                <SaveAndExit changeTo={2} />
                                <div>
                                    <p className='job_form_upload_desc'>Build your resume (1 of 4)</p>
                                    <p className='job_form_field'>Do you want to add any education details?</p>
                                </div>
                                {education?.map((e, index) => (
                                    <div key={index}>
                                        <Form.Label className='job_form_field'>Level of education *</Form.Label>
                                        <Form.Control className='job_form_input' type='text' name='educationLevel' required value={e.educationLevel} onChange={(e) => handleEducationChange(e, index)} />
                                        <Form.Label className='job_form_field'>Field of study</Form.Label>
                                        <Form.Control className='job_form_input' type='text' name='studyName' required value={e.studyField} onChange={(e) => handleEducationChange(e, index)} />
                                        <Form.Label className='job_form_field'>Name of school</Form.Label>
                                        <Form.Control className='job_form_input' type='text' name='schoolName' required value={e.schoolName} onChange={(e) => handleEducationChange(e, index)} />

                                        <Form.Text className='job_form_field'>Time period</Form.Text>
                                        <Form.Group className='job_edu_form_date'>
                                            <Form.Label>From</Form.Label>
                                            <div>
                                                <Form.Select name='timeOfStudyFromMonth' value={e.timeOfStudyFromMonth} onChange={(e) => handleEducationChange(e, index)}>
                                                    <option>Month</option>
                                                    {[...new Array(12).keys()].map((i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Select name='timeOfStudyFromYear' value={e.timeOfStudyFromYear} onChange={(e) => handleEducationChange(e, index)}>
                                                    <option>Year</option>
                                                    {years.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </Form.Group>
                                        <Form.Group className='job_edu_form_date'>
                                            <Form.Label>To</Form.Label>
                                            <div>
                                                <Form.Select name='timeOfStudyToMonth' value={e.timeOfStudyToMonth} onChange={(e) => handleEducationChange(e, index)}>
                                                    <option>Month</option>
                                                    {[...new Array(12).keys()].map((i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Select name='timeOfStudyToYear' value={e.timeOfStudyToYear} onChange={(e) => handleEducationChange(e, index)}>
                                                    <option>Year</option>
                                                    {years.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </Form.Group>
                                        {index === education.length - 1 && (
                                            <div className='job_form_add' onClick={() => handleAddEducationInput()}>
                                                <img src={addMore} alt="" />
                                                Add more
                                            </div>

                                        )}
                                    </div>
                                ))}

                                <Button onClick={(e) => setCardNumber(5)} className='job_form_submit skill_btn'>Save and continue</Button>

                            </Form>
                        </Card.Body>
                    </Card>
                }
                {cardNumber === 5 &&
                    <Card>
                        <Card.Body className='job_apply_form_body'>
                            <Form className='job_form_apply_fields'>
                                <SaveAndExit changeTo={4} />
                                <Form.Text>Do you want to add work history?</Form.Text>
                                {jobs?.map((job, index) => (
                                    <div key={index}>
                                        <Form.Group>
                                            <Form.Label className='job_form_field'>Job title *</Form.Label>
                                            <Form.Control className='job_form_input' type='text' name='title' value={job.title} required onChange={(e) => handleWorkHistoryChange(e, index)} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className='job_form_field'>Company</Form.Label>
                                            <Form.Control className='job_form_input' type='text' name='company' value={job.company} required onChange={(e) => handleWorkHistoryChange(e, index)} />
                                        </Form.Group>

                                        <Form.Text className='job_form_field'>Time period</Form.Text>
                                        <Form.Group className='job_edu_form_date'>
                                            <Form.Label>From</Form.Label>
                                            <div>
                                                <Form.Select name='timeOfWorkFromMonth' value={job.timeOfWorkFromMonth} onChange={(e) => handleWorkHistoryChange(e, index)}>
                                                    <option>Month</option>
                                                    {[...new Array(12).keys()].map((i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Select name='timeOfWorkFromYear' value={job.timeOfWorkFromYear} onChange={(e) => handleWorkHistoryChange(e, index)}>
                                                    <option>Year</option>
                                                    {years.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </Form.Group>
                                        <Form.Group className='job_edu_form_date'>
                                            <Form.Label>To</Form.Label>
                                            <div>
                                                <Form.Select name='timeOfWorkToMonth' value={job.timeOfWorkToMonth} onChange={(e) => handleWorkHistoryChange(e, index)}>
                                                    <option>Month</option>
                                                    {[...new Array(12).keys()].map((i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                <Form.Select name='timeOfWorkToYear' value={job.timeOfWorkToYear} onChange={(e) => handleWorkHistoryChange(e, index)}>
                                                    <option>Year</option>
                                                    {years.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </Form.Group>
                                        <div className='job_form_desc_box'>
                                            <Form.Label>Description</Form.Label>
                                            <Form.Text>Describe your position and any significant accomplishments</Form.Text>
                                        </div>
                                        <textarea
                                            rows="5"
                                            name='description'
                                            value={job.description}
                                            onChange={(e) => handleWorkHistoryChange(e, index)}
                                        />
                                        {index === jobs.length - 1 && (
                                            <div className='job_form_add' onClick={() => handleAddWorkHistoryInput()}>
                                                <img src={addMore} alt="" />
                                                Add more
                                            </div>
                                        )}

                                    </div>
                                ))}
                                <div className='job_form_desc_btn_box'>

                                    <Button className='job_form_submit' onClick={(e) => setCardNumber(6)}>Save and continue</Button>

                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                }
                {cardNumber === 6 &&
                    <Card>
                        <Card.Body className='job_apply_form_body'>
                            <SaveAndExit changeTo={5} />

                            <Form className='job_form_apply_fields' >
                                <div>
                                    <p className='job_form_upload_desc'>Build your resume (3 of 4)</p>
                                    <label htmlFor="phone">Do you want to share some of your skills?</label>
                                </div>
                                <Form.Text>we recommend adding at least 6 skills</Form.Text>
                                <div className='job_form_field_box'>
                                    <input type="text" class="form-control" placeholder='Add a skill' value={inputValue} onChange={handleSkillInputChange} />
                                    <img src={addMore} alt="" className='add_skill_img' onClick={addSkill} />
                                </div>
                                {skills?.map((skill, index) => (
                                    <div className='job_form_field_dlt_box'>
                                        <input className='job_form_input' type="text" value={skill} />
                                        <img src={deleteIcon} alt="" onClick={() => { removeSkill(index) }} />
                                    </div>
                                ))}
                                <Button className='job_form_submit skill_btn' onClick={submitApply}>Save and continue</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                }
            </Container>
            <Footer/>
        </>
    )
}
