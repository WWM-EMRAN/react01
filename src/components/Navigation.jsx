import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Navigation = ({ menuArray }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Function to handle smooth scrolling when a hash link is clicked
    const handleLinkClick = (e, url) => {
        if (url.startsWith('#')) {
            const targetId = url.replace('#', '');
            const element = document.getElementById(targetId);

            if (location.pathname === '/' && element) {
                e.preventDefault(); // Stop the instant jump

                // Get the target's position relative to the page
                const offset = 0; // Adjust this if you have a top sticky header
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                // Trigger the smooth scroll
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update the URL without jumping the page
                navigate(`/${url}`, { replace: true });
            }
        }
    };

    const handleToggle = (e, label) => {
        e.preventDefault();
        setActiveDropdown(activeDropdown === label ? null : label);
    };

    // Helper to determine if a specific link or hash is truly active
    const isLinkActive = (itemUrl) => {
        if (itemUrl.startsWith('#')) {
            return location.hash === itemUrl;
        }
        return location.pathname === itemUrl;
    };

    return (
        <nav id="navmenu" className="navmenu">
            <ul>
                {menuArray.map((item, idx) => {
                    const isDropdown = item.is_dropdown && item.submenu && item.submenu.length > 0;
                    const isOpen = activeDropdown === item.label;
                    const isActive = isLinkActive(item.url);

                    return (
                        <li key={idx} className={`${isDropdown ? 'dropdown' : ''}`}>
                            {isDropdown ? (
                                <a
                                    href="#"
                                    onClick={(e) => handleToggle(e, item.label)}
                                    className={isOpen || isActive ? 'active' : ''}
                                >
                                    <i className={`${item.icon_class} navicon`}></i>
                                    <span>{item.label}</span>
                                    <i className={`bi bi-chevron-down toggle-dropdown ${isOpen ? 'dropdown-active' : ''}`}></i>
                                </a>
                            ) : (
                                <NavLink
                                    to={item.url.startsWith('#') ? `/${item.url}` : item.url}
                                    onClick={(e) => handleLinkClick(e, item.url)}
                                    className={() => (isActive ? 'active' : '')}
                                >
                                    <i className={`${item.icon_class} navicon`}></i>
                                    <span>{item.label}</span>
                                </NavLink>
                            )}

                            {isDropdown && (
                                <ul className={isOpen ? 'dropdown-active' : ''} style={{ display: isOpen ? 'block' : 'none' }}>
                                    {item.submenu.map((sub, sIdx) => (
                                        <li key={sIdx}>
                                            <NavLink
                                                to={sub.url.startsWith('#') ? `/${sub.url}` : sub.url}
                                                onClick={(e) => handleLinkClick(e, sub.url)}
                                                className={() => isLinkActive(sub.url) ? 'active' : ''}
                                            >
                                                {sub.icon_class && <i className={`${sub.icon_class} navicon`}></i>}
                                                <span>{sub.label}</span>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navigation;