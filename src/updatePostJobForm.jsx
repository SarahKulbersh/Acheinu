import React from 'react'
import { Card, Button, Container, Form } from 'react-bootstrap';
import { useState } from 'react';
import { collection, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { database } from "./firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { leftArrow, rightArrow } from './assets';
import "./styles/jobPost.css";
import AddIcon from './assets/AddIcon';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';

export function UpdatePostJobForm({job, jobId}) {

    const hoursList = [
        "00:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM",
        "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
        "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
    ];

    const [location, setLocation] = useState(job.jobLocation);
    const [jobTitle, setJobTitle] = useState(job.jobTitle);
    const [selectedFullPart, setSelectedFullPart] = useState(job.isFullTimeJob);
    const [selectedTime, setSelectedTime] = useState(job.isEST?("Eastern Time (EST)") : ("Israel Time (IST)"));
    const [startTime, setStartTime] = useState(job.startedTimeFrom);
    const [endTime, setEndTime] = useState(job.endedTimeIn);
    const [description, setDescription] = useState(job.jobDescription);

    const handleSetDescription = (description) => {
        const newDescription = description.split('\n').join('<r/>');
        setDescription(newDescription);
    }
    const [selectedShowPay, setSelectedShowPay] = useState('Range');
    const [minPay, setMinPay] = useState(job.minPay);
    const [maxPay, setMaxPay] = useState(job.maxPay);
    const [selectedRatePer, setSelectedRatePer] = useState(job.jobPaymentPer);

    const [cardNumber, setCardNumber] = useState(1);
    const navigate = useNavigate();

    function handleContinueBtn(cardNumber) { setCardNumber(cardNumber + 1) }

    function handleBackBtn(cardNumber) {
        if (cardNumber === 1) {
            navigate(-1)
        }
        setCardNumber(cardNumber - 1)
    }

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
    const isEst = () => {
        console.log(selectedTime)
        // const selectedTime = "Eastern Time (EST)";
        return selectedTime === "Eastern Time (EST)";
    };

    const updateJobPost = async (e) => {
        console.log(jobId)
        const userId = sessionStorage.getItem("userId");
        console.log("userId", userId)


        const postingJobIdString = getCurrentDateTimeString() + '_' + userId;

        const person = collection(database, "person");
        const userRef = doc(person, userId);
        const subcollectionRef = collection(userRef, "postingJobs");
        const postRef = doc(subcollectionRef, jobId);

        try {
            await updateDoc(postRef, {
                isEST: isEst(),
                isFullTimeJob: selectedFullPart,
                jobDescription: description,
                jobLocation: location,
                startedTimeFrom: startTime,
                endedTimeIn: endTime,
                minPay: minPay,
                maxPay: maxPay,
                jobPaymentPer: selectedRatePer,
                jobTitle: jobTitle,
                updatedAt: serverTimestamp(),
                isJobActive: true,
            });
            console.log("Document added to subcollection successfully!");
        } catch (error) {
            console.log("Error adding document:", error);
        }
    }


    return (
        <Container className='job_apply_form'>
            {cardNumber === 1 &&
                <Card>
                    <Card.Body className='job_apply_form_body'>
                        <Form className='job_form_apply_fields' >
                            <Form.Group className='job_apply_field'>
                                <Form.Label className='job_form_field'>Job title *</Form.Label>
                                <Form.Control className='job_form_input' type='text' required onChange={(e) => setJobTitle(e.target.value)} value={jobTitle} />
                            </Form.Group>
                            <Form.Group className='job_apply_field'>
                                <Form.Label className='job_form_field'>Where is your company located *</Form.Label>
                                <Form.Control className='job_form_input' type='text' required onChange={(e) => setLocation(e.target.value)} value={location} />
                            </Form.Group>
                            <div className='job_apply_end_btns'>
                                {/* <button className='job_form_back_btn' onClick={() => handleBackBtn(1)}>
                                    <img src={leftArrow} alt="" />
                                    Back</button> */}
                                <button className='job_form_submit skill_btn' onClick={() => handleContinueBtn(1)}>
                                    continue  <img src={rightArrow} alt="" />
                                </button>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>
            }
            {cardNumber === 2 &&
                <Card>
                    <Card.Body className='job_apply_form_body'>
                        <Form className='job_form_apply_fields' >
                            <Form.Group className='job_apply_field'>
                                <Form.Label className='job_form_field'>Job type *</Form.Label>
                                <div className='job_apply_type_btns'>
                                    <button
                                        className={`job_post_time_btn ${selectedFullPart === 'full-time' ? 'job_active' : ''}`}
                                        type='button'
                                        onClick={() => setSelectedFullPart('full-time')} >
                                        <AddIcon color={selectedFullPart === 'full-time' && "white"} />
                                        Full-time
                                    </button>
                                    <button
                                        type='button'
                                        className={`job_post_time_btn    ${selectedFullPart === 'part-time' ? 'job_active' : ''}`}
                                        onClick={() => setSelectedFullPart('part-time')}
                                    >
                                        <AddIcon color={selectedFullPart !== 'full-time' && "white"} />
                                        Part-time
                                    </button>
                                </div>

                            </Form.Group>

                            <Form.Select
                                required
                                value={selectedTime}
                                className='job_apply_select'
                                // defaultValue={"Eastern Time (EST)"}
                                onChange={(e) => setSelectedTime(e.target.value)}
                            >
                                <option value={"Eastern Time (EST)"}>Eastern Time (EST)</option>
                                <option value={"Israel Time (IST)"}>Israel Time (IST)</option>
                            </Form.Select>
                            <Form.Group>
                                <p className='job_form_field'>Work hours</p>
                                <Form.Group className='job_edu_form_date'>
                                    <div className='job_date_from_to'>
                                        <Form.Label>From</Form.Label>
                                        <Form.Select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                                        {hoursList.map((hour, index) => (
                                                <option key={index} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}                                        </Form.Select>
                                        <Form.Label>Until</Form.Label>
                                        <Form.Select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                                             {hoursList.map((hour, index) => (
                                                <option key={index} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </Form.Group>
                            </Form.Group>

                            <div className='job_apply_end_btns'>
                                <button className='job_form_back_btn' onClick={() => handleBackBtn(2)}>
                                    <img src={leftArrow} alt="" />
                                    Back</button>
                                <button className='job_form_submit skill_btn' onClick={() => handleContinueBtn(2)}>
                                    continue  <img src={rightArrow} alt="" />
                                </button>
                            </div>

                        </Form>

                    </Card.Body>
                </Card>
            }
            {cardNumber === 3 &&
                <Card>
                    <Card.Body className='job_apply_form_body'>
                        <Form className='job_form_apply_fields'>
                            <Form.Group>
                                <Form.Label className='job_form_field'>Job description *</Form.Label>
                                <ReactQuill theme="snow"
                                    rows="5"
                                    value={description}
                                    onChange={(value) => handleSetDescription(value)}
                                    className="form-control" />
                            </Form.Group>
                            <div className='job_apply_end_btns'>
                                <button className='job_form_back_btn' onClick={() => handleBackBtn(3)}>
                                    <img src={leftArrow} alt="" />
                                    Back</button>
                                <button className='job_form_submit skill_btn' onClick={() => handleContinueBtn(3)}>
                                    continue  <img src={rightArrow} alt="" />
                                </button>
                            </div>

                        </Form>

                    </Card.Body>
                </Card>
            }
            {
                cardNumber === 4 &&

                <Card>
                    <Card.Body className='job_apply_form_body job_filter_body'>
                        <Form className='job_form_apply_fields'>
                            <div className='job_form_filter'>

                                <Form.Group>
                                    <Form.Label className='job_form_field'>Show pay by</Form.Label>
                                    <Form.Select
                                        required className='job_filter_select'
                                        value={selectedShowPay}
                                        // defaultValue={"Eastern Time (EST)"}
                                        onChange={(e) => setSelectedShowPay(e.target.value)}
                                    >
                                        <option value={"Range"}>Range</option>
                                        <option value={"Starting amount"}>Starting amount</option>
                                        <option value={"Starting amount"}>Starting amount</option>
                                        <option value={"Maximum amount"}>Maximum amount</option>
                                        <option value={"Exact amount"}>Exact amount</option>

                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className='job_form_filter'>
                                    <div>
                                        <Form.Label className='job_form_field'>Minimum</Form.Label>
                                        <Form.Control value={minPay} className='job_form_input' type='text' required onChange={(e) => setMinPay(e.target.value)} />
                                    </div>
                                    <div>
                                        <Form.Label className='job_form_field'>Maximum</Form.Label>
                                        <Form.Control value={maxPay} className='job_form_input' type='text' required onChange={(e) => setMaxPay(e.target.value)} />
                                    </div>

                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className='job_form_field'>Rate</Form.Label>
                                    <Form.Select
                                        required className='job_filter_select'
                                        value={selectedRatePer}
                                        // defaultValue={"per year"}
                                        onChange={(e) => setSelectedRatePer(e.target.value)}
                                    >
                                        <option value={"per year"}>per year</option>
                                        <option value={"per hour"}>per hour</option>
                                        <option value={"per day"}>per day</option>
                                        <option value={"per week"}>per week</option>
                                        <option value={"per year"}>per year</option>

                                    </Form.Select>
                                </Form.Group>

                            </div>

                                <div className='job_apply_end_btns'>
                                    <button className='job_form_back_btn' onClick={() => handleBackBtn(4)}>
                                        <img src={leftArrow} alt="" />
                                        Back</button>
                                    <button className='job_form_submit skill_btn' onClick={() => handleContinueBtn(4)}>
                                        continue  <img src={rightArrow} alt="" />
                                    </button>
                                </div>

                        </Form>

                    </Card.Body>
                </Card>
            }
            {
                cardNumber === 5 &&

                <Card>
                    <Card.Body className='job_apply_form_body'>
                        <Form>
                            <h4>{jobTitle}</h4>
                            <h5>{selectedShowPay}</h5>
                            <h5>{selectedFullPart}</h5>
                            <h5>{startTime}-{endTime}{() => { isEst() }}</h5>
                            <h5>{minPay}-{maxPay}</h5>
                            <h5>{selectedTime}</h5>
                            <h5>{selectedRatePer}</h5>
                            <p>{parse(description)}</p>
                            <div className='job_apply_end_btns'>
                                <button className='job_form_back_btn' onClick={() => handleBackBtn(5)}>
                                    <img src={leftArrow} alt="" />
                                    Back</button>
                                {/* <button className='job_form_submit skill_btn' onClick={() => addJobPost()}  >
                                    Submit  <img src={rightArrow} alt="" />
                                </button> */}
                                {/* <button className='job_form_submit skill_btn' onClick={() => addJobPost()}>Submit</button> */}
                                <Button className='job_form_submit skill_btn' onClick={() => updateJobPost()}>Submit</Button>

                            </div>

                        </Form>
                    </Card.Body>
                </Card>
            }
        </Container >
    )
}


