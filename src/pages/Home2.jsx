import React, { useEffect } from 'react';
import { useSite } from '../components/SiteContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { siteData } = useSite();

    useEffect(() => {
        let typedInstance;

        if (siteData) {
            // 1. Typed.js Initialization
            const selectTyped = document.querySelector('.typed');
            if (selectTyped && window.Typed) {
                const typed_strings = selectTyped.getAttribute('data-typed-items').split(',');
                typedInstance = new window.Typed('.typed', {
                    strings: typed_strings,
                    loop: true,
                    typeSpeed: 100,
                    backSpeed: 50,
                    backDelay: 2000
                });
            }

            // 2. Global Library Refreshes
            if (window.AOS) window.AOS.refresh();
            if (window.PureCounter) new window.PureCounter();

            // 3. Skills Progress Bar Animation
            const progressBars = document.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                const val = bar.getAttribute('aria-valuenow');
                bar.style.width = val + '%';
            });

            // 4. GLightbox initialization (Fixed Issue #2)
            if (window.GLightbox) {
                window.GLightbox({ selector: '.glightbox' });
            }

            // 5. Robust Fix for Issue #1 (Filtering & Tag Selection)
            const timer = setTimeout(() => {
                const isotopeLayout = document.querySelectorAll('.isotope-layout');
                isotopeLayout.forEach(layoutItem => {
                    const container = layoutItem.querySelector('.isotope-container');
                    const filtersList = layoutItem.querySelector('.portfolio-filters');

                    if (container && window.Isotope && window.imagesLoaded) {
                        window.imagesLoaded(container, () => {
                            const iso = new window.Isotope(container, {
                                itemSelector: '.isotope-item',
                                layoutMode: 'masonry',
                                filter: '*'
                            });

                            // We use a direct event listener on each LI to ensure click capture
                            const filterButtons = layoutItem.querySelectorAll('.portfolio-filters li');
                            filterButtons.forEach(btn => {
                                btn.onclick = function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    // Remove active class from all and add to clicked
                                    filterButtons.forEach(el => el.classList.remove('filter-active'));
                                    this.classList.add('filter-active');

                                    // Apply the filter
                                    const filterValue = this.getAttribute('data-filter');
                                    iso.arrange({ filter: filterValue });

                                    // Trigger AOS refresh to ensure items appear correctly
                                    if (window.AOS) window.AOS.refresh();
                                };
                            });
                        });
                    }
                });
            }, 600); // Slightly longer delay to ensure full DOM paint

            return () => {
                clearTimeout(timer);
                if (typedInstance) typedInstance.destroy();
            };
        }
    }, [siteData]);

    if (!siteData) return null;

    // Destructure siteData
    const {
        personal_info,
        site,
        key_metrics,
        education,
        professional_experience,
        expertise_achievements,
        skills,
        honors_awards,
        courses_trainings_certificates,
        projects,
        memberships,
        sessions_events,
        languages,
        portfolios,
        volunteerings,
        publications,
        contacts
    } = siteData;

    // --- REUSABLE RENDER HELPERS ---
    const renderDegreeItem = (degree) => {
        let levelIcon = "bi bi-mortarboard-fill";
        const timeframe = degree.timeframe_details || {};

        return (
            <div className="resume-item pb-0" key={degree.degree_id} id={degree.degree_id} style={{ marginLeft: '15px' }}>
                {/* Degree Major */}
                <h4><i className={`${levelIcon} me-2`}></i>{degree.degree_major}</h4>

                {degree.department_name && (
                    <p className="mb-0 ms-2" style={{ fontWeight: '600', color: 'var(--heading-color)' }}>
                        {degree.department_name}
                    </p>
                )}

                {/* Institution Name & Location */}
                <div className="ms-2 mb-2 mt-2">
                    <h2 className="resume-title" style={{
                        fontSize: '1.1rem',
                        marginTop: '0',
                        marginBottom: '5px',
                        color: 'rgba(var(--accent-color-rgb), 0.75)',
                        borderLeft: '3px solid rgba(var(--accent-color-rgb), 0.3)',
                        paddingLeft: '10px'
                    }}>
                        <i className="bi bi-building me-1"></i>
                        <a href={degree.institution_link} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                            {degree.institution_name}
                            <i className="bx bx-link-external ms-1 small"></i>
                        </a>
                        <span className="ms-2 small text-muted fw-normal" style={{ fontSize: '0.85rem' }}>
                            <i className="bi bi-geo-alt me-1"></i>{degree.institution_location}
                        </span>
                    </h2>
                </div>

                {/* Timeframe Badges */}
                <div className="mb-3 d-flex flex-wrap gap-2">
                    <span className="badge" style={{ backgroundColor: 'var(--accent-color)', color: '#fff' }}>
                        <i className="bi bi-calendar3 me-1"></i> {timeframe.start_date} – {timeframe.end_date}
                    </span>
                    {timeframe.max_duration && (
                        <span className="badge border" style={{ color: 'var(--accent-color)', backgroundColor: 'transparent', border: '1px solid var(--accent-color)' }}>
                            <i className="bi bi-hourglass-split me-1"></i> {timeframe.max_duration}
                        </span>
                    )}
                    <span className="badge bg-secondary">
                        <i className="bi bi-person-workspace me-1"></i> {degree.degree_type}
                    </span>
                    <span className="badge border" style={{ color: '#6c757d', backgroundColor: 'transparent', border: '1px solid #6c757d' }}>
                        <i className="bx bx-medal me-1"></i> {timeframe.award_date}
                    </span>
                </div>

                <div className="ms-2">
                    {/* Specialisation (Always Visible) */}
                    <p className="mb-2">
                        {degree.specialisation && (
                            <>
                                <strong>Specialisation:</strong> {degree.specialisation}<br />
                            </>
                        )}
                    </p>

                    <details style={{ cursor: 'pointer', fontSize: '0.95rem' }}>
                        <summary className="text-primary fw-bold mb-2">
                            More Details
                        </summary>

                        <div className="ps-2 border-start">
                            {/* Collaboration Details */}
                            {degree.collaboration && degree.collaboration.length > 0 && (
                                <div className="mt-1 mb-2 p-2 rounded" style={{ backgroundColor: 'rgba(var(--accent-color-rgb), 0.05)', borderLeft: '2px solid var(--accent-color)' }}>
                                    <strong>Collaboration:</strong>
                                    <ul className="mb-0 list-unstyled ms-2">
                                        {degree.collaboration.map((collab, cIdx) => (
                                            <li key={cIdx} style={{ fontSize: '0.9rem' }}>
                                                <i className="bi bi-arrow-right-short me-1"></i>
                                                {collab.collaboration_type}: {collab.institution_name} ({collab.degree_major})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <p className="mb-2">
                                {degree.scholarship && (
                                    <>
                                        <strong>Scholarship:</strong> {degree.scholarship.scholarship_name}<br />
                                    </>
                                )}
                                {degree.research_topic && (
                                    <>
                                        <strong>Research Focus:</strong> {degree.research_topic}<br />
                                    </>
                                )}
                                {degree.thesis_details?.thesis_title && (
                                    <span className="d-block mt-2 mb-2 p-2 border-start border-3" style={{ fontStyle: 'italic', backgroundColor: '#f8f9fa' }}>
                                        <strong>Thesis:</strong> "{degree.thesis_details.thesis_title}"
                                        {degree.thesis_details.thesis_length && <span className="text-muted"> — {degree.thesis_details.thesis_length}</span>}
                                    </span>
                                )}
                                {degree.activities_involvement && (
                                    <>
                                        <strong>Activities:</strong> {degree.activities_involvement}<br />
                                    </>
                                )}
                                {degree.description_full && (
                                    <>
                                        <strong>Description:</strong> {degree.description_full}<br />
                                    </>
                                )}
                            </p>

                            {/* Research Projects */}
                            {degree.research_projects && degree.research_projects.length > 0 && (
                                <div className="mt-3">
                                    <strong className="d-block mb-1">Key Research Projects:</strong>
                                    <ul className="list-unstyled ms-3">
                                        {degree.research_projects.map((proj, pIdx) => (
                                            <li key={pIdx} className="mb-1">
                                                <i className="bi bi-check2-circle me-2 text-primary"></i>
                                                <strong>{proj.type}:</strong> {proj.title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Related Skills */}
                            {degree.related_skills && (
                                <p className="mt-2 mb-3">
                                    <small className="text-muted">
                                        <i className="bi bi-tags me-1"></i>
                                        <strong>Skills:</strong> {degree.related_skills}
                                    </small>
                                </p>
                            )}
                        </div>
                    </details>
                </div>
            </div>
        );
    };

    const renderRoleItem = (role) => {
        const timeframe = role.timeframe_details || {};

        // Helper to calculate duration from start_date to today for ongoing roles
        const getDynamicDuration = (startStr, endStr, existingDuration) => {
            const activeKeywords = ["present", "ongoing", "current", ""];
            const normalizedEnd = (endStr || "").toLowerCase().trim();
            const isOngoing = activeKeywords.includes(normalizedEnd);

            if (existingDuration && !isOngoing) return existingDuration;

            try {
                const cleanStart = (startStr || "").replace(/_XX/g, '').replace(/\./g, '');
                const startDate = new Date(cleanStart);
                const endDate = isOngoing ? new Date() : new Date((endStr || "").replace(/_XX/g, '').replace(/\./g, ''));

                if (isNaN(startDate.getTime())) return existingDuration || "";

                const diffTime = Math.abs(endDate - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                const years = Math.floor(diffDays / 365);
                const months = Math.floor((diffDays % 365) / 30);

                let result = "";
                if (years > 0) result += `${years} yr${years > 1 ? 's' : ''} `;
                if (months > 0) result += `${months} mo${months > 1 ? 's' : ''}`;

                return result.trim() || "Less than a month";
            } catch (e) {
                return existingDuration || "";
            }
        };

        const displayDuration = getDynamicDuration(timeframe.start_date, timeframe.end_date, timeframe.duration);

        return (
            <div className="resume-item pb-0" key={role.role_id} id={role.role_id}>
                <h4>{role.title}</h4>

                {/* Timeline Badges */}
                <div className="mb-3 d-flex flex-wrap gap-2">
                    <span className="badge" style={{ backgroundColor: 'var(--accent-color)', color: '#fff' }}>
                        <i className="bi bi-calendar3 me-1"></i> {timeframe.start_date} – {timeframe.end_date}
                    </span>

                    {displayDuration && (
                        <span className="badge border border-accent" style={{ color: 'var(--accent-color)', backgroundColor: 'transparent', border: '1px solid var(--accent-color)' }}>
                            <i className="bi bi-hourglass-split me-1"></i> {displayDuration}
                        </span>
                    )}

                    <span className="badge bg-secondary">
                        <i className="bi bi-person-workspace me-1"></i> {role.role_type}
                    </span>
                </div>

                {/* COLLAPSIBLE SECTION: More Details */}
                <details style={{ cursor: 'pointer', fontSize: '0.95rem' }}>
                    <summary className="text-primary fw-bold mb-2">
                        More Details
                    </summary>

                    <div className="ps-2 border-start">
                        {/* Focus/Description List */}
                        {role.description_list && role.description_list.length > 0 && (
                            <div className="mb-2">
                                <p className="mb-1"><strong>Description:</strong></p>
                                <ul className="ms-2">
                                    {role.description_list.map((desc, i) => <li key={i}>{desc}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Responsibilities List */}
                        {role.responsibilities_list && role.responsibilities_list.length > 0 && (
                            <div className="mb-2">
                                <p className="mb-1"><strong>Responsibilities:</strong></p>
                                <ul className="ms-2">
                                    {role.responsibilities_list.map((res, i) => <li key={i}>{res}</li>)}
                                </ul>
                            </div>
                        )}

                        {/* Course Involvement (Teaching/Training) */}
                        {role.course_involvement && role.course_involvement.length > 0 && (
                            <div className="mb-2">
                                <p className="mb-1"><strong>Course Involvement:</strong></p>
                                <ul className="ms-2">
                                    {role.course_involvement.map((course, i) => (
                                        <li key={i}><small>{course}</small></li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Related Skills */}
                        {role.related_skills && (
                            <p className="mt-2 mb-3">
                                <small className="text-muted">
                                    <i className="bi bi-tags me-1"></i>
                                    <strong>Skills:</strong> {role.related_skills}
                                </small>
                            </p>
                        )}
                    </div>
                </details>
            </div>
        );
    };



    return (
        <>
            {/* 1. Hero Section (Home2.jsx exact code) */}
            <section id="hero" className="hero section dark-background">
                <img src={`assets/img/${site.assets.images.site_background}`} alt="Background" data-aos="fade-in" />
                <div className="container d-flex flex-column align-items-center justify-content-center text-center" data-aos="fade-up" data-aos-delay="100">
                    <h2>{personal_info.hero.title_main}</h2>
                    <p><span className="typed" data-typed-items={personal_info.hero.typed_items}></span></p>
                    <p className="text-center">
                        {personal_info.hero.title_researcher}<br/>
                        {personal_info.hero.title_institute_primary}<br/>
                        {personal_info.hero.title_institute_secondary}<br/>
                        {personal_info.hero.tagline}
                    </p>
                </div>
            </section>

            {/* 2. About Section (Home2.jsx exact code) */}
            <section id="about" className="about section">
                <div className="container" data-aos="fade-up" data-aos-delay="100">
                    <div className="section-title">
                        <h2>
                            {personal_info.profile_summary.title}
                            <a href={personal_info.profile_summary.link_printable_cv}>
                                <i className="bx bx-printer ms-2"></i>
                            </a>
                        </h2>
                        <p dangerouslySetInnerHTML={{ __html: personal_info.profile_summary.intro_paragraph_html }}></p>
                    </div>

                    <div className="row gy-4 justify-content-center">
                        {/* Image wrapped in glightbox anchor for preview */}
                        <div className="col-lg-4">
                            <a
                                href={`assets/img/${site.assets.images.profile_image_formal}`}
                                className="glightbox"
                                data-gallery="profile-gallery"
                            >
                                <img
                                    src={`assets/img/${site.assets.images.profile_image_formal}`}
                                    className="img-fluid rounded-4 shadow"
                                    alt="Formal Profile"
                                    style={{ cursor: 'zoom-in' }}
                                />
                            </a>
                        </div>

                        <div className="col-lg-8 content">
                            <h3>{personal_info.profile_summary.subtitle}</h3>
                            <br/>
                            <div className="row">
                                <div className="col-lg-6">
                                    <ul>
                                        {personal_info.profile_summary.key_points_left.map((point, idx) => (
                                            <li key={idx}>
                                                <i className={point.icon_class}></i>
                                                <strong>{point.strong}:</strong>
                                                <span>{point.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-lg-6">
                                    <ul>
                                        {personal_info.profile_summary.key_points_right.map((point, idx) => (
                                            <li key={idx}>
                                                <i className={point.icon_class}></i>
                                                <strong>{point.strong}:</strong>
                                                {point.link ? (
                                                    <a href={point.link} target="_blank" rel="noreferrer"> {point.text}</a>
                                                ) : (
                                                    <span> {point.text}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="content">
                            <div className="row">
                                <div className="col-lg-12">
                                    <ul>
                                        <li>
                                            <i className={`${personal_info.profile_summary.research_area.icon_class} me-2 accent-color`}></i>
                                            <strong>{personal_info.profile_summary.research_area.title}:</strong> {personal_info.profile_summary.research_area.text}
                                        </li>
                                        <li>
                                            <i className={`${personal_info.profile_summary.recent_works.icon_class} me-2 accent-color`}></i>
                                            <strong>{personal_info.profile_summary.recent_works.title}:</strong> {personal_info.profile_summary.recent_works.text}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. Key Metrics (Home2.jsx exact code) */}
            <section id="keyInfo" className="stats section light-background">
                <div className="container" data-aos="fade-up">
                    <div className="section-title">
                        <h2><i className={key_metrics.section_info.icon_class}></i> {key_metrics.section_info.title}</h2>
                        <h6>{key_metrics.section_info.details}</h6>
                    </div>
                    <div className="row gy-4">
                        {key_metrics.metrics.map((metric, idx) => (
                            <div className="col-lg-3 col-md-6" key={idx}>
                                <div className="stats-item">
                                    <i className={metric.icon_class}></i>
                                    <span data-purecounter-start="0" data-purecounter-end={metric.value} data-purecounter-duration="0.75" className="purecounter"></span>
                                    <p><strong>{metric.strong_text}</strong> {metric.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Education (Home2.jsx exact code) */}
            <section id="educations" className="resume section">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={education.section_info.icon_class}></i> {education.section_info.title}
                        <Link to="/education-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{education.section_info.details}</h6>
                </div>

                <div className="container" data-aos="fade-up" data-aos-delay="100">

                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <h3 className="resume-title">{education.summary.title}</h3>
                            <div className="row mt-3">
                                <div className="col-lg-12 mb-3">
                                    <ul className="ms-3">
                                        {education.summary.status_list.map((status, lIdx) => (
                                            <li key={lIdx}>{status}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Map through 'left' and 'right' columns based on JSON data */}
                        {['left', 'right'].map((colSide) => (
                            <div className="col-lg-6" key={colSide}>
                                {Object.entries(
                                    education.degrees
                                        .filter(d => d.column === colSide)
                                        .reduce((acc, d) => {
                                            // Use degree_level as the Level 1 header
                                            if (!acc[d.degree_level]) acc[d.degree_level] = [];
                                            acc[d.degree_level].push(d);
                                            return acc;
                                        }, {})
                                ).map(([levelTitle, degreeGroup], gIdx) => (
                                    <div key={gIdx} className="mb-4">
                                        {/* LEVEL 1 Hierarchy Header */}
                                        <h2 className="resume-title" style={{
                                            color: 'var(--accent-color)',
                                            borderBottom: '2px solid var(--accent-color)',
                                            paddingBottom: '5px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            marginTop: gIdx > 0 ? '30px' : '0px'
                                        }}>
                                            <i className="bi bi-mortarboard me-1"></i> {levelTitle}
                                        </h2>
                                        {degreeGroup.map(degree => renderDegreeItem(degree))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Professional Experiences */}
            <section id="professionalExperiences" className="resume section light-background">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={professional_experience.section_info.icon_class}></i> {professional_experience.section_info.title}
                        <Link to="/professional-experience-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{professional_experience.section_info.details}</h6>
                </div>

                <div className="container" data-aos="fade-up" data-aos-delay="100">

                    {/* Expertise/Summary Block */}
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <h3 className="resume-title">{professional_experience.summary.title}</h3>
                            <div className="row mt-3">
                                {professional_experience.summary.expertise_list.map((list, lIdx) => (
                                    <div key={lIdx} className="col-lg-12 mb-3">
                                        <h6>{list.title}</h6>
                                        {list.areas_of_expertise && (
                                            <ul className="ms-3">
                                                {list.areas_of_expertise.map((area, aIdx) => <li key={aIdx}>{area}</li>)}
                                            </ul>
                                        )}
                                        {list.research_interests_columns && (
                                            <div className="row">
                                                {list.research_interests_columns.map((col, cIdx) => (
                                                    <div key={cIdx} className="col-md-4">
                                                        <ul className="ms-3">
                                                            {col.map((item, iIdx) => <li key={iIdx}><small>{item}</small></li>)}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Experience Columns */}
                    <div className="row">
                        {[
                            professional_experience.experiences.filter(exp => exp.column === "left"),
                            professional_experience.experiences.filter(exp => exp.column === "right")
                        ].map((columnGroups, colIdx) => (
                            <div className="col-lg-6" key={colIdx}>
                                {columnGroups.map((group, gIdx) => (
                                    <div key={gIdx} className="resume-category-group mb-5">
                                        <h2 className="resume-title" style={{
                                            color: 'var(--accent-color)',
                                            borderBottom: '2px solid var(--accent-color)',
                                            paddingBottom: '5px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            <i className={group.organisation[0]?.icon_class || 'bx bx-briefcase'}></i> {group.category}
                                        </h2>

                                        {group.organisation.map((org, orgIdx) => (
                                            <div key={orgIdx} className="ms-3 mb-4 mt-3">
                                                <h2 className="resume-title" style={{
                                                    fontSize: '1.2rem',
                                                    marginTop: '0',
                                                    color: 'rgba(var(--accent-color-rgb), 0.75)',
                                                    borderLeft: '3px solid rgba(var(--accent-color-rgb), 0.3)',
                                                    paddingLeft: '10px'
                                                }}>
                                                    <i className="bi bi-building me-1"></i>
                                                    {/* Organisation External Link */}
                                                    <a href={org.link} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                        {org.organization}
                                                        <i className="bx bx-link-external ms-1 small"></i>
                                                    </a>
                                                    <span className="ms-2 small text-muted fw-normal" style={{ fontSize: '0.85rem' }}>
                                            <i className="bi bi-geo-alt me-1"></i>{org.location}
                                        </span>
                                                </h2>

                                                <div className="ms-2">
                                                    {org.roles.map(role => renderRoleItem(role))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Skills (Home2.jsx exact code) */}
            <section id="skillsTools" className="skills section light-background">
                <div className="container" data-aos="fade-up">
                    <div className="section-title">
                        <h2>
                            <i className={skills.section_info.icon_class}></i> {skills.section_info.title}
                            <Link to="/skillsAndTools-details"><i className="bx bx-link ms-2"></i></Link>
                        </h2>
                        <h6>{skills.section_info.details}</h6>
                    </div>
                    <div className="row skills-content skills-animation">
                        <div className="col-lg-6">
                            {skills.skills.filter((_, i) => i % 2 === 0).map((skill, idx) => (
                                <div className="progress" key={idx}>
                                    <span className="skill">{skill.category}: {skill.short_description} <i className="val">{skill.level}%</i></span>
                                    <div className="progress-bar-wrap"><div className="progress-bar" role="progressbar" aria-valuenow={skill.level} aria-valuemin="0" aria-valuemax="100"></div></div>
                                </div>
                            ))}
                        </div>
                        <div className="col-lg-6">
                            {skills.skills.filter((_, i) => i % 2 !== 0).map((skill, idx) => (
                                <div className="progress" key={idx}>
                                    <span className="skill">{skill.category}: {skill.short_description} <i className="val">{skill.level}%</i></span>
                                    <div className="progress-bar-wrap"><div className="progress-bar" role="progressbar" aria-valuenow={skill.level} aria-valuemin="0" aria-valuemax="100"></div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Honors and Awards (Home2.jsx exact code) */}
            <section id="honorsAwards" className="services section">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={honors_awards.section_info.icon_class}></i> {honors_awards.section_info.title}
                        <Link to="/honorsAndAwards-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{honors_awards.section_info.details}</h6>
                </div>
                <div className="container">
                    <div className="row gy-4">
                        {honors_awards.honorsawards.map((award, idx) => (
                            <div className="col-lg-4 col-md-6 service-item d-flex" key={idx} data-aos="fade-up">
                                <div className="icon flex-shrink-0">
                                    {/* Uses the specific icon_class from the JSON for each award */}
                                    <i className={award.icon_class || 'bx bx-award'}></i>
                                </div>
                                <div>
                                    <h4 className="title">
                                        <Link to={`/honorsAndAwards-details#${award.id_ref}`} className="stretched-link">
                                            {award.title}
                                        </Link>
                                    </h4>

                                    {/* Updated to display Date and Issuer Organization name */}
                                    <p className="mb-1">
                                        <small className="text-muted fw-bold">
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {award.date}
                                        </small>
                                        {award.issuer_organization?.name && (
                                            <small className="text-muted fw-bold ms-2">
                                                <i className="bi bi-building me-1"></i>
                                                {award.issuer_organization.name}
                                            </small>
                                        )}
                                    </p>

                                    <p className="description">{award.short_description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. DYNAMIC COURSES & CERTIFICATES (Filtered and Serial No checked) */}
            <section id="coursesTrainingsCertificates" className="portfolio section light-background">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={courses_trainings_certificates.section_info.icon_class}></i> {courses_trainings_certificates.section_info.title}
                        <Link to="/coursesTrainingsAndCertificates-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{courses_trainings_certificates.section_info.details}</h6>
                </div>

                <div className="container">
                    {(() => {
                        // Filter by serial_no as requested
                        const filteredData = courses_trainings_certificates.coursestrainingscertificates.filter(
                            item => item.serial_no && item.serial_no.trim() !== ""
                        );
                        // Generate unique tags from the filtered items
                        const dynamicTags = [...new Set(filteredData.flatMap(item => item.filter_tags || []))];

                        return (
                            <div className="isotope-layout">
                                <ul className="portfolio-filters isotope-filters" data-aos="fade-up" data-aos-delay="100">
                                    <li data-filter="*" className="filter-active">All</li>
                                    {dynamicTags.map((tag, i) => {
                                        const label = tag.split('-')[1];
                                        const capitalizedLabel = label ? label.charAt(0).toUpperCase() + label.slice(1) : tag;
                                        return <li key={i} data-filter={`.${tag}`}>{capitalizedLabel}</li>;
                                    })}
                                </ul>

                                <div className="row gy-4 isotope-container" data-aos="fade-up" data-aos-delay="200">
                                    {filteredData.map((item, idx) => (
                                        <div key={idx} className={`col-lg-4 col-md-6 portfolio-item isotope-item ${item.filter_tags.join(' ')}`}>
                                            <div className="portfolio-content h-100">
                                                <img src={item.image_path} className="img-fluid" alt={item.title} />
                                                <div className="portfolio-info">
                                                    <h4>{item.title}</h4>
                                                    <p>{item.source.split(' - ').shift()}</p>

                                                    {/* Preview Link using glightbox class */}
                                                    <a href={item.image_path} title={item.title} data-gallery="portfolio-gallery-cert" className="glightbox preview-link">
                                                        <i className="bi bi-zoom-in"></i>
                                                    </a>

                                                    <Link to={`/coursesTrainingsAndCertificates-details#${item.id_ref}`} title="More Details" className="details-link">
                                                        <i className="bi bi-link-45deg"></i>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* 9. Projects Section */}
            <section id="projects" className="services section">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={projects.section_info.icon_class}></i> {projects.section_info.title}
                        <Link to="/projects-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{projects.section_info.details}</h6>
                </div>

                <div className="container">
                    <div className="row gy-4">
                        {(projects.projects || []).map((project, idx) => (
                            <div
                                className="col-lg-4 col-md-6 service-item d-flex"
                                key={idx}
                                data-aos="fade-up"
                                data-aos-delay={100 * idx}
                            >
                                <div className="icon flex-shrink-0">
                                    {/* Dynamic Icon from JSON with fallback to lightbulb */}
                                    <i className={project.icon_class || 'bi bi-lightbulb'}></i>
                                </div>
                                <div>
                                    <h4 className="title">
                                        <Link to={`/projects-details#${project.id_ref}`} className="stretched-link">
                                            {project.role}
                                        </Link>
                                    </h4>

                                    <p className="mb-1">
                                        <small className="text-muted fw-bold">
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {/* Handles the timeframe_details object: Start Date - End Date */}
                                            {project.timeframe_details
                                                ? `${project.timeframe_details.start_date} – ${project.timeframe_details.end_date}`
                                                : (project.date || "Ongoing")
                                            }
                                        </small>
                                        {/* Added Project Status Badge for better visibility */}
                                        {project.status && (
                                            <span className="badge bg-secondary ms-2" style={{ fontSize: '0.7rem' }}>
                                    {project.status}
                                </span>
                                        )}
                                    </p>

                                    {/*/!* Basic Details (Role/Type) *!/*/}
                                    {/*{project.basic_details && (*/}
                                    {/*    <p className="mb-1">*/}
                                    {/*        <small className="text-primary fw-bold">*/}
                                    {/*            <i className="bi bi-info-circle me-1"></i>*/}
                                    {/*            {project.basic_details}*/}
                                    {/*        </small>*/}
                                    {/*    </p>*/}
                                    {/*)}*/}

                                    <p className="description" style={{ textAlign: 'justify' }}>
                                        {project.short_description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. Memberships Section */}
            <section id="memberships" className="services section light-background">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={memberships.section_info.icon_class}></i> {memberships.section_info.title}
                        <Link to="/memberships-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{memberships.section_info.details}</h6>
                </div>

                <div className="container">
                    <div className="row gy-4">
                        {(memberships.memberships || []).map((membership, idx) => (
                            <div
                                className="col-lg-4 col-md-6 service-item d-flex"
                                key={idx}
                                data-aos="fade-up"
                                data-aos-delay={100 * idx}
                            >
                                <div className="icon flex-shrink-0">
                                    {/* Dynamic Icon from JSON with fallback to group icon */}
                                    <i className={membership.icon_class || 'bx bx-group'}></i>
                                </div>
                                <div>
                                    <h4 className="title">
                                        <Link to={`/memberships-details#${membership.id_ref}`} className="stretched-link">
                                            {membership.title}
                                        </Link>
                                    </h4>

                                    <p className="mb-1">
                                        <small className="text-muted fw-bold">
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {/* Displays start and end date from timeframe_details */}
                                            {membership.timeframe_details.start_date} – {membership.timeframe_details.end_date}
                                        </small>
                                    </p>

                                    {/* Membership Organization Details */}
                                    {membership.membership_organization && membership.membership_organization.map((org, oIdx) => (
                                        <p className="mb-1" key={oIdx}>
                                            <small className="text-primary fw-bold">
                                                <i className="bi bi-building me-1"></i>
                                                {org.name}
                                            </small>
                                        </p>
                                    ))}

                                    <p className="description" style={{ textAlign: 'justify' }}>
                                        {membership.description_full}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 11. Sessions and Events Section */}
            <section id="sessionsEvents" className="services section">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={sessions_events.section_info.icon_class}></i> {sessions_events.section_info.title}
                        <Link to="/sessions-events-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{sessions_events.section_info.details}</h6>
                </div>

                <div className="container">
                    <div className="row gy-4">
                        {(sessions_events.sessionsevents || []).map((event, idx) => (
                            <div
                                className="col-lg-6 col-md-6 service-item d-flex"
                                key={idx}
                                data-aos="fade-up"
                                data-aos-delay={100 * idx}
                            >
                                <div className="icon flex-shrink-0">
                                    {/* Dynamic Icon from JSON (e.g., bi-mic) */}
                                    <i className={event.icon_class || 'bi bi-calendar-event'}></i>
                                </div>
                                <div>
                                    <h4 className="title">
                                        <Link to={`/sessions-events-details#${event.id_ref}`} className="stretched-link">
                                            {event.title}
                                        </Link>
                                    </h4>

                                    <p className="mb-1">
                                        <small className="text-muted fw-bold">
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {event.date}
                                        </small>
                                        <span className="badge bg-secondary ms-2" style={{ fontSize: '0.7rem' }}>
                                {event.type}
                            </span>
                                    </p>

                                    {/* Organization Detail */}
                                    {event.organization && (
                                        <p className="mb-1">
                                            <small className="text-primary fw-bold">
                                                <i className="bi bi-building me-1"></i>
                                                {event.organization}
                                            </small>
                                        </p>
                                    )}

                                    <p className="description" style={{ textAlign: 'justify' }}>
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 12. Languages Section */}
            <section id="languages" className="services section light-background">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={languages.section_info.icon_class}></i> {languages.section_info.title}
                        <Link to="/languages-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{languages.section_info.details}</h6>
                </div>

                <div className="container">
                    <div className="row gy-4">
                        {(languages.languages || []).map((lang, idx) => {
                            const primaryTest = lang.test_scores && lang.test_scores.length > 0
                                ? lang.test_scores[0]
                                : null;

                            return (
                                <div
                                    className="col-lg-4 col-md-6 service-item d-flex"
                                    key={idx}
                                    data-aos="fade-up"
                                    data-aos-delay={100 * idx}
                                >
                                    {/* FIX: Using span with explicit width/height to force flag visibility */}
                                    <div className="icon flex-shrink-0 d-flex align-items-center justify-content-center">
                            <span
                                className={`${lang.icon_class}`}
                                style={{
                                    width: '40px',
                                    height: '30px',
                                    display: 'inline-block',
                                    lineHeight: 'normal'
                                }}
                            ></span>
                                    </div>
                                    <div>
                                        <h4 className="title">
                                            <Link to={`/languages-details#${lang.id_ref}`} className="stretched-link">
                                                {lang.language}
                                            </Link>
                                        </h4>

                                        <p className="mb-1">
                                <span className="badge bg-primary me-2" style={{ fontSize: '0.75rem' }}>
                                    {lang.status}
                                </span>
                                            <small className="text-muted fw-bold">
                                                {lang.proficiency_level}
                                            </small>
                                        </p>

                                        <p className="description mb-2">
                                            {lang.details}
                                        </p>

                                        {primaryTest && (
                                            <div className="mt-2">
                                                {primaryTest.test_name && (
                                                    <div className="mb-1">
                                                        <small className="fw-bold text-dark">
                                                            {primaryTest.test_name} ({primaryTest.test_year}): {primaryTest.test_score}
                                                        </small>
                                                    </div>
                                                )}
                                                <div className="d-flex flex-wrap gap-1">
                                                    {Object.entries(primaryTest.proficiency_breakdown).map(([skill, val]) => (
                                                        val && (
                                                            <span key={skill} className="badge border text-dark" style={{ fontSize: '0.65rem', backgroundColor: '#f8f9fa' }}>
                                                    {skill.charAt(0).toUpperCase()}: {val}
                                                </span>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 13. Portfolios Section */}
            <section id="portfolios" className="services section">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={portfolios.section_info.icon_class}></i> {portfolios.section_info.title}
                        <Link to="/portfolios-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{portfolios.section_info.details}</h6>
                </div>

                <div className="container">
                    <div className="row gy-4">
                        {(portfolios.portfolios || []).map((repo, idx) => (
                            <div
                                className="col-lg-4 col-md-6 service-item d-flex"
                                key={idx}
                                data-aos="fade-up"
                                data-aos-delay={100 * idx}
                            >
                                <div className="icon flex-shrink-0">
                                    {/* Dynamic GitHub Icon from JSON */}
                                    <i className={repo.icon_class || 'bx bxl-github'}></i>
                                </div>
                                <div>
                                    <h4 className="title">
                                        {/* Stretched link for card clickability, linking to GitHub */}
                                        <a href={repo.portfolio_url} target="_blank" rel="noreferrer" className="stretched-link">
                                            {repo.title}
                                        </a>
                                    </h4>

                                    <p className="mb-2">
                                        <small className="text-primary fw-bold">
                                            <i className="bi bi-link-45deg me-1"></i>
                                            View on GitHub
                                        </small>
                                    </p>

                                    <p className="description" style={{ textAlign: 'justify' }}>
                                        {repo.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 14. Volunteering Section */}
            <section id="volunteerings" className="services section light-background">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={volunteerings.section_info.icon_class}></i> {volunteerings.section_info.title}
                        <Link to="/volunteering-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{volunteerings.section_info.details}</h6>
                </div>

                <div className="container">
                    <div className="row gy-4">
                        {(volunteerings.volunteerings || []).map((vol, idx) => (
                            <div
                                className="col-lg-6 col-md-6 service-item d-flex"
                                key={idx}
                                data-aos="fade-up"
                                data-aos-delay={100 * idx}
                            >
                                <div className="icon flex-shrink-0">
                                    {/* Dynamic Icon from JSON */}
                                    <i className={vol.icon_class || 'bx bxs-donate-heart'}></i>
                                </div>
                                <div>
                                    <h4 className="title">
                                        <Link to={`/volunteering-details#${vol.id_ref}`} className="stretched-link">
                                            {vol.title}
                                        </Link>
                                    </h4>

                                    <p className="mb-1">
                                        <small className="text-muted fw-bold">
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {vol.timeframe_details.start_date} – {vol.timeframe_details.end_date}
                                        </small>
                                        <span className="badge bg-secondary ms-2" style={{ fontSize: '0.7rem' }}>
                                {vol.cause}
                            </span>
                                    </p>

                                    {/* Organization Detail */}
                                    {vol.organization && (
                                        <p className="mb-1">
                                            <small className="text-primary fw-bold">
                                                <i className="bi bi-building me-1"></i>
                                                {vol.organization}
                                            </small>
                                        </p>
                                    )}

                                    <p className="description" style={{ textAlign: 'justify' }}>
                                        {vol.summary_text}
                                    </p>

                                    {/* Image Preview - Shows only if image_path exists */}
                                    {vol.image_path && (
                                        <div className="mt-2" style={{ position: 'relative', zIndex: 10 }}>
                                            <a
                                                href={vol.image_path}
                                                className="glightbox"
                                                data-gallery="volunteering-gallery"
                                                title={vol.title}
                                            >
                                                <img
                                                    src={vol.image_path}
                                                    alt={vol.title}
                                                    className="img-fluid rounded shadow-sm"
                                                    style={{ maxWidth: '120px', cursor: 'zoom-in' }}
                                                />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 15. Publications Section */}
            {/* 15. Publications Section */}
            <section id="publications" className="resume section">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={publications.section_info.icon_class}></i> {publications.section_info.title}
                        <Link to="/publication-details"><i className="bx bx-link ms-2"></i></Link>
                    </h2>
                    <h6>{publications.section_info.details}</h6>
                </div>

                <div className="container" data-aos="fade-up" data-aos-delay="100">
                    <div className="row">
                        {['left', 'right'].map((colSide) => (
                            <div className="col-lg-6" key={colSide}>
                                {Object.values(publications.publications)
                                    .filter(group => group.column === colSide)
                                    .map((group, gIdx) => (
                                        <div key={gIdx} className="resume-category-group mb-5">
                                            <h2 className="resume-title" style={{
                                                color: 'var(--accent-color)',
                                                borderBottom: '2px solid var(--accent-color)',
                                                paddingBottom: '5px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                <i className={group.icon_class}></i> {group.type} ({group.items?.length || 0})
                                            </h2>

                                            {group.items.map((pub, pIdx) => {
                                                // Local function to handle copy to clipboard
                                                const handleCopy = (htmlText) => {
                                                    const cleanText = htmlText.replace(/<\/?[^>]+(>|$)/g, "");
                                                    navigator.clipboard.writeText(cleanText);

                                                    const btn = document.getElementById(`btn-${pub.id_ref}`);
                                                    if (btn) {
                                                        const originalHTML = btn.innerHTML;
                                                        btn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
                                                        btn.classList.replace('bg-secondary', 'bg-success');
                                                        setTimeout(() => {
                                                            btn.innerHTML = originalHTML;
                                                            btn.classList.replace('bg-success', 'bg-secondary');
                                                        }, 2000);
                                                    }
                                                };

                                                return (
                                                    <div className="resume-item pb-3" key={pub.id_ref} id={pub.id_ref}>
                                                        <h4>{pub.title}</h4>

                                                        <p className="mb-2">
                                                            <span dangerouslySetInnerHTML={{ __html: pub.citation_text }}></span>
                                                        </p>

                                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                                            <button
                                                                id={`btn-${pub.id_ref}`}
                                                                onClick={() => handleCopy(pub.citation_text)}
                                                                className="badge border-0 bg-secondary"
                                                                style={{ cursor: 'pointer', transition: '0.3s' }}
                                                                title="Copy Citation"
                                                            >
                                                                <i className="bi bi-clipboard-plus me-1"></i> Copy Citation
                                                            </button>

                                                            {(pub.journal_link || pub.conference_link) && (
                                                                <a href={pub.journal_link || pub.conference_link} target="_blank" rel="noreferrer" className="text-primary small mt-1 ms-1">
                                                                    <i className="bi bi-box-arrow-up-right"></i> View Details
                                                                </a>
                                                            )}
                                                        </div>

                                                        {pub.abstract && (
                                                            <details style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                                                                <summary className="text-primary fw-bold">View Abstract</summary>
                                                                <p className="mt-2 text-muted" style={{ textAlign: 'justify' }}>
                                                                    {pub.abstract}
                                                                </p>
                                                            </details>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 16. Contacts Section */}
            <section id="contacts" className="services section light-background">
                <div className="container section-title" data-aos="fade-up">
                    <h2>
                        <i className={contacts.section_info.icon_class}></i> {contacts.section_info.title}
                    </h2>
                    <h6>{contacts.section_info.details}</h6>
                </div>

                <div className="container">
                    <div className="row gy-4">
                        {/* Map through the contact items */}
                        {Object.keys(contacts.contacts).map((key, idx) => {
                            const item = contacts.contacts[key];
                            if (!item || !item.text) return null;

                            // Handle link targeting logic
                            let targetAttr = {};
                            if (key === 'location') {
                                targetAttr = { target: "contact-iframe" };
                            } else if (key !== 'email') {
                                targetAttr = { target: "_blank", rel: "noreferrer" };
                            }

                            return (
                                <div
                                    className="col-lg-4 col-md-6 service-item d-flex"
                                    key={idx}
                                    data-aos="fade-up"
                                    data-aos-delay={100 * idx}
                                >
                                    <div className="icon flex-shrink-0">
                                        {/* Uses the icon_class from JSON */}
                                        <i className={item.icon_class}></i>
                                    </div>
                                    <div>
                                        <h4 className="title">
                                            <a href={item.link || '#'} {...targetAttr} className="stretched-link">
                                                {item.title}
                                            </a>
                                        </h4>
                                        <p className="description">{item.text}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Full-Width Map following the cards */}
                        <div className="col-lg-12 mt-4" data-aos="fade-up">
                            <div className="h-100 overflow-hidden rounded shadow-sm">
                                <iframe
                                    src={contacts.contacts.location.link}
                                    name="contact-iframe"
                                    width="100%"
                                    height="400px"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Location Map"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    );
};

export default Home;