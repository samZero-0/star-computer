// Default site content for initial database population
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

module.exports = defaultContent;
