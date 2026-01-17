// Admin Panel JavaScript

class AdminPanel {
    constructor() {
        this.content = window.contentManager.getContent();
        this.currentSection = 'dashboard';
        this.mediaLibrary = JSON.parse(localStorage.getItem('mediaLibrary')) || [];
        this.themeSettings = JSON.parse(localStorage.getItem('themeSettings')) || {
            primaryColor: '#dc2626',
            secondaryColor: '#16a34a',
            bgColor: '#f9fafb',
            textColor: '#111827',
            mode: 'light'
        };
        this.seoSettings = JSON.parse(localStorage.getItem('seoSettings')) || {};
        this.customCSS = localStorage.getItem('customCSS') || '';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.loadDashboard();
        this.setupSaveHandlers();
        this.setupModals();
        this.setupMediaUpload();
        this.setupColorInputSync();
        this.loadThemeSettings();
        this.setupStatPreview();
    }
    
    // Setup stat preview updates
    setupStatPreview() {
        const statValue = document.getElementById('stat-value');
        const statGradient = document.getElementById('stat-gradient');
        
        if (statValue) {
            statValue.addEventListener('input', () => this.updateStatPreview());
        }
        if (statGradient) {
            statGradient.addEventListener('change', () => this.updateStatPreview());
        }
    }

    // Navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.navigateTo(section);
            });
        });
    }

    navigateTo(section) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });

        // Update panels
        document.querySelectorAll('.section-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(`${section}-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'theme': 'Theme & Colors',
            'media': 'Media Library',
            'company': 'Company Info',
            'hero': 'Hero Slider',
            'stats': 'Statistics',
            'services': 'Services',
            'about': 'About Section',
            'contact': 'Contact Info',
            'footer': 'Footer',
            'seo': 'SEO Settings',
            'custom-css': 'Custom CSS',
            'settings': 'Settings'
        };
        document.querySelector('.page-title').textContent = titles[section] || 'Admin Panel';

        this.currentSection = section;
        this.loadSectionData(section);

        // Close mobile menu
        document.querySelector('.admin-sidebar').classList.remove('active');
    }

    loadSectionData(section) {
        this.content = window.contentManager.getContent();
        
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'theme':
                this.loadThemeSettings();
                break;
            case 'media':
                this.loadMediaLibrary();
                break;
            case 'company':
                this.loadCompanyForm();
                break;
            case 'hero':
                this.loadHeroSlides();
                break;
            case 'stats':
                this.loadStats();
                break;
            case 'services':
                this.loadServices();
                break;
            case 'about':
                this.loadAbout();
                break;
            case 'contact':
                this.loadContact();
                break;
            case 'footer':
                this.loadFooter();
                break;
            case 'seo':
                this.loadSEO();
                break;
            case 'custom-css':
                this.loadCustomCSS();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.admin-sidebar');
        
        menuToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Dashboard
    loadDashboard() {
        const content = this.content;
        
        // Update dashboard stats
        document.getElementById('dash-slides')?.textContent && (document.getElementById('dash-slides').textContent = content.heroSlides?.length || 3);
        document.getElementById('dash-services')?.textContent && (document.getElementById('dash-services').textContent = content.services?.length || 3);
        document.getElementById('dash-stats')?.textContent && (document.getElementById('dash-stats').textContent = content.stats?.length || 4);
    }

    // Company Form
    loadCompanyForm() {
        const company = this.content.company;
        
        const fields = ['name', 'tagline', 'description', 'phone', 'email', 'officeAddress', 'registeredAddress'];
        fields.forEach(field => {
            const input = document.getElementById(`company-${field}`);
            if (input) {
                input.value = company[field] || '';
            }
        });
        
        // Load logo if exists
        const logoInput = document.getElementById('company-logo');
        if (logoInput) {
            logoInput.value = company.logo || '';
        }
    }

    saveCompany() {
        const company = {
            logo: document.getElementById('company-logo')?.value || '',
            name: document.getElementById('company-name')?.value || '',
            tagline: document.getElementById('company-tagline')?.value || '',
            description: document.getElementById('company-description')?.value || '',
            phone: document.getElementById('company-phone')?.value || '',
            email: document.getElementById('company-email')?.value || '',
            officeAddress: document.getElementById('company-officeAddress')?.value || '',
            registeredAddress: document.getElementById('company-registeredAddress')?.value || ''
        };
        
        window.contentManager.updateSection('company', company).then(() => {
            this.showToast('Company info saved successfully!', 'success');
        }).catch(() => {
            this.showToast('Error saving company info', 'error');
        });
    }

    // Theme & Colors
    setupColorInputSync() {
        const colorPairs = [
            ['theme-primaryColor', 'theme-primaryColorHex'],
            ['theme-secondaryColor', 'theme-secondaryColorHex'],
            ['theme-bgColor', 'theme-bgColorHex'],
            ['theme-textColor', 'theme-textColorHex']
        ];

        colorPairs.forEach(([colorId, hexId]) => {
            const colorInput = document.getElementById(colorId);
            const hexInput = document.getElementById(hexId);
            
            if (colorInput && hexInput) {
                colorInput.addEventListener('input', () => {
                    hexInput.value = colorInput.value;
                    this.updateThemePreview();
                });
                hexInput.addEventListener('input', () => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) {
                        colorInput.value = hexInput.value;
                        this.updateThemePreview();
                    }
                });
            }
        });
    }

    loadThemeSettings() {
        const theme = this.themeSettings;
        
        const colorInputs = ['primaryColor', 'secondaryColor', 'bgColor', 'textColor'];
        colorInputs.forEach(field => {
            const colorInput = document.getElementById(`theme-${field}`);
            const hexInput = document.getElementById(`theme-${field}Hex`);
            if (colorInput) colorInput.value = theme[field] || '#000000';
            if (hexInput) hexInput.value = theme[field] || '#000000';
        });

        // Set theme mode buttons
        document.getElementById('theme-light')?.classList.toggle('active', theme.mode === 'light');
        document.getElementById('theme-dark')?.classList.toggle('active', theme.mode === 'dark');

        this.updateThemePreview();
    }

    applyColorPreset(preset) {
        const presets = {
            'red-green': { primaryColor: '#dc2626', secondaryColor: '#16a34a' },
            'blue-purple': { primaryColor: '#3b82f6', secondaryColor: '#8b5cf6' },
            'orange-teal': { primaryColor: '#f97316', secondaryColor: '#14b8a6' },
            'pink-indigo': { primaryColor: '#ec4899', secondaryColor: '#6366f1' }
        };

        const selectedPreset = presets[preset];
        if (selectedPreset) {
            this.themeSettings.primaryColor = selectedPreset.primaryColor;
            this.themeSettings.secondaryColor = selectedPreset.secondaryColor;
            this.loadThemeSettings();
            this.showToast(`Applied ${preset} preset!`, 'success');
        }
    }

    setThemeMode(mode) {
        this.themeSettings.mode = mode;
        document.getElementById('theme-light')?.classList.toggle('active', mode === 'light');
        document.getElementById('theme-dark')?.classList.toggle('active', mode === 'dark');
        
        if (mode === 'dark') {
            this.themeSettings.bgColor = '#1f2937';
            this.themeSettings.textColor = '#f9fafb';
        } else {
            this.themeSettings.bgColor = '#f9fafb';
            this.themeSettings.textColor = '#111827';
        }
        this.loadThemeSettings();
    }

    updateThemePreview() {
        const preview = document.getElementById('theme-preview');
        if (!preview) return;

        const primary = document.getElementById('theme-primaryColor')?.value || this.themeSettings.primaryColor;
        const secondary = document.getElementById('theme-secondaryColor')?.value || this.themeSettings.secondaryColor;
        const bg = document.getElementById('theme-bgColor')?.value || this.themeSettings.bgColor;
        const text = document.getElementById('theme-textColor')?.value || this.themeSettings.textColor;

        preview.style.background = bg;
        preview.querySelector('.preview-logo').style.background = `linear-gradient(135deg, ${primary}, ${secondary})`;
        preview.querySelector('.preview-logo').style.webkitBackgroundClip = 'text';
        preview.querySelector('.preview-logo').style.webkitTextFillColor = 'transparent';
        preview.querySelector('.highlight').style.background = `linear-gradient(135deg, ${primary}, ${secondary})`;
        preview.querySelector('.highlight').style.webkitBackgroundClip = 'text';
        preview.querySelector('.highlight').style.webkitTextFillColor = 'transparent';
        preview.querySelector('.preview-btn-primary').style.background = `linear-gradient(135deg, ${primary}, ${secondary})`;
        preview.querySelector('h2').style.color = text;
        preview.querySelector('p').style.color = text;
    }

    saveTheme() {
        this.themeSettings = {
            primaryColor: document.getElementById('theme-primaryColor')?.value || '#dc2626',
            secondaryColor: document.getElementById('theme-secondaryColor')?.value || '#16a34a',
            bgColor: document.getElementById('theme-bgColor')?.value || '#f9fafb',
            textColor: document.getElementById('theme-textColor')?.value || '#111827',
            mode: this.themeSettings.mode
        };
        localStorage.setItem('themeSettings', JSON.stringify(this.themeSettings));
        this.showToast('Theme saved! Refresh the main site to see changes.', 'success');
    }

    // Media Library
    setupMediaUpload() {
        const uploadZone = document.getElementById('upload-zone');
        const uploadInput = document.getElementById('media-upload');

        if (uploadZone && uploadInput) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });

            uploadInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        url: e.target.result,
                        type: 'local'
                    };
                    this.mediaLibrary.push(imageData);
                    localStorage.setItem('mediaLibrary', JSON.stringify(this.mediaLibrary));
                    this.loadMediaLibrary();
                    this.showToast('Image uploaded!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    loadMediaLibrary() {
        const grid = document.getElementById('media-grid');
        if (!grid) return;

        if (this.mediaLibrary.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1;">No images in library. Upload some images to get started.</p>';
            return;
        }

        grid.innerHTML = this.mediaLibrary.map(img => `
            <div class="media-item" data-id="${img.id}">
                <img src="${img.url}" alt="${img.name}">
                <div class="media-item-overlay">
                    <button class="btn btn-sm btn-primary" onclick="adminPanel.copyImageUrl('${img.url}')">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteImage(${img.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    copyImageUrl(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('URL copied to clipboard!', 'success');
        });
    }

    deleteImage(id) {
        this.mediaLibrary = this.mediaLibrary.filter(img => img.id !== id);
        localStorage.setItem('mediaLibrary', JSON.stringify(this.mediaLibrary));
        this.loadMediaLibrary();
        this.showToast('Image deleted', 'success');
    }

    addExternalImage() {
        const url = document.getElementById('external-url')?.value;
        if (!url) {
            this.showToast('Please enter a URL', 'error');
            return;
        }

        const imageData = {
            id: Date.now(),
            name: url.split('/').pop(),
            url: url,
            type: 'external'
        };
        this.mediaLibrary.push(imageData);
        localStorage.setItem('mediaLibrary', JSON.stringify(this.mediaLibrary));
        document.getElementById('external-url').value = '';
        this.loadMediaLibrary();
        this.showToast('Image added!', 'success');
    }

    loadStockPhotos(category) {
        const container = document.getElementById('stock-photos');
        if (!container) return;

        // Update active button
        document.querySelectorAll('.stock-cat-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Using Unsplash source for demo purposes
        const photos = [];
        for (let i = 1; i <= 6; i++) {
            photos.push({
                url: `https://source.unsplash.com/400x300/?${category}&sig=${i}`,
                category: category
            });
        }

        container.innerHTML = photos.map(photo => `
            <div class="stock-photo-item">
                <img src="${photo.url}" alt="${photo.category}">
                <div class="stock-photo-overlay">
                    <button class="btn btn-sm btn-primary" onclick="adminPanel.addStockPhoto('${photo.url}')">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        `).join('');
    }

    addStockPhoto(url) {
        const imageData = {
            id: Date.now(),
            name: 'Stock Photo',
            url: url,
            type: 'stock'
        };
        this.mediaLibrary.push(imageData);
        localStorage.setItem('mediaLibrary', JSON.stringify(this.mediaLibrary));
        this.showToast('Stock photo added to library!', 'success');
    }

    // SEO Settings
    loadSEO() {
        document.getElementById('seo-title').value = this.seoSettings.title || '';
        document.getElementById('seo-description').value = this.seoSettings.description || '';
        document.getElementById('seo-keywords').value = this.seoSettings.keywords || '';
    }

    saveSEO() {
        this.seoSettings = {
            title: document.getElementById('seo-title')?.value || '',
            description: document.getElementById('seo-description')?.value || '',
            keywords: document.getElementById('seo-keywords')?.value || ''
        };
        localStorage.setItem('seoSettings', JSON.stringify(this.seoSettings));
        this.showToast('SEO settings saved!', 'success');
    }

    // Custom CSS
    loadCustomCSS() {
        document.getElementById('custom-css').value = this.customCSS;
    }

    saveCustomCSS() {
        this.customCSS = document.getElementById('custom-css')?.value || '';
        localStorage.setItem('customCSS', this.customCSS);
        this.showToast('Custom CSS saved!', 'success');
    }

    // Add New Items
    addNewSlide() {
        const newId = Math.max(...this.content.heroSlides.map(s => s.id), 0) + 1;
        const newSlide = {
            id: newId,
            badge: 'New Slide',
            badgeIcon: 'fas fa-star',
            title: 'Your ',
            titleHighlight: 'Amazing',
            titleEnd: ' Headline',
            description: 'Add a compelling description for this slide.',
            bgImage: 'https://source.unsplash.com/1920x1080/?technology',
            primaryBtn: { text: 'Learn More', link: '#contact', icon: 'fas fa-arrow-right' }
        };
        
        this.content.heroSlides.push(newSlide);
        window.contentManager.updateSection('heroSlides', this.content.heroSlides).then(() => {
            this.loadHeroSlides();
            this.editSlide(newId);
            this.showToast('New slide added!', 'success');
        });
    }

    deleteSlide() {
        const id = parseInt(document.getElementById('slide-id').value);
        if (this.content.heroSlides.length <= 1) {
            this.showToast('Cannot delete the last slide!', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to delete this slide?')) {
            this.content.heroSlides = this.content.heroSlides.filter(s => s.id !== id);
            window.contentManager.updateSection('heroSlides', this.content.heroSlides).then(() => {
                this.closeModal('slide-modal');
                this.loadHeroSlides();
                this.showToast('Slide deleted!', 'success');
            });
        }
    }

    addNewStat() {
        const newId = Math.max(...this.content.stats.map(s => s.id), 0) + 1;
        const newStat = {
            id: newId,
            value: '0+',
            label: 'New Stat',
            gradient: 'from-red-600 to-red-500'
        };
        
        this.content.stats.push(newStat);
        window.contentManager.updateSection('stats', this.content.stats).then(() => {
            this.loadStats();
            this.editStat(newId);
            this.showToast('New stat added!', 'success');
        });
    }

    deleteStat() {
        const id = parseInt(document.getElementById('stat-id').value);
        if (this.content.stats.length <= 1) {
            this.showToast('Cannot delete the last stat!', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to delete this stat?')) {
            this.content.stats = this.content.stats.filter(s => s.id !== id);
            window.contentManager.updateSection('stats', this.content.stats).then(() => {
                this.closeModal('stat-modal');
                this.loadStats();
                this.showToast('Stat deleted!', 'success');
            });
        }
    }

    addNewService() {
        const newId = Math.max(...this.content.services.map(s => s.id), 0) + 1;
        const newService = {
            id: newId,
            title: 'New Service',
            description: 'Describe your new service here.',
            icon: 'fas fa-star',
            colorClass: 'red',
            gradient: 'from-red-500 to-red-600'
        };
        
        this.content.services.push(newService);
        window.contentManager.updateSection('services', this.content.services).then(() => {
            this.loadServices();
            this.editService(newId);
            this.showToast('New service added!', 'success');
        });
    }

    deleteService() {
        const id = parseInt(document.getElementById('service-id').value);
        if (this.content.services.length <= 1) {
            this.showToast('Cannot delete the last service!', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to delete this service?')) {
            this.content.services = this.content.services.filter(s => s.id !== id);
            window.contentManager.updateSection('services', this.content.services).then(() => {
                this.closeModal('service-modal');
                this.loadServices();
                this.showToast('Service deleted!', 'success');
            });
        }
    }

    addWhyChooseUsItem() {
        if (!this.content.about.whyChooseUs) {
            this.content.about.whyChooseUs = [];
        }
        
        const newItem = {
            title: 'New Item',
            subtitle: 'Description here',
            gradient: 'from-green-500 to-green-600'
        };
        
        this.content.about.whyChooseUs.push(newItem);
        window.contentManager.updateSection('about', this.content.about).then(() => {
            this.loadAbout();
            this.editWhyChooseUs(this.content.about.whyChooseUs.length - 1);
            this.showToast('New item added!', 'success');
        });
    }

    deleteWhyChooseUsItem() {
        const index = parseInt(document.getElementById('whyChooseUs-index').value);
        if (this.content.about.whyChooseUs.length <= 1) {
            this.showToast('Cannot delete the last item!', 'error');
            return;
        }
        
        if (confirm('Are you sure you want to delete this item?')) {
            this.content.about.whyChooseUs.splice(index, 1);
            window.contentManager.updateSection('about', this.content.about).then(() => {
                this.closeModal('whyChooseUs-modal');
                this.loadAbout();
                this.showToast('Item deleted!', 'success');
            });
        }
    }

    // Save All Changes
    saveAllChanges() {
        this.showToast('All changes saved!', 'success');
    }

    // Hero Slides
    loadHeroSlides() {
        const container = document.getElementById('slides-container');
        if (!container) return;

        const slides = this.content.heroSlides || [];
        
        container.innerHTML = slides.map((slide, index) => `
            <div class="slide-card" data-slide-id="${slide.id}">
                <div class="slide-preview" style="background-image: url('${slide.bgImage}')">
                    <div class="slide-overlay">
                        <span class="slide-number">Slide ${index + 1}</span>
                    </div>
                </div>
                <div class="slide-content">
                    <h4 style="margin-bottom: 0.5rem; font-weight: 600;">${slide.title} ${slide.titleHighlight}</h4>
                    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem;">${slide.description.substring(0, 80)}...</p>
                    <div class="list-item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="adminPanel.editSlide(${slide.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    editSlide(id) {
        const slide = this.content.heroSlides.find(s => s.id === id);
        if (!slide) return;

        document.getElementById('slide-id').value = slide.id;
        document.getElementById('slide-badge').value = slide.badge;
        document.getElementById('slide-badgeIcon').value = slide.badgeIcon;
        document.getElementById('slide-title').value = slide.title;
        document.getElementById('slide-titleHighlight').value = slide.titleHighlight;
        document.getElementById('slide-titleEnd').value = slide.titleEnd || '';
        document.getElementById('slide-description').value = slide.description;
        document.getElementById('slide-bgImage').value = slide.bgImage;
        document.getElementById('slide-primaryBtnText').value = slide.primaryBtn?.text || '';
        document.getElementById('slide-primaryBtnLink').value = slide.primaryBtn?.link || '';

        this.openModal('slide-modal');
    }

    saveSlide() {
        const id = parseInt(document.getElementById('slide-id').value);
        const slideIndex = this.content.heroSlides.findIndex(s => s.id === id);
        
        if (slideIndex === -1) return;

        this.content.heroSlides[slideIndex] = {
            ...this.content.heroSlides[slideIndex],
            badge: document.getElementById('slide-badge').value,
            badgeIcon: document.getElementById('slide-badgeIcon').value,
            title: document.getElementById('slide-title').value,
            titleHighlight: document.getElementById('slide-titleHighlight').value,
            titleEnd: document.getElementById('slide-titleEnd').value,
            description: document.getElementById('slide-description').value,
            bgImage: document.getElementById('slide-bgImage').value,
            primaryBtn: {
                text: document.getElementById('slide-primaryBtnText').value,
                link: document.getElementById('slide-primaryBtnLink').value,
                icon: 'fas fa-arrow-right'
            }
        };

        window.contentManager.updateSection('heroSlides', this.content.heroSlides).then(() => {
            this.closeModal('slide-modal');
            this.loadHeroSlides();
            this.showToast('Slide updated successfully!', 'success');
        }).catch(() => {
            this.showToast('Error saving slide', 'error');
        });
    }

    // Stats
    loadStats() {
        const container = document.getElementById('stats-container');
        if (!container) return;

        const stats = this.content.stats || [];
        
        container.innerHTML = stats.map((stat, index) => `
            <div class="list-item">
                <div class="list-item-content">
                    <div class="list-item-title">${stat.value}</div>
                    <div class="list-item-subtitle">${stat.label}</div>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-icon btn-secondary" onclick="adminPanel.editStat(${stat.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    editStat(id) {
        const stat = this.content.stats.find(s => s.id === id);
        if (!stat) return;

        document.getElementById('stat-id').value = stat.id;
        document.getElementById('stat-value').value = stat.value;
        document.getElementById('stat-label').value = stat.label;
        document.getElementById('stat-gradient').value = stat.gradient || 'from-red-600 to-red-500';
        
        // Update preview
        this.updateStatPreview();

        this.openModal('stat-modal');
    }
    
    updateStatPreview() {
        const value = document.getElementById('stat-value')?.value || '30+';
        const gradient = document.getElementById('stat-gradient')?.value || 'from-red-600 to-red-500';
        const previewText = document.getElementById('stat-preview-text');
        if (previewText) {
            previewText.textContent = value;
            previewText.className = `bg-gradient-to-r ${gradient} bg-clip-text`;
            previewText.style.webkitBackgroundClip = 'text';
            previewText.style.webkitTextFillColor = 'transparent';
            previewText.style.backgroundClip = 'text';
        }
    }

    saveStat() {
        const id = parseInt(document.getElementById('stat-id').value);
        const statIndex = this.content.stats.findIndex(s => s.id === id);
        
        if (statIndex === -1) return;

        this.content.stats[statIndex] = {
            id: id,
            value: document.getElementById('stat-value').value,
            label: document.getElementById('stat-label').value,
            gradient: document.getElementById('stat-gradient').value
        };

        window.contentManager.updateSection('stats', this.content.stats).then(() => {
            this.closeModal('stat-modal');
            this.loadStats();
            this.showToast('Stat updated successfully!', 'success');
        }).catch(() => {
            this.showToast('Error saving stat', 'error');
        });
    }

    // Services
    loadServices() {
        const container = document.getElementById('services-container');
        if (!container) return;

        const services = this.content.services || [];
        
        container.innerHTML = services.map((service, index) => `
            <div class="service-admin-card">
                <div class="service-icon-preview" style="background: linear-gradient(135deg, var(--${service.colorClass === 'blue' ? 'secondary' : service.colorClass === 'purple' ? 'purple' : 'success'}), var(--${service.colorClass === 'blue' ? 'secondary' : service.colorClass === 'purple' ? 'purple' : 'success'}));">
                    <i class="${service.icon}" style="color: white;"></i>
                </div>
                <h4 style="font-weight: 600; margin-bottom: 0.5rem;">${service.title}</h4>
                <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem;">${service.description.substring(0, 100)}...</p>
                <button class="btn btn-sm btn-secondary" onclick="adminPanel.editService(${service.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        `).join('');
    }

    editService(id) {
        const service = this.content.services.find(s => s.id === id);
        if (!service) return;

        document.getElementById('service-id').value = service.id;
        document.getElementById('service-title').value = service.title;
        document.getElementById('service-description').value = service.description;
        document.getElementById('service-icon').value = service.icon;
        document.getElementById('service-colorClass').value = service.colorClass || 'blue';
        document.getElementById('service-gradient').value = service.gradient || '';

        this.openModal('service-modal');
    }

    saveService() {
        const id = parseInt(document.getElementById('service-id').value);
        const serviceIndex = this.content.services.findIndex(s => s.id === id);
        
        if (serviceIndex === -1) return;

        const colorClass = document.getElementById('service-colorClass').value;
        const customGradient = document.getElementById('service-gradient').value.trim();
        const gradientMap = {
            'blue': 'from-blue-500 to-cyan-500',
            'purple': 'from-purple-500 to-pink-500',
            'emerald': 'from-emerald-500 to-teal-500',
            'red': 'from-red-500 to-red-600',
            'green': 'from-green-500 to-green-600',
            'orange': 'from-orange-500 to-amber-500',
            'indigo': 'from-indigo-500 to-violet-500',
            'pink': 'from-pink-500 to-rose-500'
        };

        this.content.services[serviceIndex] = {
            id: id,
            title: document.getElementById('service-title').value,
            description: document.getElementById('service-description').value,
            icon: document.getElementById('service-icon').value,
            colorClass: colorClass,
            gradient: customGradient || gradientMap[colorClass] || gradientMap['blue']
        };

        window.contentManager.updateSection('services', this.content.services).then(() => {
            this.closeModal('service-modal');
            this.loadServices();
            this.showToast('Service updated successfully!', 'success');
        }).catch(() => {
            this.showToast('Error saving service', 'error');
        });
    }

    // About Section
    loadAbout() {
        const about = this.content.about;
        
        document.getElementById('about-badge').value = about.badge || '';
        document.getElementById('about-title').value = about.title || '';
        document.getElementById('about-titleHighlight').value = about.titleHighlight || '';
        document.getElementById('about-description1').value = about.description1 || '';
        document.getElementById('about-description2').value = about.description2 || '';

        // Load why choose us items
        const container = document.getElementById('whyChooseUs-container');
        if (container && about.whyChooseUs) {
            container.innerHTML = about.whyChooseUs.map((item, index) => `
                <div class="list-item">
                    <div class="list-item-content">
                        <div class="list-item-title">${item.title}</div>
                        <div class="list-item-subtitle">${item.subtitle}</div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn btn-icon btn-secondary" onclick="adminPanel.editWhyChooseUs(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    saveAbout() {
        this.content.about = {
            ...this.content.about,
            badge: document.getElementById('about-badge').value,
            title: document.getElementById('about-title').value,
            titleHighlight: document.getElementById('about-titleHighlight').value,
            description1: document.getElementById('about-description1').value,
            description2: document.getElementById('about-description2').value
        };

        window.contentManager.updateSection('about', this.content.about).then(() => {
            this.showToast('About section saved successfully!', 'success');
        }).catch(() => {
            this.showToast('Error saving about section', 'error');
        });
    }

    editWhyChooseUs(index) {
        const item = this.content.about.whyChooseUs[index];
        if (!item) return;

        document.getElementById('whyChooseUs-index').value = index;
        document.getElementById('whyChooseUs-title').value = item.title;
        document.getElementById('whyChooseUs-subtitle').value = item.subtitle;
        document.getElementById('whyChooseUs-gradient').value = item.gradient || 'from-green-500 to-green-600';

        this.openModal('whyChooseUs-modal');
    }

    saveWhyChooseUs() {
        const index = parseInt(document.getElementById('whyChooseUs-index').value);
        
        this.content.about.whyChooseUs[index] = {
            ...this.content.about.whyChooseUs[index],
            title: document.getElementById('whyChooseUs-title').value,
            subtitle: document.getElementById('whyChooseUs-subtitle').value,
            gradient: document.getElementById('whyChooseUs-gradient').value
        };

        window.contentManager.updateSection('about', this.content.about).then(() => {
            this.closeModal('whyChooseUs-modal');
            this.loadAbout();
            this.showToast('Updated successfully!', 'success');
        }).catch(() => {
            this.showToast('Error saving item', 'error');
        });
    }

    // Contact Section
    loadContact() {
        const contact = this.content.contact;
        
        document.getElementById('contact-badge').value = contact.badge || '';
        document.getElementById('contact-title').value = contact.title || '';
        document.getElementById('contact-subtitle').value = contact.subtitle || '';
        document.getElementById('contact-ctaTitle').value = contact.ctaTitle || '';
        document.getElementById('contact-ctaDescription').value = contact.ctaDescription || '';
    }

    saveContact() {
        this.content.contact = {
            badge: document.getElementById('contact-badge').value,
            title: document.getElementById('contact-title').value,
            subtitle: document.getElementById('contact-subtitle').value,
            ctaTitle: document.getElementById('contact-ctaTitle').value,
            ctaDescription: document.getElementById('contact-ctaDescription').value
        };

        window.contentManager.updateSection('contact', this.content.contact).then(() => {
            this.showToast('Contact section saved successfully!', 'success');
        }).catch(() => {
            this.showToast('Error saving contact section', 'error');
        });
    }

    // Footer Section
    loadFooter() {
        const footer = this.content.footer;
        const social = this.content.socialLinks;
        
        document.getElementById('footer-copyright').value = footer.copyright || '';
        document.getElementById('footer-designedBy').value = footer.designedBy || '';
        document.getElementById('footer-designerLink').value = footer.designerLink || '';
        
        document.getElementById('social-facebook').value = social.facebook || '';
        document.getElementById('social-twitter').value = social.twitter || '';
        document.getElementById('social-linkedin').value = social.linkedin || '';
        document.getElementById('social-whatsapp').value = social.whatsapp || '';
    }

    saveFooter() {
        this.content.footer = {
            copyright: document.getElementById('footer-copyright').value,
            designedBy: document.getElementById('footer-designedBy').value,
            designerLink: document.getElementById('footer-designerLink').value
        };

        this.content.socialLinks = {
            facebook: document.getElementById('social-facebook').value,
            twitter: document.getElementById('social-twitter').value,
            linkedin: document.getElementById('social-linkedin').value,
            whatsapp: document.getElementById('social-whatsapp').value
        };

        Promise.all([
            window.contentManager.updateSection('footer', this.content.footer),
            window.contentManager.updateSection('socialLinks', this.content.socialLinks)
        ]).then(() => {
            this.showToast('Footer saved successfully!', 'success');
        }).catch(() => {
            this.showToast('Error saving footer', 'error');
        });
    }

    // Settings
    loadSettings() {
        // Settings are loaded automatically
    }

    resetAllContent() {
        if (confirm('Are you sure you want to reset all content to default? This cannot be undone.')) {
            window.contentManager.resetToDefault().then((content) => {
                this.content = content;
                this.loadSectionData(this.currentSection);
                this.showToast('Content reset to default!', 'success');
            }).catch(() => {
                this.showToast('Error resetting content', 'error');
            });
        }
    }

    exportContent() {
        const data = window.contentManager.exportContent();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'site-content.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Content exported successfully!', 'success');
    }

    importContent() {
        document.getElementById('importInput').click();
    }

    handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const success = await window.contentManager.importContent(e.target.result);
            if (success) {
                this.content = window.contentManager.getContent();
                this.loadSectionData(this.currentSection);
                this.showToast('Content imported successfully!', 'success');
            } else {
                this.showToast('Failed to import content. Invalid format.', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    // Modal Management
    setupModals() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        });
    }

    openModal(id) {
        document.getElementById(id)?.classList.add('active');
    }

    closeModal(id) {
        document.getElementById(id)?.classList.remove('active');
    }

    // Save Handlers
    setupSaveHandlers() {
        // Forms with data-save attribute will trigger save functions
        document.querySelectorAll('[data-save]').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const saveMethod = form.dataset.save;
                if (this[saveMethod]) {
                    this[saveMethod]();
                }
            });
        });
    }

    // Toast Notifications
    showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    // Preview
    openPreview() {
        window.open('index.html', '_blank');
    }
}

// Initialize admin panel when DOM is ready
let adminPanel;
let adminInitialized = false;

function initAdminPanel() {
    if (adminInitialized) return;
    adminInitialized = true;
    adminPanel = new AdminPanel();
    console.log('Admin panel initialized');
}

document.addEventListener('DOMContentLoaded', () => {
    // Wait for content to load from API before initializing admin panel
    window.addEventListener('contentLoaded', () => {
        console.log('Content loaded event received');
        initAdminPanel();
    });
    
    // Fallback: Initialize after delay if content manager is available
    setTimeout(() => {
        if (window.contentManager && window.contentManager.getContent() && !adminInitialized) {
            console.log('Initializing admin panel via fallback');
            initAdminPanel();
        }
    }, 1500);
});
