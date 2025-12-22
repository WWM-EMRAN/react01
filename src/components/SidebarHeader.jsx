import React from 'react';
import { Link } from 'react-router-dom';

const SidebarHeader = ({ personalInfo, siteAssets, socialLinks }) => {
    // console.log(personalInfo, siteAssets, socialLinks );

    return (
        <div className="sidebar-header-wrapper">
            <div className="profile-img">
                {/* Image wrapped in glightbox anchor for preview */}
                <a
                    href={`assets/img/${siteAssets.images.profile_image_pp}`}
                    className="glightbox"
                    data-gallery="sidebar-gallery"
                >
                    <img
                        src={`assets/img/${siteAssets.images.profile_image_pp}`}
                        alt="Profile"
                        className="img-fluid rounded-circle"
                        style={{ cursor: 'zoom-in' }}
                    />
                </a>
            </div>

            <Link to="/" className="logo d-flex align-items-center justify-content-center">
                <h1 className="sitename"><img src={`assets/img/${siteAssets.icons.logo_png}`} alt="Logo" className="img-fluid rounded-circle" /> {personalInfo.name}</h1>
            </Link>

            <div className="social-links text-center">
                {socialLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noreferrer"> <i className={link.icon_class}></i> </a>
                ))}
            </div>

            {/*<p>${siteAssets}</p>*/}
            {/*console.log($siteAssets)*/}
        </div>
    );
};

export default SidebarHeader;