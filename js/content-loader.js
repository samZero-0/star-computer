// Content Loader - Dynamically loads content from ContentManager to the landing page

class ContentLoader {
    constructor() {
        this.content = window.contentManager.getContent();
        console.log('ContentLoader initialized with content:', this.content);
    }

    init() {
        console.log('ContentLoader.init() called');
        this.loadThemeSettings(); // Load theme first
        this.loadHeroSlides();
        this.loadCompanyInfo();
        this.loadStats();
        this.loadAwards();
        this.loadClients();
        this.loadServices();
        this.loadAbout();
        this.loadContact();
        this.loadFooter();
        this.loadCustomCSS(); // Load custom CSS
        
        // Re-initialize reveal animations after content is loaded
        this.initRevealAnimations();
        
        // Initialize slider after hero slides are loaded
        setTimeout(() => {
            if (window.initializeSlider) {
                window.initializeSlider();
            }
        }, 100);
    }

    // Load and apply theme settings from localStorage
    loadThemeSettings() {
        const themeSettings = JSON.parse(localStorage.getItem('themeSettings'));
        if (!themeSettings) return;

        console.log('Applying theme settings:', themeSettings);

        // Create or update theme style element
        let themeStyle = document.getElementById('dynamic-theme-styles');
        if (!themeStyle) {
            themeStyle = document.createElement('style');
            themeStyle.id = 'dynamic-theme-styles';
            document.head.appendChild(themeStyle);
        }

        const { primaryColor, secondaryColor, bgColor, textColor, mode } = themeSettings;

        // Generate CSS with theme colors - focused on core elements only
        // Individual sections (stats, services, about) use their own gradient settings
        themeStyle.textContent = `
            :root {
                --theme-primary: ${primaryColor};
                --theme-secondary: ${secondaryColor};
                --theme-bg: ${bgColor};
                --theme-text: ${textColor};
            }

            /* Main gradient buttons and CTA elements */
            .bg-gradient-to-r.from-red-600.to-green-600,
            .bg-gradient-to-r.from-red-500.to-green-500 {
                background: linear-gradient(to right, ${primaryColor}, ${secondaryColor}) !important;
            }

            /* Back to top button */
            #backToTop {
                background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}) !important;
            }

            /* Custom scrollbar */
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}) !important;
            }

            /* Footer gradient line */
            footer .h-1.bg-gradient-to-r {
                background: linear-gradient(to right, ${primaryColor}, ${secondaryColor}) !important;
            }

            /* Preloader */
            #preloader polygon {
                fill: url(#preloaderGrad) !important;
            }

            /* Slider dot active state */
            .slider-dot.active {
                background: ${primaryColor} !important;
            }

            ${mode === 'dark' ? `
                /* Dark mode overrides */
                body {
                    background-color: #1f2937 !important;
                }
                .bg-gray-50, .bg-white {
                    background-color: #111827 !important;
                }
                .bg-gray-100 {
                    background-color: #1f2937 !important;
                }
                section.bg-white {
                    background-color: #111827 !important;
                }
                section.bg-gray-50, section.bg-gray-100 {
                    background-color: #1f2937 !important;
                }
                .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600 {
                    color: #f9fafb !important;
                }
                .text-gray-500 {
                    color: #9ca3af !important;
                }
                .border-gray-200, .border-gray-300 {
                    border-color: #374151 !important;
                }
                .service-card, .bg-white.p-8, .bg-white.p-6 {
                    background-color: #1f2937 !important;
                    border-color: #374151 !important;
                }
                nav#navbar {
                    background-color: rgba(17, 24, 39, 0.95) !important;
                }
                .nav-scrolled {
                    background-color: rgba(17, 24, 39, 0.98) !important;
                }
                .nav-link {
                    color: #f9fafb !important;
                }
            ` : ''}
        `;
    }

    // Helper: Darken a hex color
    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    // Helper: Convert hex to rgba
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Load custom CSS from localStorage
    loadCustomCSS() {
        const customCSS = localStorage.getItem('customCSS');
        if (!customCSS) return;

        let customStyle = document.getElementById('custom-css-styles');
        if (!customStyle) {
            customStyle = document.createElement('style');
            customStyle.id = 'custom-css-styles';
            document.head.appendChild(customStyle);
        }
        customStyle.textContent = customCSS;
    }

    loadHeroSlides() {
        const slides = this.content.heroSlides;
        const heroSlider = document.querySelector('#home.hero-slider');
        
        console.log('Loading hero slides:', slides?.length, 'slides');
        console.log('Hero slider element found:', !!heroSlider);
        
        if (!heroSlider || !slides || slides.length === 0) {
            console.warn('Cannot load hero slides - missing element or data');
            return;
        }

        // Get the slider dots container - use a more reliable selector
        const dotsContainer = heroSlider.querySelector('.flex.gap-3');
        const scrollIndicator = heroSlider.querySelector('.absolute.bottom-10.right-10');
        
        // Remove existing slides (but keep controls)
        const existingSlides = heroSlider.querySelectorAll('.slide');
        existingSlides.forEach(slide => slide.remove());

        // Generate new slides
        const slidesHTML = slides.map((slide, index) => {
            const gradientColors = this.getSlideGradient(index);
            return `
                <div class="slide ${index === 0 ? 'active' : ''}" style="background: linear-gradient(135deg, ${gradientColors.bg});">
                    <div class="absolute inset-0">
                        <img src="${slide.bgImage}" alt="" class="w-full h-full object-cover opacity-30">
                        <div class="absolute inset-0 bg-gradient-to-br ${slide.gradient || gradientColors.overlay}"></div>
                    </div>
                    <div class="absolute inset-0 overflow-hidden">
                        <div class="absolute top-20 left-10 w-72 h-72 ${gradientColors.blob1} rounded-full blur-3xl float-animation"></div>
                        <div class="absolute bottom-20 right-10 w-96 h-96 ${gradientColors.blob2} rounded-full blur-3xl float-animation" style="animation-delay: 1s;"></div>
                    </div>
                    <div class="relative z-10 h-full flex items-center">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${index === 0 ? '' : 'text-center'}">
                            <div class="${index === 0 ? 'grid md:grid-cols-2 gap-12 items-center' : 'max-w-4xl mx-auto'}">
                                <div class="text-white ${index === 0 ? '' : 'text-center'}">
                                    <div class="inline-block px-4 py-2 ${gradientColors.badgeBg} rounded-full mb-6 border ${gradientColors.badgeBorder}">
                                        <span class="${gradientColors.badgeText} font-medium"><i class="${slide.badgeIcon} mr-2"></i>${slide.badge}</span>
                                    </div>
                                    <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                        ${slide.title} ${index === 0 ? '<br>' : ''}
                                        <span class="bg-gradient-to-r ${gradientColors.titleGradient} bg-clip-text text-transparent">${slide.titleHighlight}</span>${slide.titleEnd ? ' ' + slide.titleEnd : ''}
                                    </h1>
                                    <p class="text-xl text-gray-300 mb-8 leading-relaxed ${index === 0 ? '' : 'max-w-2xl mx-auto'}">
                                        ${slide.description}
                                    </p>
                                    <div class="flex flex-wrap gap-4 ${index === 0 ? '' : 'justify-center'}">
                                        ${slide.primaryBtn ? `
                                            <a href="${slide.primaryBtn.link}" class="group bg-gradient-to-r ${gradientColors.btnGradient} ${gradientColors.btnText} px-8 py-4 rounded-full font-bold hover:shadow-xl ${gradientColors.btnShadow} transition-all transform hover:scale-105 inline-flex items-center">
                                                ${slide.primaryBtn.text} <i class="${slide.primaryBtn.icon || 'fas fa-arrow-right'} ml-2 group-hover:translate-x-1 transition-transform"></i>
                                            </a>
                                        ` : ''}
                                        ${slide.secondaryBtn ? `
                                            <a href="${slide.secondaryBtn.link}" class="glass text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all inline-flex items-center">
                                                <i class="${slide.secondaryBtn.icon || 'fas fa-play-circle'} mr-2"></i> ${slide.secondaryBtn.text}
                                            </a>
                                        ` : ''}
                                    </div>
                                </div>
                                ${index === 0 ? this.getHeroDecoration() : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Insert slides at the beginning of hero slider
        heroSlider.insertAdjacentHTML('afterbegin', slidesHTML);

        // Update dots if container exists
        if (dotsContainer) {
            dotsContainer.innerHTML = slides.map((_, index) => `
                <button class="slider-dot ${index === 0 ? 'active' : ''} w-3 h-3 rounded-full bg-white/50" data-slide="${index}"></button>
            `).join('');
            
            // Re-attach dot event listeners
            this.initSliderDots();
        }
    }

    getSlideGradient(index) {
        const gradients = [
            {
                bg: '#0f172a 0%, #1e3a5f 50%, #0f172a 100%',
                overlay: 'from-slate-900/90 via-blue-900/80 to-slate-900/90',
                blob1: 'bg-blue-500/20',
                blob2: 'bg-purple-500/20',
                badgeBg: 'bg-yellow-500/20',
                badgeBorder: 'border-yellow-500/30',
                badgeText: 'text-yellow-400',
                titleGradient: 'from-yellow-400 via-amber-500 to-orange-500',
                btnGradient: 'from-yellow-400 to-amber-500',
                btnText: 'text-slate-900',
                btnShadow: 'hover:shadow-yellow-500/30'
            },
            {
                bg: '#1e1b4b 0%, #312e81 50%, #1e1b4b 100%',
                overlay: 'from-indigo-900/90 via-purple-900/85 to-slate-900/90',
                blob1: 'bg-indigo-500/20',
                blob2: 'bg-violet-500/20',
                badgeBg: 'bg-indigo-500/20',
                badgeBorder: 'border-indigo-500/30',
                badgeText: 'text-indigo-300',
                titleGradient: 'from-indigo-400 to-violet-400',
                btnGradient: 'from-indigo-500 to-violet-500',
                btnText: 'text-white',
                btnShadow: 'hover:shadow-indigo-500/30'
            },
            {
                bg: '#064e3b 0%, #047857 50%, #064e3b 100%',
                overlay: 'from-emerald-900/90 via-teal-900/85 to-slate-900/90',
                blob1: 'bg-emerald-500/20',
                blob2: 'bg-teal-500/20',
                badgeBg: 'bg-emerald-500/20',
                badgeBorder: 'border-emerald-500/30',
                badgeText: 'text-emerald-300',
                titleGradient: 'from-emerald-400 to-teal-400',
                btnGradient: 'from-emerald-500 to-teal-500',
                btnText: 'text-white',
                btnShadow: 'hover:shadow-emerald-500/30'
            }
        ];
        return gradients[index % gradients.length];
    }

    getHeroDecoration() {
        return `
            <div class="hidden md:block relative">
                <div class="relative w-full aspect-square float-animation">
                    <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-2xl">
                        <defs>
                            <linearGradient id="heroStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#fbbf24"/>
                                <stop offset="100%" style="stop-color:#f59e0b"/>
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="url(#heroStarGrad)" filter="url(#glow)"/>
                    </svg>
                    <div class="absolute inset-0 spin-slow" style="animation-duration: 15s;">
                        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                                <i class="fas fa-laptop text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div class="absolute inset-0 spin-slow" style="animation-duration: 20s; animation-direction: reverse;">
                        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                                <i class="fas fa-code text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initSliderDots() {
        const dots = document.querySelectorAll('.slider-dot');
        const slides = document.querySelectorAll('.slide');
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Update slides
                slides.forEach(s => s.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                
                if (slides[index]) slides[index].classList.add('active');
                dot.classList.add('active');
                
                // Reset auto-slide interval
                if (window.slideInterval) {
                    clearInterval(window.slideInterval);
                    window.currentSlide = index;
                    this.startSlider();
                }
            });
        });
    }

    startSlider() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        
        if (slides.length === 0) return;
        
        window.slideInterval = setInterval(() => {
            window.currentSlide = ((window.currentSlide || 0) + 1) % slides.length;
            
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            if (slides[window.currentSlide]) slides[window.currentSlide].classList.add('active');
            if (dots[window.currentSlide]) dots[window.currentSlide].classList.add('active');
        }, 5000);
    }

    loadCompanyInfo() {
        const company = this.content.company;
        console.log('Loading company info:', company);
        
        // Update logo text in navbar
        const logoLinks = document.querySelectorAll('nav a[href="#home"]');
        console.log('Found logo links:', logoLinks.length);
        logoLinks.forEach(logoLink => {
            const textContainer = logoLink.querySelector('div.flex.flex-col');
            if (textContainer) {
                console.log('Updating logo with:', company.name, company.tagline);
                textContainer.innerHTML = `
                    <span class="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">${company.name}</span>
                    <span class="text-[10px] text-gray-400 tracking-wider -mt-1">${company.tagline}</span>
                `;
            }
        });

        // Update phone numbers in call buttons
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            const phoneNumber = company.phone.replace(/[^0-9+]/g, '');
            link.href = `tel:${phoneNumber}`;
            // Update button text if it contains phone-related text
            const buttonText = link.textContent.trim();
            if (buttonText.toLowerCase().includes('call')) {
                // Keep the icon and button style, just update the link
            }
        });

        // Update email links
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.href = `mailto:${company.email}`;
        });
    }

    loadStats() {
        const stats = this.content.stats;
        // Find the stats section - it's after hero section
        const statsSection = document.querySelector('section.relative.py-16.bg-gray-100');
        const statsContainer = statsSection?.querySelector('.grid');
        
        console.log('Loading stats:', stats?.length, 'Stats container found:', !!statsContainer);
        
        if (statsContainer && stats && stats.length > 0) {
            statsContainer.innerHTML = stats.map((stat, index) => `
                <div class="text-center reveal" ${index > 0 ? `style="transition-delay: ${index * 0.1}s;"` : ''}>
                    <div class="text-5xl font-bold bg-gradient-to-r ${stat.gradient || 'from-red-600 to-red-500'} bg-clip-text text-transparent mb-2" data-stat-id="${stat.id}">${stat.value}</div>
                    <div class="text-gray-600">${stat.label}</div>
                </div>
            `).join('');
            
            // Re-initialize reveal animations for new elements
            this.initRevealAnimations();
        }
    }

    loadAwards() {
        const awards = this.content.awards;
        const awardsSection = document.getElementById('awards');
        const awardsTrack = document.getElementById('awards-track');
        
        console.log('Loading awards:', awards?.length, 'Awards track found:', !!awardsTrack);
        
        // Hide section if no awards
        if (awardsSection) {
            awardsSection.style.display = (awards && awards.length > 0) ? 'block' : 'none';
        }
        
        if (awardsTrack && awards && awards.length > 0) {
            // Generate awards with clean, modern design
            const awardsHTML = awards.map((award, index) => {
                // Use image if provided, otherwise fall back to icon
                const displayContent = award.image && award.image.trim() !== '' 
                    ? `<img src="${award.image}" alt="${award.title}" class="award-img" onerror="this.onerror=null; this.outerHTML='<i class=\\'${award.icon || 'fas fa-trophy'} text-gray-400\\'></i>';">`
                    : `<i class="${award.icon || 'fas fa-trophy'} text-gray-400" style="font-size: 4rem;"></i>`;
                
                return `
                <div class="award-item group bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-default" style="min-width: 280px; max-width: 280px;">
                    <!-- Award Image -->
                    <div class="award-image-wrapper mb-4 h-32 flex items-center justify-center">
                        ${displayContent}
                    </div>
                    
                    <!-- Award Title -->
                    <h4 class="font-bold text-gray-900 text-center text-base leading-snug">${award.title}</h4>
                </div>
                `;
            }).join('');
            
            // Duplicate content for seamless marquee
            awardsTrack.innerHTML = awardsHTML + awardsHTML;
        }
    }

    loadClients() {
        const clients = this.content.clients;
        const clientsSection = document.getElementById('clients');
        const clientsGrid = document.getElementById('clients-grid');
        const clientsShowcase = document.getElementById('clients-showcase');
        
        console.log('Loading clients:', clients?.length, 'Clients grid found:', !!clientsGrid);
        
        // Hide section if no clients
        if (clientsSection) {
            clientsSection.style.display = (clients && clients.length > 0) ? 'block' : 'none';
        }
        
        if (clientsGrid && clients && clients.length > 0) {
            // Get section settings from first client or use defaults
            const sectionSettings = this.content.clientsSettings || {
                layout: 'grid', // grid, carousel, marquee
                cardStyle: 'elevated' // elevated, glass, gradient, minimal
            };
            
            // Color map for different themes
            const colorMap = {
                blue: { 
                    gradient: 'from-blue-500 to-cyan-500',
                    badge: 'bg-blue-100 text-blue-700',
                    glow: 'bg-blue-500'
                },
                green: { 
                    gradient: 'from-green-500 to-emerald-500',
                    badge: 'bg-green-100 text-green-700',
                    glow: 'bg-green-500'
                },
                purple: { 
                    gradient: 'from-purple-500 to-violet-500',
                    badge: 'bg-purple-100 text-purple-700',
                    glow: 'bg-purple-500'
                },
                orange: { 
                    gradient: 'from-orange-500 to-amber-500',
                    badge: 'bg-orange-100 text-orange-700',
                    glow: 'bg-orange-500'
                },
                red: { 
                    gradient: 'from-red-500 to-rose-500',
                    badge: 'bg-red-100 text-red-700',
                    glow: 'bg-red-500'
                },
                indigo: { 
                    gradient: 'from-indigo-500 to-blue-500',
                    badge: 'bg-indigo-100 text-indigo-700',
                    glow: 'bg-indigo-500'
                },
                pink: { 
                    gradient: 'from-pink-500 to-rose-500',
                    badge: 'bg-pink-100 text-pink-700',
                    glow: 'bg-pink-500'
                },
                emerald: { 
                    gradient: 'from-emerald-500 to-teal-500',
                    badge: 'bg-emerald-100 text-emerald-700',
                    glow: 'bg-emerald-500'
                },
                cyan: { 
                    gradient: 'from-cyan-500 to-blue-500',
                    badge: 'bg-cyan-100 text-cyan-700',
                    glow: 'bg-cyan-500'
                },
                amber: { 
                    gradient: 'from-amber-500 to-yellow-500',
                    badge: 'bg-amber-100 text-amber-700',
                    glow: 'bg-amber-500'
                }
            };

            // Generate client card HTML
            const generateClientCard = (client, index) => {
                const cardStyle = client.cardStyle || sectionSettings.cardStyle || 'elevated';
                
                // Determine card style class
                const cardStyleClass = {
                    'elevated': 'client-card-elevated',
                    'glass': 'client-card-glass',
                    'gradient': 'client-card-gradient',
                    'minimal': 'client-card-minimal'
                }[cardStyle] || 'client-card-elevated';
                
                // Use image if provided, otherwise fall back to icon
                const logoContent = client.image && client.image.trim() !== '' 
                    ? `<img src="${client.image}" alt="${client.name}" class="client-logo-img">`
                    : `<i class="${client.icon || 'fas fa-building'} text-gray-400 text-4xl"></i>`;
                
                return `
                <div class="client-card-modern ${cardStyleClass} reveal" style="animation-delay: ${index * 0.1}s;">
                    <div class="flex flex-col items-center text-center">
                        <!-- Logo -->
                        <div class="client-logo-simple">
                            ${logoContent}
                        </div>
                        
                        <!-- Client Name -->
                        <h4 class="client-name-simple">${client.name}</h4>
                    </div>
                </div>
                `;
            };

            // Generate all cards
            const cardsHTML = clients.map((client, index) => generateClientCard(client, index)).join('');
            
            // Apply layout
            const layout = sectionSettings.layout || 'grid';
            
            // Update container class based on layout
            clientsGrid.className = '';
            
            // Show/hide navigation buttons
            const navButtons = clientsShowcase?.querySelectorAll('.clients-nav-btn');
            
            switch (layout) {
                case 'carousel':
                    clientsGrid.className = 'clients-carousel';
                    navButtons?.forEach(btn => btn.classList.remove('hidden'));
                    clientsGrid.innerHTML = cardsHTML;
                    break;
                    
                case 'marquee':
                    clientsGrid.className = 'clients-marquee overflow-hidden';
                    navButtons?.forEach(btn => btn.classList.add('hidden'));
                    // Duplicate cards for seamless marquee
                    clientsGrid.innerHTML = cardsHTML + cardsHTML;
                    break;
                    
                case 'grid':
                default:
                    clientsGrid.className = 'clients-grid-modern';
                    navButtons?.forEach(btn => btn.classList.add('hidden'));
                    clientsGrid.innerHTML = cardsHTML;
                    break;
            }
            
            // Re-initialize reveal animations for new elements
            this.initRevealAnimations();
        }
    }

    loadServices() {
        const services = this.content.services;
        const servicesContainer = document.querySelector('#services .grid.md\\:grid-cols-3');
        
        console.log('Loading services:', services?.length, 'Services container found:', !!servicesContainer);
        
        if (servicesContainer && services && services.length > 0) {
            servicesContainer.innerHTML = services.map((service, index) => {
                // Use the service's custom gradient or fall back to colorClass mapping
                const colorMap = {
                    blue: {
                        border: 'hover:border-blue-500/50',
                        gradient: 'from-blue-500 to-cyan-500',
                        icon: 'text-blue-600',
                        title: 'group-hover:text-blue-600',
                        link: 'text-blue-600 group-hover:text-blue-500'
                    },
                    purple: {
                        border: 'hover:border-purple-500/50',
                        gradient: 'from-purple-500 to-pink-500',
                        icon: 'text-purple-600',
                        title: 'group-hover:text-purple-600',
                        link: 'text-purple-600 group-hover:text-purple-500'
                    },
                    emerald: {
                        border: 'hover:border-emerald-500/50',
                        gradient: 'from-emerald-500 to-teal-500',
                        icon: 'text-emerald-600',
                        title: 'group-hover:text-emerald-600',
                        link: 'text-emerald-600 group-hover:text-emerald-500'
                    },
                    red: {
                        border: 'hover:border-red-500/50',
                        gradient: 'from-red-500 to-red-600',
                        icon: 'text-red-600',
                        title: 'group-hover:text-red-600',
                        link: 'text-red-600 group-hover:text-red-500'
                    },
                    green: {
                        border: 'hover:border-green-500/50',
                        gradient: 'from-green-500 to-green-600',
                        icon: 'text-green-600',
                        title: 'group-hover:text-green-600',
                        link: 'text-green-600 group-hover:text-green-500'
                    },
                    orange: {
                        border: 'hover:border-orange-500/50',
                        gradient: 'from-orange-500 to-amber-500',
                        icon: 'text-orange-600',
                        title: 'group-hover:text-orange-600',
                        link: 'text-orange-600 group-hover:text-orange-500'
                    },
                    indigo: {
                        border: 'hover:border-indigo-500/50',
                        gradient: 'from-indigo-500 to-violet-500',
                        icon: 'text-indigo-600',
                        title: 'group-hover:text-indigo-600',
                        link: 'text-indigo-600 group-hover:text-indigo-500'
                    },
                    pink: {
                        border: 'hover:border-pink-500/50',
                        gradient: 'from-pink-500 to-rose-500',
                        icon: 'text-pink-600',
                        title: 'group-hover:text-pink-600',
                        link: 'text-pink-600 group-hover:text-pink-500'
                    }
                };
                
                const colors = colorMap[service.colorClass] || colorMap.blue;
                const gradient = service.gradient || colors.gradient;
                
                return `
                <div class="service-card group bg-white p-8 rounded-2xl border border-gray-200 ${colors.border} shadow-lg hover:shadow-xl reveal" ${index > 0 ? `style="transition-delay: ${index * 0.1}s;"` : ''}>
                    <div class="relative w-20 h-20 mb-6">
                        <div class="absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-10 group-hover:opacity-20 transition"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <i class="${service.icon} text-4xl ${colors.icon} group-hover:scale-110 transition-transform"></i>
                        </div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4 ${colors.title} transition">${service.title}</h3>
                    <p class="text-gray-600 leading-relaxed mb-6">${service.description}</p>
                    <a href="#contact" class="inline-flex items-center ${colors.link} font-medium">
                        Learn More <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
                `;
            }).join('');
            
            // Re-initialize reveal animations for new elements
            this.initRevealAnimations();
        }
    }

    loadAbout() {
        const about = this.content.about;
        const company = this.content.company;
        const aboutSection = document.querySelector('#about');
        
        console.log('Loading about section:', about);
        
        if (aboutSection && about) {
            // Update about badge
            const badge = aboutSection.querySelector('.bg-green-500\\/10 span');
            if (badge) badge.textContent = about.badge || 'About Us';

            // Update about title
            const titleEl = aboutSection.querySelector('h2.text-4xl');
            if (titleEl && about.title) {
                titleEl.innerHTML = `${about.title} <span class="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">${about.titleHighlight || ''}</span>`;
            }

            // Update about descriptions - find them more reliably
            const descParagraphs = aboutSection.querySelectorAll('.reveal p.text-lg');
            if (descParagraphs[0] && about.description1) descParagraphs[0].textContent = about.description1;
            if (descParagraphs[1] && about.description2) descParagraphs[1].textContent = about.description2;

            // Update "Why Choose Us" items with gradients
            const whyChooseUsList = aboutSection.querySelector('ul.space-y-6');
            if (whyChooseUsList && about.whyChooseUs && about.whyChooseUs.length > 0) {
                whyChooseUsList.innerHTML = about.whyChooseUs.map((item, index) => {
                    const gradient = item.gradient || (index % 2 === 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600');
                    return `
                        <li class="flex items-start gap-4 group">
                            <div class="w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <i class="fas fa-check text-white text-sm"></i>
                            </div>
                            <div>
                                <h4 class="text-gray-900 font-semibold mb-1">${item.title}</h4>
                                <p class="text-gray-500 text-sm">${item.subtitle}</p>
                            </div>
                        </li>
                    `;
                }).join('');
            }
        }
    }

    loadContact() {
        const contact = this.content.contact;
        const company = this.content.company;
        const contactSection = document.querySelector('#contact');
        
        console.log('Loading contact section:', contact, company);
        
        if (contactSection) {
            // Update contact badge
            const badge = contactSection.querySelector('.bg-red-500\\/10 span');
            if (badge && contact.badge) badge.textContent = contact.badge;
            
            // Update contact title
            const titleEl = contactSection.querySelector('.text-center h2.text-4xl');
            if (titleEl && contact.title) titleEl.textContent = contact.title;
            
            // Update contact subtitle
            const subtitleEl = contactSection.querySelector('.text-center p.text-xl');
            if (subtitleEl && contact.subtitle) subtitleEl.textContent = contact.subtitle;
            
            // Update contact info cards - find them by icon
            const contactCards = contactSection.querySelectorAll('.space-y-8 > div');
            
            contactCards.forEach(card => {
                const icon = card.querySelector('i');
                const textEl = card.querySelector('p.text-gray-600');
                
                if (icon && textEl && company) {
                    if (icon.classList.contains('fa-map-marker-alt')) {
                        // Office Address
                        textEl.innerHTML = (company.officeAddress || '').replace(/\n/g, '<br>');
                    } else if (icon.classList.contains('fa-building')) {
                        // Registered Address
                        textEl.innerHTML = (company.registeredAddress || '').replace(/\n/g, '<br>');
                    } else if (icon.classList.contains('fa-phone-alt')) {
                        // Phone
                        textEl.textContent = company.phone || '';
                    } else if (icon.classList.contains('fa-envelope')) {
                        // Email
                        textEl.textContent = company.email || '';
                    }
                }
            });

            // Update CTA section
            const ctaTitle = contactSection.querySelector('h3.text-3xl');
            const ctaDesc = contactSection.querySelector('.text-gray-600.mb-8.text-lg');
            if (ctaTitle && contact.ctaTitle) ctaTitle.textContent = contact.ctaTitle;
            if (ctaDesc && contact.ctaDescription) ctaDesc.textContent = contact.ctaDescription;
        }
    }

    loadFooter() {
        const footer = this.content.footer;
        const company = this.content.company;
        const footerEl = document.querySelector('footer');
        
        if (footerEl) {
            // Update company description
            const description = footerEl.querySelector('p.text-gray-400.mb-6');
            if (description) description.textContent = company.description;

            // Update copyright
            const copyright = footerEl.querySelector('.text-gray-500.text-sm');
            if (copyright) copyright.textContent = footer.copyright;

            // Update designer credit
            const designerLink = footerEl.querySelector('a[href*="github"]');
            if (designerLink) {
                designerLink.textContent = footer.designedBy;
                designerLink.href = footer.designerLink;
            }
        }
    }

    initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        
        const revealOnScroll = () => {
            reveals.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const revealPoint = 150;

                if (elementTop < windowHeight - revealPoint) {
                    element.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    }
}

// Initialize content loader when DOM is ready
let contentLoaderInitialized = false;

function initContentLoader(content) {
    if (contentLoaderInitialized) {
        console.log('ContentLoader already initialized, skipping');
        return;
    }
    contentLoaderInitialized = true;
    console.log('Initializing ContentLoader...');
    const loader = new ContentLoader();
    if (content) {
        loader.content = content;
    }
    loader.init();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up content loader listeners');
    
    // Listen for content loaded from API
    window.addEventListener('contentLoaded', (event) => {
        console.log('contentLoaded event received');
        initContentLoader(event.detail);
    });
    
    // Fallback: If content is already available (cached), init after short delay
    setTimeout(() => {
        if (window.contentManager && window.contentManager.getContent() && !contentLoaderInitialized) {
            console.log('Fallback: Initializing with existing content');
            initContentLoader(window.contentManager.getContent());
        }
    }, 800);
});
