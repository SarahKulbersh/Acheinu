import { button, Card, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { addMore, backArrowIcon } from "../assets";
import { doc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { database } from "../firebaseConfig";

let profileDetailsBackup = {};

export const JobApplyFormEdit = ({ page = 1, setPage, setProfileDetails, profileDetails }) => {

    const [skills, setSkills] = useState([])
    const [jobTitle, setJobTitle] = useState()
    const [company, setCompany] = useState()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [phone, setPhone] = useState('')
    const [educationLevel, setEducationLevel] = useState('')
    const [studyField, setStudyField] = useState('')
    const [schoolName, setSchoolName] = useState('')
    const [skill, setSkill] = useState('')
    const [jobDescription, setJobDescription] = useState();

    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];


    const handleChange = ({ name, value }) => {
        setProfileDetails(prev => ({
            ...prev,
            work: {
                ...prev.work,
                [name]: value,
            },
        }))
    }

    useEffect(() => {
        profileDetailsBackup = profileDetails;
    }, [])

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const userId = sessionStorage.getItem("userId");
            const personDocRef = doc(database, 'person', userId);
            await updateDoc(personDocRef, profileDetails);
            console.log("User details updated successfully!");
        } catch (error) {
            console.error("Error updating user details:", error);
        }
        setPage(-1)
    }

    return (
        <div className="my_resume_edit">
            <img src={backArrowIcon} alt="" width="30px" className="" onClick={() => { setProfileDetails(profileDetailsBackup); setPage(-1) }} />
            <div className='job_apply_form_body_edit'>
                {page === 1 && (<Card>
                    <Card.Body className='job_apply_form_body'>
                        <Form className='job_form_apply_fields' onSubmit={onSubmit}>
                            <div className='job_apply_field'>
                                <Form.Label className='job_form_field'>First name</Form.Label>
                                <Form.Control value={profileDetails.firstName} type='text' className='job_form_input'
                                    onChange={(e) => handleChange(e.target)} name="firstName" required />
                            </div>
                            <div className='job_apply_field'>
                                <Form.Label className='job_form_field'>Last name</Form.Label>
                                <Form.Control className='job_form_input' type='text' name="lastName"
                                    value={profileDetails.lastName} onChange={(e) => handleChange(e.target)} required />
                            </div>
                            <div className='job_apply_field'>
                                <Form.Label htmlFor="email" className='job_form_field'>Email</Form.Label>
                                <Form.Control type="email" className='job_form_input' id="email" name="email"
                                    value={profileDetails.email} onChange={(e) => handleChange(e.target)} />
                            </div>
                            <div className='job_apply_field'>
                                <Form.Label className='job_form_field'>City (optional)</Form.Label>
                                <Form.Control className='job_form_input' type='text' name="cityName"
                                    value={profileDetails.cityName} onChange={(e) => handleChange(e.target)} />
                            </div>
                            <div className='job_apply_field'>
                                <Form.Label htmlFor="phone" className='job_form_field'>Phone number</Form.Label>
                                <div className='job_form_phone_input'>
                                    <Form.Select size="lg" className='job_form_phone_code'>
                                        <option>+1</option>
                                    </Form.Select>
                                    <Form.Control className='job_form_input' type="text" id="phone" name="phone"
                                        value={profileDetails.phone} onChange={(e) => handleChange(e.target)} />
                                </div>
                            </div>
                            <button className='job_form_submit' type='submit'>Save Changes</button>
                        </Form>
                    </Card.Body>
                </Card>)}
                {page === 2 && (<Card>
                    <Card.Body className='job_apply_form_body'>
                        <Form className='job_form_apply_fields' onSubmit={onSubmit}>
                            <Form.Text>Do you want to Edit work history?</Form.Text>
                            <Form.Group>
                                <Form.Label className='job_form_field'>Job title *</Form.Label>
                                <Form.Control name="jobTitle" value={profileDetails.work.jobTitle} className='job_form_input' type='text' required onChange={(e) => handleChange(e.target)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className='job_form_field'>Company</Form.Label>
                                <Form.Control name="company" value={profileDetails.work.company} className='job_form_input' type='text' required onChange={(e) => handleChange(e.target)} />
                            </Form.Group>
                            <Form.Text className='job_form_field'>Time period</Form.Text>
                            <Form.Group className='job_edu_form_date'>
                                <Form.Label>To</Form.Label>
                                <div>
                                    <Form.Select name="JobPeriodFromMonth" value={profileDetails.work.JobPeriodFromMonth} onChange={(e) => handleChange(e.target)}>
                                        {months.map((e, i) => (
                                            <option value={e} key={i}>{e}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Select name="JobPeriodFromYear" value={profileDetails.work.JobPeriodFromYear} onChange={(e) => handleChange(e.target)}>
                                        {new Array(25).fill(1).map((e, i) => (
                                            <option value={2000 + i} key={i}>{2000 + i}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Form.Group>
                            <Form.Group className='job_edu_form_date'>
                                <Form.Label>To</Form.Label>
                                <div>
                                    <Form.Select name="JobPeriodToMonth" onChange={(e) => handleChange(e.target)} value={profileDetails.work.JobPeriodToMonth}>
                                        {months.map((e, i) => (
                                            <option value={e} key={i}>{e}</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Select name="JobPeriodToYear" onChange={(e) => handleChange(e.target)} value={profileDetails.work.JobPeriodToYear}>
                                        {new Array(25).fill(1).map((e, i) => (
                                            <option value={2000 + i} key={i}>{2000 + i}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Form.Group>
                            <div className='job_form_desc_box'>
                                <Form.Label>Description</Form.Label>
                                <Form.Text>Describe your position and any significant accomplishments</Form.Text>
                            </div>
                            <textarea value={profileDetails.description}
                                id="exampleFormControlTextarea1"
                                rows="5" name="description" onChange={(e) => handleChange(e.target)}
                            />
                            <div className='job_form_desc_btn_box'>
                                <button className='job_form_submit' >Save Changes</button>
                                <span>skip</span>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>)}

                {page == 3 && (<Card>
                    <Card.Body className='job_apply_form_body'>
                        <Form className='job_form_apply_fields' onSubmit={onSubmit}>
                            <div>
                                <p className='job_form_upload_desc'>Build your resume (1 of 4)</p>
                                <p className='job_form_field'>Do you want to add any education details?</p>
                            </div>
                            <div>
                                <Form.Label className='job_form_field'>Level of education *</Form.Label>
                                <Form.Control className='job_form_input' type='text' required onChange={(e) => setEducationLevel(e.target.value)} />
                            </div>
                            <div>
                                <Form.Label className='job_form_field'>Field of study</Form.Label>
                                <Form.Control className='job_form_input' type='text' required onChange={(e) => setStudyField(e.target.value)} />
                            </div>
                            <div>
                                <Form.Label className='job_form_field'>Name of school</Form.Label>
                                <Form.Control className='job_form_input' type='text' required onChange={(e) => setSchoolName(e.target.value)} />
                            </div>

                            <Form.Text>Time period</Form.Text>
                            <Form.Group className='job_edu_form_date'>
                                <Form.Label>From</Form.Label>
                                <div>
                                    <Form.Select>
                                        <option value="" key="">Month</option>
                                    </Form.Select>
                                    <Form.Select>
                                        <option value="" key="">Year</option>
                                    </Form.Select>
                                </div>
                            </Form.Group>
                            <Form.Group className='job_edu_form_date'>
                                <Form.Label>To</Form.Label>
                                <div>
                                    <Form.Select>
                                        <option value="" key="">Month</option>
                                    </Form.Select>
                                    <Form.Select>
                                        <option value="" key="">Year</option>
                                    </Form.Select>
                                </div>
                            </Form.Group>
                            <button className='job_form_submit skill_btn'>Save changes</button>

                        </Form>
                    </Card.Body>
                </Card>)}
                {page === 4 && (<Card>
                    <Card.Body className='job_apply_form_body'>
                        <Form className='job_form_apply_fields' onSubmit={(e) => { e.preventDefault(); setPage(-1) }}>
                            <div>
                                <p className='job_form_upload_desc'>Build your resume (3 of 4)</p>
                                <label htmlFor="phone">Do you want to share some of your skills?</label>
                            </div>
                            <div className='job_form_field_box'>
                                <input className='job_form_input' type="text" placeholder='Add a skill' onChange={(e) => setSkill(e.target.value)} />
                                <img src={addMore} alt="" className='add_skill_img' />
                            </div>
                            {skills?.map(skill => (
                                <h4 key={skill}>{skill}</h4>
                            ))}

                            <button className='job_form_submit skill_btn'>Submit</button>
                        </Form>
                    </Card.Body>
                </Card>)}
            </div>
        </div>
    )
}