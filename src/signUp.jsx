import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./styles/signin.css";
import React from "react";
import { faceBookIcon, facebookIcon, googleIcon } from "./assets";
import { Link } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, setDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { userAuth, userAuthWithGoogle, database } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import './styles/inputError.css'
import * as CryptoJS from 'crypto-js'

export const SignUp = () => {
    const navigate = useNavigate();

    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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

        userEmail: () => {
            if (userEmail === '') {
                return "Email is required."
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(userEmail);
        },

        userPassword: () => {
            if (userPassword === '') {
                return "Password is required";
            } else if (userPassword.length < 6) {
                return "Password must be at least 6 characters long.";
            }
            return true

            // You can add more password strength checks here
        },
    };
    const handleBlur = (field) => {

        const error = validation[field](field === 'userEmail' ? userEmail : field === 'userPassword' ? userPassword : field.trim()); // Trim the value for firstName and lastName
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error || 'Invalid input',
        }));
    };
    const secretKey = process.env.REACT_APP_SECRET_KEY ? process.env.REACT_APP_SECRET_KEY : '12345'

    const encrypt = (plainText) => {
        const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString()
        return cipherText
    }


    const submitUserDetails = async (userEmail, userPassword) => {
        try {
            await setDoc(doc(database, "person", userEmail), {
                createdAt: serverTimestamp(),
                email: userEmail,
                isActive: true,
                signInAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uid: userEmail,
                uPassword: encrypt(userPassword),
                firstName: firstName,
                lastName: lastName
            });
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }

    const signUp = async () => {
        if (firstName === '' || lastName === '' || userEmail === '' || userPassword === '') {
            return; // Do not proceed with signUp function if any required field is empty
        }

        console.log("signUp")
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
            await setDoc(doc(database, "person", userEmail), {
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
            <NavBar />
            <div className='job_portal_signin signup'>
                <div className='signin_box'>
                    <div className='signin_box_head'>
                        <h2 className=''>Sign Up as</h2>
                        <div className='signin_method'>
                            <div className='employee_radiio'>
                                <input type="radio" id='employee' defaultChecked={true} name='employ' />
                                <label htmlFor="employee">Employee</label>
                            </div>
                            <div className='employee_radiio'>
                                <input type="radio" id='employer' name='employ' />
                                <label htmlFor="employer">Employer</label>
                            </div>
                        </div>
                    </div>
                    <div className='sinin_form_field'>
                        <div className='d-flex justify-content-lg-between gap-3'>
                            <div className='job_apply_field'>
                                <label className='job_form_field'>First name</label>
                                <input type='text' placeholder='First name' className='job_form_input' value={firstName} onChange={(e) => setFirstName(e.target.value)} onBlur={() => handleBlur('firstName')} required />
                                {errors.firstName && <p className="error-message">{errors.firstName}</p>}

                            </div>
                            <div className='job_apply_field'>
                                <label className='job_form_field'>Last name</label>
                                <input type='text' className='job_form_input' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} onBlur={() => handleBlur('lastName')} required />
                                {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className='job_apply_field'>
                            <label htmlFor='email' className='job_form_field'>Email</label>
                            <input type='text' className='job_form_input' placeholder='Email'
                                value={userEmail} onChange={(e) => setEmail(e.target.value)} onBlur={() => handleBlur('userEmail')} required />
                            {errors.userEmail && <p className="error-message">{errors.userEmail}</p>}
                        </div>
                        <div className='job_apply_field'>
                            <label htmlFor='email' className='job_form_field'>Password</label>
                            <input type='password' placeholder='Password' className='job_form_input' value={userPassword} onChange={(e) => setPassword(e.target.value)} onBlur={() => handleBlur('userPassword')} required />
                            {errors.userPassword && <p className="error-message">{errors.userPassword}</p>}
                        </div>
                        <Link to='/signup' className='forgot_password'>Forget Password?</Link>
                        <div className='signin'
                            onClick={() => {
                                // Validate all fields before submission
                                for (const field in validation) {
                                    handleBlur(field);
                                }
                                if (errorValues.every(value => value === true)) {
                                    signUp();
                                }
                            }}>Sign Up</div>
                        <div className='d-flex flex-column align-items-center gap-2'>
                            <h2 className='signin_desc'>OR</h2>
                            <h2 className='signin_desc'>Sign Up with </h2>
                        </div>
                        <div className='signin_icons'>
                            <img src={googleIcon} alt="" onClick={signInGoogle} />
                            {/* <img src={faceBookIcon} alt=""/> */}
                        </div>
                        <div className='singup_link'>
                            Don’t have an account? <Link to='/signin'>Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}