import React, {useEffect} from 'react'
import "./styles/dashboard.css";
import {SideBar} from "./components/dashboard/SideBar";
import {useParams} from "react-router-dom";
import {Header} from "./components/dashboard/Header";
import {Applications} from "./components/dashboard/Applications";
import {Inbox} from "./components/dashboard/Inbox";
import {Jobs} from "./components/dashboard/Jobs";

export default function Dashboard() {

    const {tab = "jobs"} = useParams();

    useEffect(() => {

    }, [])

    return (<div className='dashboard'>
        <SideBar/>
        <Header/>
        <div className="dashboard_content">
            {(() => {
                switch (tab) {
                    case "jobs":
                        return <Jobs/>
                    case "applications":
                        return <Applications/>
                    case "inbox":
                        return <Inbox/>
                    default:
                        return <Jobs/>
                }
            })()}
        </div>
    </div>)
}
