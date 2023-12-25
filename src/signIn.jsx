import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./styles/signin.css";
import { Form } from "react-bootstrap";
import React from "react";
import { faceBookIcon, facebookIcon, googleIcon } from "./assets";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { userAuth, userAuthWithGoogle, database } from "./firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, setDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import * as CryptoJS from 'crypto-js'
import "./styles/signin.css";

export const SignIn = () => {

    const navigate = useNavigate();

    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");

    const [errors, setErrors] = useState({}); // To store error input messages
    const errorValues = Object.values(errors);

    const validation = {

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
        },
    };
    const handleBlur = (field) => {

        const error = validation[field](field === 'userEmail' ? userEmail : field === 'userPassword' ? userPassword : field.trim()); // Trim the value for firstName and lastName
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error || 'Invalid input',
        }));
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
    const signIn = async () => {
        try {
            // Retrieve the user document from the database
            const userDoc = doc(database, "person", userEmail);
            const userSnap = await getDoc(userDoc);
            const userData = userSnap.data();

            if (userData) {
                const decryptedPassword = decrypt(userData.uPassword);
                console.log(decryptedPassword)

                if (userData.uPassword === '') {
                    if (userPassword.length < 6)

                        alert("Password needs to be al least 6 charachters long")
                    else {
                        updatePassword(userEmail, userPassword)
                        sessionStorage.setItem("userId", userEmail);
                        navigate(-1)
                    }
                }
                else if (userPassword === decryptedPassword) {
                    const userCredential = await signInWithEmailAndPassword(userAuth, userEmail, userPassword);
                    sessionStorage.setItem("userId", userEmail);
                    navigate(-1)
                } else {
                    alert("Invalid password");
                }
            }
        } catch (error) {
            console.error("Error signing in:", error.code, error.message);
        }
    };

    async function updatePassword(userId, pass) {
        const persons = collection(database, "person");
        const userRef = doc(persons, userId);

        try {
            await updateDoc(userRef, {
                uPassword: pass
            });
            console.log("update successful")

        } catch (error) {
            console.error("Error updating field:", error);
        }
    }

    const secretKey = process.env.REACT_APP_SECRET_KEY ? process.env.REACT_APP_SECRET_KEY : '12345'


    const decrypt = (cipherText) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
        const plainText = bytes.toString(CryptoJS.enc.Utf8)
        return plainText
    }


    return (
        <div>
            <NavBar />
            <div className='job_portal_signin'>
                <div className='signin_box'>
                    <div className='signin_box_head'>
                        <h2 className=''>Sign In as</h2>
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
                        <div className='signin' onClick={() => {
                            // Validate all fields before submission
                            for (const field in validation) {
                                handleBlur(field);
                            }
                            if (errorValues.every(value => value === true)) {
                                signIn();
                            }
                        }}>Sign In</div>
                        <div className='d-flex flex-column align-items-center gap-2'>
                            <h2 className='signin_desc'>OR</h2>
                            <h2 className='signin_desc'>Sign In with </h2>
                        </div>
                        <div className='signin_icons'>
                            <img src={googleIcon} alt="" onClick={signInGoogle} />
                            {/* <img src={faceBookIcon} alt=""/> */}
                        </div>
                        <div className='singup_link'>
                            Don’t have an account? <Link to='/signup'>Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}