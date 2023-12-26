import React, {useEffect, useState} from 'react'
import "./styles/dashboard.css";
import {SideBar} from "./components/dashboard/SideBar";
import {useParams} from "react-router-dom";
import {Header} from "./components/dashboard/Header";
import {Applications} from "./components/dashboard/Applications";
import {Inbox} from "./components/dashboard/Inbox";
import {Jobs} from "./components/dashboard/Jobs";
import { collection } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { database } from './firebaseConfig';
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { UserSideBar } from './components/dashboard/UserSidebar';
import { MyResume } from './components/dashboard/MyResume';
import { Application } from './components/dashboard/Application';

export default function Dashboard() {

    const {tab = "jobs"} = useParams();
    const [isEmploye,setEmploye] = useState(true);
    useEffect(() => {
        const getDetails =async () =>{
            try {
                 const userId = sessionStorage.getItem("userId")
                 const personDocRef = doc(database, 'person', userId);
                 const docsSnap = await getDoc(personDocRef);
                 const userData = docsSnap._document.data.value.mapValue.fields;
                 setEmploye(userData.employe.booleanValue)
            } catch (error) {
                console.log(error)
            }

        }
        getDetails()
       
    }, [])
    return (<div className='dashboard'>
        {isEmploye?<UserSideBar/>:<SideBar/>}
        <Header/>
        <div className="dashboard_content">
            {(() => {
                switch (tab) {
                    case "jobs":
                        return isEmploye?<MyResume/>:<Jobs/>
                    case "applications":
                        return isEmploye?<Application/>:<Applications/>
                    case "inbox":
                        return isEmploye?<Inbox/>:<Inbox/>
                    default:
                        return <Jobs/>
                }
            })()}
        </div>
    </div>)
}
