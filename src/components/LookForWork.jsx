import React from 'react'
import { workIcon } from '../assets'
import "../styles/lookforwork.css"

export default function LookForWork() {

    

    return (
        <div className='look_work'>
            <div className='look_work_box'>
                <img src={workIcon} alt="" className='look_work_icon' />
                <div className='look_work_box_child'>
                    <h2 className='look_work_desc'>Looking for Work? Acheinu Bnei Yisrael in Chutz La’aretz are looking to hire.</h2>
                    <button className='look_work_btn'>View available oppurtunities</button>
                </div>
            </div>
            <div className='look_work_box_child'>
                <h2 className='look_work_desc'>Employer? How can we help with your hiring needs</h2>
                <button className='look_work_btn'>View available oppurtunities</button>
            </div>
        </div>
    )
}
