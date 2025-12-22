import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Context to hold the global state
const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);

    // List of files to fetch, mirroring your site-loader.js configuration
    const JSON_FILES = [
        'site.json', 'personal_info.json', 'key_metrics.json', 'education.json',
        'professional_experience.json', 'expertise_achievements.json', 'skills.json',
        'honors_awards.json', 'courses_trainings_certificates.json', 'projects.json',
        'memberships.json', 'sessions_events.json', 'languages.json', 'portfolios.json',
        'volunteerings.json', 'publications.json', 'contacts.json', 'ea_logo.json',
        'copyright.json', 'diary.json', 'gallery.json'
    ];

    const BASE_DATA_PATH = './assets/data/'; // Path defined in your loader

    useEffect(() => {
        const loadData = async () => {
            const CACHE_KEY = 'site_data_cache';
            const TIMESTAMP_KEY = 'site_data_timestamp';

            // 1. Caching Strategy from your site-loader.js
            const cachedData = localStorage.getItem(CACHE_KEY);
            const lastFetch = localStorage.getItem(TIMESTAMP_KEY);
            const now = new Date().getTime();

            if (cachedData && lastFetch) {
                try {
                    const tempSiteData = JSON.parse(cachedData);
                    const expirationSeconds = tempSiteData.site?.cache_settings?.expiration_seconds || 86400;
                    const expirationMs = expirationSeconds * 1000;

                    if (now - lastFetch < expirationMs) {
                        console.log(`Loading data from ${expirationSeconds}s cache...`);
                        setSiteData(tempSiteData);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.warn("Cache parsing failed, performing fresh fetch.");
                }
            }

            // 2. Fresh Fetch Logic
            console.log('Fetching fresh site data...');
            try {
                const fetchPromises = JSON_FILES.map(fileName =>
                    fetch(BASE_DATA_PATH + fileName)
                        .then(res => {
                            if (!res.ok) throw new Error(`Failed to load ${fileName}`);
                            return res.json();
                        })
                        .then(data => ({ name: fileName.replace('.json', ''), data }))
                );

                const results = await Promise.all(fetchPromises);
                const combinedData = {};
                results.forEach(item => {
                    combinedData[item.name] = item.data;
                });

                // Save to localStorage
                localStorage.setItem(CACHE_KEY, JSON.stringify(combinedData));
                localStorage.setItem(TIMESTAMP_KEY, now.toString());

                setSiteData(combinedData);
            } catch (error) {
                console.error('Error during data loading:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <SiteContext.Provider value={{ siteData, loading }}>
            {children}
        </SiteContext.Provider>
    );
};

// Custom hook for easy data access in components
export const useSite = () => useContext(SiteContext);
