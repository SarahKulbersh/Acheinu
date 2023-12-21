import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { userAuth, userAuthWithGoogle, database } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, setDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import * as CryptoJS from 'crypto-js'
import './styles/jobApplyForm.css'

export const UserLogin = () => {

    const navigate = useNavigate();

    const secretKey = process.env.REACT_APP_SECRET_KEY ? process.env.REACT_APP_SECRET_KEY : '12345'

    const encrypt = (plainText) => {
        const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString()
        return cipherText
    }
    const decrypt = (cipherText) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
        const plainText = bytes.toString(CryptoJS.enc.Utf8)
        return plainText
    }
    const submitUserDetails = async (userEmail, userPassword) => {
        try {
            await setDoc(doc(database, "persons", userEmail), {
                createdAt: serverTimestamp(),
                email: userEmail,
                isActive: true,
                signInAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uid: userEmail,
                uPassword: encrypt(userPassword),

            });
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }
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
    async function updatePassword(userId, pass) {
        const persons = collection(database, "persons");
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


    // holds email + pass
    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");

    // sign up
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
    const signIn = async () => {
        try {
            // Retrieve the user document from the database
            const userDoc = doc(database, "persons", userEmail);
            const userSnap = await getDoc(userDoc);
            const userData = userSnap.data();

            if (userData) {
                const decryptedPassword = decrypt(userData.uPassword);
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

    // sign in with google
    const signInGoogle = async () => {

        await signInWithPopup(userAuth, userAuthWithGoogle).then((userCredential) => {

            sessionStorage.setItem("userId", userCredential.user.email);
            const firstName = userCredential.user.displayName.split(" ")[0];
            const lastName = userCredential.user.displayName.split(" ")[1];
            submitUserDetailsGoogleSignIn(userCredential.user.email, firstName, lastName)
            navigate(-1)

        }).catch((err) => {

            alert(err.code);
            alert(err.message);
        });
    };

    return (
        <div className='job_apply_form'>
            <div className='job_apply_form_body'>
                <div className='job_form_apply_fields'>

                    <input className='job_form_input' placeholder="Email" required value={userEmail} onChange={(e) => setEmail(e.target.value)} />
                    <input className='job_form_input' type="password" required value={userPassword} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button className='job_form_submit' onClick={signUp}>Sign up</button>
                </div></div>

            <hr />
            <div className='job_apply_form_body'>
                <div className='job_form_apply_fields'>

                    <input className='job_form_input' placeholder="Email" required value={userEmail} onChange={(e) => setEmail(e.target.value)} />
                    <input className='job_form_input' type="password" required value={userPassword} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button className='job_form_submit' onClick={signIn}>Sign In</button>
                </div></div>
            <hr />

            <button className='job_form_submit' onClick={signInGoogle}>Sign In With google</button>
        </div>
    );
};