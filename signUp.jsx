import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./styles/signin.css";
import React from "react";
import {faceBookIcon, facebookIcon, googleIcon} from "./assets";
import {Link} from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, setDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { userAuth, userAuthWithGoogle, database } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const navigate = useNavigate();

    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const submitUserDetails = async (userEmail, firstName, lastName) => {
        console.log("firstName", firstName)
        try {
            await setDoc(doc(database, "persons", userEmail), {
                createdAt: serverTimestamp(),
                email: userEmail,
                isActive: true,
                signInAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uid: userEmail,
                uPassword: '',
                firstName: firstName,
                lastName: lastName
            });
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(userAuth, userEmail, userPassword).then((userCredential) => {
                submitUserDetails(userEmail, userPassword)
                sessionStorage.setItem("userId", userEmail);
                navigate(-1)
            });
        }
        catch (err) {
            alert(err)

        }

    };
    // sign in with google
    const signInGoogle = async () => {

        await signInWithPopup(userAuth, userAuthWithGoogle).then((userCredential) => {

            sessionStorage.setItem("userId", userCredential.user.email);
            const firstName = userCredential.user.displayName.split(" ")[0];
            const lastName = userCredential.user.displayName.split(" ")[1];
            submitUserDetailsGoogleSignIn(userCredential.user.email, firstName, lastName)
            navigate(-1)

        }).catch((err) => {

            console.log(err.code);
            console.log(err.message);
        });
    };
    const submitUserDetailsGoogleSignIn = async (userEmail, firstName, lastName) => {
        console.log("firstName", firstName)
        try {
            await setDoc(doc(database, "persons", userEmail), {
                createdAt: serverTimestamp(),
                email: userEmail,
                isActive: true,
                signInAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uid: userEmail,
                uPassword: '',
                firstName: firstName,
                lastName: lastName
            });
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }


    return (
        <div>
            <NavBar/>
            <div className='job_portal_signin signup'>
                <div className='signin_box'>
                    <div className='signin_box_head'>
                        <h2 className=''>Sign Up as</h2>
                        <div className='signin_method'>
                            <div className='employee_radiio'>
                                <input type="radio" id='employee' defaultChecked={true} name='employ'/>
                                <label htmlFor="employee">Employee</label>
                            </div>
                            <div className='employee_radiio'>
                                <input type="radio" id='employer' name='employ'/>
                                <label htmlFor="employer">Employer</label>
                            </div>
                        </div>
                    </div>
                    <div className='sinin_form_field'>
                        <div className='d-flex justify-content-lg-between gap-3'>
                            <div className='job_apply_field'>
                                <label className='job_form_field'>First name</label>
                                <input type='text' placeholder='First name' className='job_form_input'value={firstName} placeholder="Password" onChange={(e) => setFirstName(e.target.value)}  required/>
                            </div>
                            <div className='job_apply_field'>
                                <label className='job_form_field'>Last name</label>
                                <input type='text' className='job_form_input' placeholder='Last Name' value={lastName}  onChange={(e) => setLastName(e.target.value)}  required/>
                            </div>
                        </div>
                        <div className='job_apply_field'>
                            <label htmlFor='email' className='job_form_field'>Email or phone number</label>
                            <input type='text' className='job_form_input' placeholder='Email or phone number'
                                  value={userEmail} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className='job_apply_field'>
                            <label htmlFor='email' className='job_form_field'>Password</label>
                            <input type='text' placeholder='Password' className='job_form_input'value={userPassword} onChange={(e) => setPassword(e.target.value)}  required/>
                        </div>
                        <Link to='/signup' className='forgot_password'>Forget Password?</Link>
                        <div className='signin' onClick={signUp}>Sign Up</div>
                        <div className='d-flex flex-column align-items-center gap-2'>
                            <h2 className='signin_desc'>OR</h2>
                            <h2 className='signin_desc'>Sign Up with </h2>
                        </div>
                        <div className='signin_icons'>
                            <img src={googleIcon} alt="" onClick={signInGoogle}/>
                            {/* <img src={faceBookIcon} alt=""/> */}
                        </div>
                        <div className='singup_link'>
                            Don’t have an account? <Link to='/signin'>Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}