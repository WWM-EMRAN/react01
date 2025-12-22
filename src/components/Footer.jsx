import React from 'react';
import { useSite } from './SiteContext';

const Footer = ({ type }) => {
    const { siteData } = useSite();
    if (!siteData) return null;

    const { site } = siteData;
    const { footer_meta } = site;

    // Logic for dynamic year handling from your site-loader.js
    let copyrightYear = footer_meta.menu_footer.copyright_year || 'AUTO';
    if (copyrightYear.toString().toUpperCase() === 'AUTO') {
        copyrightYear = new Date().getFullYear();
    }

    if (type === 'menu') {
        const { menu_footer } = footer_meta;
        const logoPath = `assets/img/${site.assets.icons.logo_png}`;

        return (
            <div id="menu_footer" className="footer">
                <div className="container">
                    <div className="copyright">
                        <p style={{ textAlign: 'center' }}>
                            © Copyright · {copyrightYear} <strong><span>
                                <a href={menu_footer.copyright_logo_link}>
                                    <img style={{ height: '20px' }} src={logoPath} alt="Logo" className="img-fluid rounded-circle" />
                                </a>
                                <a href={menu_footer.copyright_text_link}> {menu_footer.copyright_owner} </a>
                            </span></strong>
                        </p>
                    </div>
                    <div className="credits">
                        {menu_footer.links.map((link, idx) => (
                            <React.Fragment key={idx}>
                                <a href={link.url}> {link.label} </a>
                                {idx < menu_footer.links.length - 1 && ' | '}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'page') {
        const { main_page_footer } = footer_meta;
        return (
            <footer id="footer" className="footer position-relative dark-background">
                <div className="container">
                    <div className="copyright text-center">
                        <p>© <span>Copyright</span> <strong className="px-1 sitename">{main_page_footer.sitename}</strong><span>All Rights Reserved</span></p>
                    </div>
                    <div className="credits">
                        Designed by <a target="_blank" rel="noreferrer" href={main_page_footer.design_link}>{main_page_footer.design_credit}</a>
                    </div>
                </div>
            </footer>
        );
    }

    return null;
};

export default Footer;
