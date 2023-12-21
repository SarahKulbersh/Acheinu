import React from 'react'
import { facebookIcon, footerLogo, instagramIcon, linkedInIcon, youtubeIcon } from "../assets/index";
import { Link } from 'react-router-dom';
import "../styles/footer.css"

const links = [
    { text: "About us", link: "" },
    { text: "Blog", link: "" },
    { text: "(303) 555-0105", link: "" },
    { text: "Contact us", link: "" },
    { text: "Privacy policy", link: "" },
    { text: "ilias@example.com", link: "" },
    { text: "Career Opportunities", link: "" },
    { text: "Terms of Condition", link: "" },
]

export default function Footer() {

    return (
        <div className='footer'>
            <div className='footer_content'>
                <Link to="/">
                    <img src={footerLogo} alt="" />
                </Link>
                <div className='footer_links'>
                    {links.map((link, i) => (<Link key={i} className='footer_link'>
                        {link.text}</Link>))}
                    <div className='footer_link_icons'>
                        <img src={linkedInIcon} alt="" className='footer_media_icon' />
                        <img src={instagramIcon} alt="" className='footer_media_icon' />
                        <img src={facebookIcon} alt="" className='footer_media_icon' />
                        <img src={youtubeIcon} alt="" className='footer_media_icon' />
                    </div>
                </div>
            </div>
            <div className='footer_terms'>© 2023 Logoipsim, All rights reserved</div>
        </div>
    )
}
