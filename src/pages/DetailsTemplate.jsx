import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSite } from '../components/SiteContext';

const DetailsTemplate = () => {
    const { type } = useParams(); // Captures 'education', 'projects', etc. from the URL
    const { siteData } = useSite();

    useEffect(() => {
        // Re-initialize GLightbox and AOS for dynamic content
        if (window.GLightbox) {
            window.GLightbox({ selector: '.glightbox' });
        }
        if (window.AOS) {
            window.AOS.init({ duration: 600, once: true });
        }
    }, [type, siteData]);

    if (!siteData) return null;

    // Remove "-details" from the URL type to match JSON keys (e.g., 'education-details' -> 'education')
    const categoryKey = type.replace('-details', '');
    const pageData = siteData[categoryKey];

    if (!pageData) {
        return <div className="container py-5"><h3>Section Not Found</h3></div>;
    }

    // Identify the main array of items (e.g., 'degrees', 'experiences', 'projects')
    const items = Object.values(pageData).find(val => Array.isArray(val)) || [];

    return (
        <section className="section general-details">
            <div className="container" data-aos="fade-up">
                <div className="page-title mb-4">
                    <h1>
                        <i className={pageData.section_info?.icon_class || 'bi bi-info-circle'}></i> {pageData.section_info?.title || 'Details'}
                    </h1>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><Link to="/">Home</Link></li>
                            <li className="current">Details</li>
                        </ol>
                    </nav>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        {items.map((item, idx) => (
                            <div key={idx} className="general-info mb-5" id={item.id_ref || `item-${idx}`}>
                                <h3>{item.level || item.title || item.role}</h3>

                                <div className="row gy-4">
                                    {item.image_path && (
                                        <div className="col-lg-4">
                                            <a href={item.image_path} className="glightbox">
                                                <img
                                                    src={item.image_path}
                                                    className="img-fluid rounded shadow-sm"
                                                    alt="Detail"
                                                />
                                            </a>
                                        </div>
                                    )}

                                    <div className={item.image_path ? "col-lg-8" : "col-lg-12"}>
                                        <div className="description mt-2">
                                            {item.institution_name && <p><strong>Institution:</strong> {item.institution_name}</p>}
                                            {item.organization && <p><strong>Organization:</strong> {item.organization}</p>}
                                            {item.timeframe_details && <p><strong>Period:</strong> {item.timeframe_details}</p>}

                                            {/* Renders full description or list of responsibilities */}
                                            {item.description_full ? (
                                                <div dangerouslySetInnerHTML={{ __html: item.description_full }}></div>
                                            ) : (
                                                <p>{item.description_short}</p>
                                            )}

                                            {item.responsibilities_list && (
                                                <ul className="mt-3">
                                                    {item.responsibilities_list.map((res, i) => <li key={i}>{res}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailsTemplate;