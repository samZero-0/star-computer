const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');
const defaultContent = require('../data/defaultContent');

// @route   GET /api/content
// @desc    Get all site content
// @access  Public
router.get('/', async (req, res) => {
    try {
        let content = await SiteContent.findOne();
        
        // If no content exists, create with default data
        if (!content) {
            content = await SiteContent.create(defaultContent);
            console.log('Default content created in database');
        }
        
        res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/content
// @desc    Update all site content
// @access  Public (should be protected in production)
router.put('/', async (req, res) => {
    try {
        let content = await SiteContent.findOne();
        
        if (content) {
            // Update existing content
            content = await SiteContent.findByIdAndUpdate(
                content._id,
                req.body,
                { new: true, runValidators: true }
            );
        } else {
            // Create new content
            content = await SiteContent.create(req.body);
        }
        
        res.json(content);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/content/:section
// @desc    Update a specific section of site content
// @access  Public (should be protected in production)
router.put('/:section', async (req, res) => {
    try {
        const { section } = req.params;
        const validSections = ['company', 'heroSlides', 'stats', 'services', 'about', 'contact', 'socialLinks', 'footer'];
        
        if (!validSections.includes(section)) {
            return res.status(400).json({ message: 'Invalid section name' });
        }
        
        let content = await SiteContent.findOne();
        
        if (!content) {
            // Create with default content first
            content = await SiteContent.create(defaultContent);
        }
        
        // Update the specific section
        content[section] = req.body;
        await content.save();
        
        res.json({ message: `${section} updated successfully`, data: content[section] });
    } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/content/reset
// @desc    Reset content to default
// @access  Public (should be protected in production)
router.post('/reset', async (req, res) => {
    try {
        // Delete existing content
        await SiteContent.deleteMany({});
        
        // Create with default content
        const content = await SiteContent.create(defaultContent);
        
        res.json({ message: 'Content reset to default', data: content });
    } catch (error) {
        console.error('Error resetting content:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/content/import
// @desc    Import content from JSON
// @access  Public (should be protected in production)
router.post('/import', async (req, res) => {
    try {
        // Delete existing content
        await SiteContent.deleteMany({});
        
        // Create with imported content
        const content = await SiteContent.create(req.body);
        
        res.json({ message: 'Content imported successfully', data: content });
    } catch (error) {
        console.error('Error importing content:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
