import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSite } from './SiteContext';
import Navigation from './Navigation';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    const { siteData, loading } = useSite();
    const location = useLocation();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    // Manage Mobile Nav Classes
    useEffect(() => {
        const body = document.body;
        const header = document.querySelector('#header');

        if (isMobileNavOpen) {
            body.classList.add('mobile-nav-active');
            if (header) header.classList.add('header-show');
        } else {
            body.classList.remove('mobile-nav-active');
            if (header) header.classList.remove('header-show');
        }
    }, [isMobileNavOpen]);

    // Manage Scroll Top Visibility (Replaces legacy main.js logic)
    useEffect(() => {
        const handleScroll = () => {
            const scrollTopButton = document.querySelector('.scroll-top');
            if (scrollTopButton) { // Safety check to prevent "reading property of null"
                if (window.scrollY > 100) {
                    scrollTopButton.classList.add('active');
                } else {
                    scrollTopButton.classList.remove('active');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile nav on route change
    useEffect(() => {
        setIsMobileNavOpen(false);
    }, [location.pathname]);

    if (loading) return null;

    const { personal_info, site } = siteData;
    const isDetailsPage = location.pathname.includes('-details');
    const menuArray = isDetailsPage ? site.navigation.details_menu : site.navigation.main_menu;

    return (
        <>
            {/* FLOATING TOGGLE BUTTON */}
            <i
                className={`header-toggle d-xl-none bi ${isMobileNavOpen ? 'bi-x' : 'bi-list'}`}
                onClick={toggleMobileNav}
                style={{
                    position: 'fixed',
                    right: '15px',
                    top: '15px',
                    zIndex: 9999,
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#fff',
                    backgroundColor: '#0563af',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                }}
            ></i>

            {/* SIDEBAR HEADER */}
            <header id="header" className={`header dark-background d-flex flex-column ${isMobileNavOpen ? 'header-show' : ''}`}>
                <div className="profile-img">
                    <img
                        src={`assets/img/${site.assets.images.profile_image_pp}`}
                        alt="Profile"
                        className="img-fluid rounded-circle"
                    />
                </div>

                <Link to="/" className="logo d-flex align-items-center justify-content-center">
                    <h1 className="sitename">{personal_info.name}</h1>
                </Link>

                <div className="social-links text-center">
                    {site.social_links.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noreferrer">
                            <i className={link.icon_class}></i>
                        </a>
                    ))}
                </div>

                <Navigation menuArray={menuArray} />
                <Footer type="menu" />
            </header>

            <main className="main">
                {children}
            </main>

            <Footer type="page" />

            {/* SCROLL TOP BUTTON */}
            <a
                href="#"
                className="scroll-top d-flex align-items-center justify-content-center"
                onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                <i className="bi bi-arrow-up-short"></i>
            </a>
        </>
    );
};

export default MainLayout;