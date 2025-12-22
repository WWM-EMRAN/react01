import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import DetailsTemplate from './pages/DetailsTemplate';
// Note: You can create a specific PrintableCV page or use the Home logic
import PrintableCV from './pages/PrintableCV';

/**
 * ScrollToTop helper component
 * Ensures that whenever the route changes, the window scrolls back to the top.
 */
const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If there is no hash (anchor link), scroll to top
        if (!hash) {
            window.scrollTo(0, 0);
        }

        // Re-trigger AOS animations for the new page content
        if (window.AOS) {
            window.AOS.refresh();
        }
    }, [pathname, hash]);

    return null;
};

const App = () => {
    return (
        <Router>
            <ScrollToTop />
            <MainLayout>
                <Routes>
                    {/* Main Index Page */}
                    <Route path="/" element={<Home />} />
                    <Route path="/index.html" element={<Home />} />

                    {/* Printable CV Page */}
                    <Route path="/printable_cv.html" element={<PrintableCV />} />

                    {/* Dynamic Details Pages */}
                    {/* This handles education-details.html, projects-details.html, etc. */}
                    <Route path="/:type" element={<DetailsTemplate />} />

                    {/* Fallback for any other routes */}
                    <Route path="*" element={<Home />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;
