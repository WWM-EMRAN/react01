import React, { useEffect } from 'react';
import { useSite } from '../components/SiteContext';

const PrintableCV = () => {
    const { siteData } = useSite();

    useEffect(() => {
        // Refresh animations if any
        if (window.AOS) window.AOS.refresh();
    }, [siteData]);

    if (!siteData) return null;

    const { personal_info, education, professional_experience, skills, languages } = siteData;

    return (
        <div className="container mt-5 mb-5 p-5 bg-white shadow-lg" id="printable-cv-content">
            {/* Header Section */}
            <div className="row border-bottom pb-4 mb-4">
                <div className="col-md-3 text-center">
                    <img
                        src={`assets/img/${siteData.site.assets.images.profile_image_formal}`}
                        alt="Profile"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxWidth: '180px' }}
                    />
                </div>
                <div className="col-md-9">
                    <h1 className="display-4 fw-bold text-primary">{personal_info.name}</h1>
                    <h4 className="text-muted mb-3">{personal_info.hero.title_researcher}</h4>
                    <div className="row">
                        <div className="col-sm-6">
                            <p className="mb-1"><i className="bi bi-envelope-fill me-2"></i> {siteData.contacts.email_primary}</p>
                            <p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i> {personal_info.location || "Available on Request"}</p>
                        </div>
                        <div className="col-sm-6 text-md-end">
                            <button
                                className="btn btn-outline-primary d-print-none"
                                onClick={() => window.print()}
                            >
                                <i className="bi bi-printer-fill me-2"></i> Print CV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <section className="mb-5">
                <h3 className="border-bottom pb-2 text-uppercase fw-bold text-secondary">Professional Summary</h3>
                <p className="lead" dangerouslySetInnerHTML={{ __html: personal_info.profile_summary.intro_paragraph_html }}></p>
            </section>

            {/* Experience */}
            <section className="mb-5">
                <h3 className="border-bottom pb-2 text-uppercase fw-bold text-secondary">Work Experience</h3>
                {professional_experience.experiences.map((exp, idx) => (
                    <div key={idx} className="mb-4">
                        <div className="d-flex justify-content-between align-items-baseline">
                            <h5 className="fw-bold mb-0">{exp.roles[0].title}</h5>
                            <span className="text-muted fw-italic">{exp.roles[0].timeframe_details}</span>
                        </div>
                        <h6 className="text-primary">{exp.organization}</h6>
                        <ul className="mt-2">
                            {exp.roles[0].responsibilities_list.map((task, i) => (
                                <li key={i}>{task}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="mb-5">
                <h3 className="border-bottom pb-2 text-uppercase fw-bold text-secondary">Education</h3>
                <div className="row">
                    {education.degrees.map((degree, idx) => (
                        <div key={idx} className="col-md-6 mb-3">
                            <h6 className="fw-bold mb-1">{degree.level}</h6>
                            <p className="mb-0 text-primary">{degree.institution_name}</p>
                            <small className="text-muted">{degree.timeframe_details}</small>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills & Languages */}
            <div className="row">
                <div className="col-md-8">
                    <h3 className="border-bottom pb-2 text-uppercase fw-bold text-secondary">Technical Skills</h3>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {skills.skills_list.map((skill, idx) => (
                            <span key={idx} className="badge bg-light text-dark border p-2">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="col-md-4">
                    <h3 className="border-bottom pb-2 text-uppercase fw-bold text-secondary">Languages</h3>
                    <ul className="list-unstyled mt-2">
                        {languages.languages_list.map((lang, idx) => (
                            <li key={idx}><strong>{lang.language}:</strong> {lang.proficiency}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PrintableCV;