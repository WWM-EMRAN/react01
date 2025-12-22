import React from 'react';

const PageFooter = ({ mainPageFooter }) => {
    return (
        <footer id="footer" className="footer position-relative dark-background">
    <div className="container">
    <div className="copyright text-center">
    <p>© <span>Copyright</span> <strong className="px-1 sitename">{mainPageFooter.sitename}</strong><span>All Rights Reserved</span></p>
    </div>
    <div className="credits">
    Designed by <a target="_blank" rel="noreferrer" href={mainPageFooter.design_link}>{mainPageFooter.design_credit}</a>
    </div>
</div>
</footer>
);
};

export default PageFooter;