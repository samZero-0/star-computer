// API Configuration - Uses config.js if available
const API_BASE_URL = (typeof window !== 'undefined' && window.APP_CONFIG) 
    ? window.APP_CONFIG.API_BASE_URL 
    : 'http://localhost:5000/api';

// Default site content - This serves as fallback data
const defaultContent = {
    // Company Info
    company: {
        name: "STAR COMPUTERS",
        tagline: "SINCE 1993",
        description: "Excellence in Technology Since 1993. Your trusted partner for all IT solutions in Bangladesh.",
        phone: "+88-01712-908621",
        email: "star@hotmail.com",
        officeAddress: "1205, East Monipur, Mirpur\nDhaka-1216, Bangladesh",
        registeredAddress: "Hazi Tower (1st floor)\n796, Kazipara, Mirpur"
    },

    // Hero Slides
    heroSlides: [
        {
            id: 1,
            badge: "30+ Years of Excellence",
            badgeIcon: "fas fa-star",
            title: "Your Trusted",
            titleHighlight: "Technology",
            titleEnd: "Partner",
            description: "Delivering cutting-edge IT solutions, expert consultancy, and comprehensive training since 1993.",
            primaryBtn: { text: "Get Started", link: "#contact", icon: "fas fa-arrow-right" },
            secondaryBtn: { text: "Our Services", link: "#services", icon: "fas fa-play-circle" },
            gradient: "from-slate-900/90 via-blue-900/80 to-slate-900/90",
            bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 2,
            badge: "Professional Training",
            badgeIcon: "fas fa-graduation-cap",
            title: "Expert",
            titleHighlight: "IT Training",
            titleEnd: "",
            description: "Empower your team with industry-leading technology skills. From basics to advanced certifications.",
            primaryBtn: { text: "Explore Programs", link: "#services", icon: "fas fa-arrow-right" },
            secondaryBtn: null,
            gradient: "from-indigo-900/90 via-purple-900/85 to-slate-900/90",
            bgImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        },
        {
            id: 3,
            badge: "Complete Solutions",
            badgeIcon: "fas fa-tools",
            title: "Sales &",
            titleHighlight: "Service",
            titleEnd: "",
            description: "Quality hardware, software solutions, and dedicated after-sales support to keep your business running.",
            primaryBtn: { text: "Contact Us", link: "#contact", icon: "fas fa-arrow-right" },
            secondaryBtn: null,
            gradient: "from-emerald-900/90 via-teal-900/85 to-slate-900/90",
            bgImage: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        }
    ],

    // Statistics
    stats: [
        { id: 1, value: "30+", label: "Years Experience", gradient: "from-yellow-400 to-amber-500" },
        { id: 2, value: "1000+", label: "Happy Clients", gradient: "from-blue-400 to-cyan-500" },
        { id: 3, value: "500+", label: "Projects Done", gradient: "from-purple-400 to-pink-500" },
        { id: 4, value: "24/7", label: "Support", gradient: "from-emerald-400 to-teal-500" }
    ],

    // Services
    services: [
        {
            id: 1,
            title: "Consultancy",
            description: "Expert guidance and strategic IT planning to help your business leverage technology effectively and achieve your goals.",
            icon: "fas fa-lightbulb",
            colorClass: "blue",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            id: 2,
            title: "Training",
            description: "Comprehensive training programs designed to empower your team with the latest technology skills and best practices.",
            icon: "fas fa-graduation-cap",
            colorClass: "purple",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            id: 3,
            title: "Sales & Service",
            description: "Quality computer hardware and software solutions with reliable after-sales support to keep your systems running smoothly.",
            icon: "fas fa-cogs",
            colorClass: "emerald",
            gradient: "from-emerald-500 to-teal-500"
        }
    ],

    // About Section
    about: {
        badge: "About Us",
        title: "Trusted Since",
        titleHighlight: "1993",
        description1: "For over three decades, Star Computers has been at the forefront of technology solutions in Dhaka. We combine industry expertise with personalized service to deliver exceptional value to our clients.",
        description2: "Our commitment to excellence and customer satisfaction has made us a preferred technology partner for businesses and individuals across Bangladesh.",
        whyChooseUs: [
            { title: "Three Decades of Expertise", subtitle: "Proven track record in delivering IT solutions", gradient: "from-emerald-400 to-teal-500" },
            { title: "Comprehensive Services", subtitle: "From consultancy to sales and training", gradient: "from-blue-400 to-cyan-500" },
            { title: "Dedicated Support", subtitle: "Always here when you need us", gradient: "from-purple-400 to-pink-500" },
            { title: "Competitive Pricing", subtitle: "Best value for your investment", gradient: "from-yellow-400 to-amber-500" }
        ]
    },

    // Contact Section
    contact: {
        badge: "Get In Touch",
        title: "Contact Us",
        subtitle: "We're here to help with all your technology needs",
        ctaTitle: "Ready to Get Started?",
        ctaDescription: "Contact us today to discuss how we can help transform your technology infrastructure and drive your business forward."
    },

    // Social Links
    socialLinks: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        whatsapp: "#"
    },

    // Footer
    footer: {
        copyright: "© 2026 Star Computers. All rights reserved.",
        designedBy: "Designed by Kazi Samin Nawal",
        designerLink: "https://github.com/samZero-0"
    }
};

