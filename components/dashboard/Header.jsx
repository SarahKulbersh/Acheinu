import {backButtonIcon, notificationIcon, proflieIcon} from "../../assets";


export const Header = () => {
    return (
        <div className='job_header'>
            <img src={backButtonIcon} alt=""/>
            <div className='header_box'>
                <img src={notificationIcon} alt=""/>
                <div>
                    <img src={proflieIcon} alt=""/>
                    iliasmiah@example.com
                </div>
            </div>
        </div>
    )
}