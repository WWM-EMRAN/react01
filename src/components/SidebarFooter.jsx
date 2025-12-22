import React from 'react';

const SidebarFooter = ({ footerMeta, logoPath }) => {
    const { menu_footer } = footerMeta;
    const currentYear = menu_footer.copyright_year === 'auto'
        ? new Date().getFullYear()
        : menu_footer.copyright_year;

    return (
        <div id="menu_footer" className="footer">
    <div className="container">
    <div className="copyright">
    <p style={{ textAlign: 'center' }}>
© Copyright · {currentYear} <strong><span>
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
};

export default SidebarFooter;