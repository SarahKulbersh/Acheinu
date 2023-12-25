import {applicationIcon, inboxIcon, logo2, logoutIcon, myjobsIcon} from "../../assets";
import {Link, NavLink} from "react-router-dom";


export const SideBar = ({selectedIndex = 0}) => {
    const tabs = [
        {name: "My Jobs", image: myjobsIcon, link: "/dashboard/jobs"},
        {name: "Applications", image: applicationIcon, link: "/dashboard/applications"},
        {name: "Inbox", image: inboxIcon, link: "/dashboard/inbox"}
    ];
    return (
        <div className='dashboard_side_bar'>
            <div className="dashboard_side_bar_up">
                <img src={logo2} alt=''/>
                <div className='dashboard_side_tabs'>
                    {tabs.map(({image, name, link}, i) => (
                        <NavLink
                            to={link}
                            className={ ({isActive}) => isActive ? "dashboard_side_link dashboard_side_link_active " : "dashboard_side_link"}
                            key={i}>
                        <img src={image} alt="" className=''/>
                        <span>{name}</span>
                        </NavLink>
                        ))}
                </div>
            </div>
            <div className="dashboard_side_link dashboard_side_logout">
                <img src={logoutIcon} alt=""/>
                <span>Logout</span>
            </div>
        </div>
    )
}