// Content Manager Class - Now with API support
class ContentManager {
    constructor() {
        this.storageKey = 'starComputersContent';
        this.content = { ...defaultContent };
        this.isLoading = false;
        this.apiAvailable = true;
        
        // Initialize by loading from API
        this.initContent();
    }

    async initContent() {
        // Try to load from API first
        const apiContent = await this.loadFromAPI();
        if (apiContent) {
            this.content = apiContent;
        } else {
            // Fallback to localStorage if API fails
            this.content = this.loadFromLocalStorage();
        }
        
        // Dispatch event when content is ready
        window.dispatchEvent(new CustomEvent('contentLoaded', { detail: this.content }));
    }

    async loadFromAPI() {
        try {
            const response = await fetch(`${API_BASE_URL}/content`);
            if (!response.ok) {
                throw new Error('API request failed');
            }
            const data = await response.json();
            this.apiAvailable = true;
            console.log('Content loaded from API');
            
            // Also save to localStorage as backup
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            return data;
        } catch (error) {
            console.warn('Could not load from API, using fallback:', error.message);
            this.apiAvailable = false;
            return null;
        }
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing stored content:', e);
                return { ...defaultContent };
            }
        }
        return { ...defaultContent };
    }

    async saveContent(content) {
        this.content = content;
        
        // Save to localStorage as backup
        localStorage.setItem(this.storageKey, JSON.stringify(content));
        
        // Save to API
        if (this.apiAvailable) {
            try {
                const response = await fetch(`${API_BASE_URL}/content`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(content)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save to API');
                }
                
                console.log('Content saved to API');
                return true;
            } catch (error) {
                console.error('Error saving to API:', error);
                return false;
            }
        }
        
        return true;
    }

    getContent() {
        return this.content;
    }

    async updateSection(section, data) {
        this.content[section] = data;
        
        // Save to localStorage as backup
        localStorage.setItem(this.storageKey, JSON.stringify(this.content));
        
        // Save section to API
        if (this.apiAvailable) {
            try {
                const response = await fetch(`${API_BASE_URL}/content/${section}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to save section to API');
                }
                
                console.log(`Section '${section}' saved to API`);
                return true;
            } catch (error) {
                console.error('Error saving section to API:', error);
                return false;
            }
        }
        
        return true;
    }

    async resetToDefault() {
        this.content = { ...defaultContent };
        localStorage.removeItem(this.storageKey);
        
        // Reset on API
        if (this.apiAvailable) {
            try {
                const response = await fetch(`${API_BASE_URL}/content/reset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to reset on API');
                }
                
                const data = await response.json();
                this.content = data.data;
                console.log('Content reset on API');
            } catch (error) {
                console.error('Error resetting on API:', error);
            }
        }
        
        return this.content;
    }

    exportContent() {
        return JSON.stringify(this.content, null, 2);
    }

    async importContent(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            
            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(imported));
            
            // Import to API
            if (this.apiAvailable) {
                try {
                    const response = await fetch(`${API_BASE_URL}/content/import`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(imported)
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to import to API');
                    }
                    
                    const data = await response.json();
                    this.content = data.data;
                    console.log('Content imported to API');
                } catch (error) {
                    console.error('Error importing to API:', error);
                    this.content = imported;
                }
            } else {
                this.content = imported;
            }
            
            return true;
        } catch (e) {
            console.error('Error importing content:', e);
            return false;
        }
    }

    // Check if API is available
    async checkAPIStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            this.apiAvailable = response.ok;
            return this.apiAvailable;
        } catch (error) {
            this.apiAvailable = false;
            return false;
        }
    }

    isAPIAvailable() {
        return this.apiAvailable;
    }
}

// Create global instance
window.contentManager = new ContentManager();
