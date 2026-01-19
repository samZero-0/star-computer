const mongoose = require('mongoose');

// Sub-schemas for nested objects
const ButtonSchema = new mongoose.Schema({
    text: String,
    link: String,
    icon: String
}, { _id: false });

const HeroSlideSchema = new mongoose.Schema({
    id: Number,
    badge: String,
    badgeIcon: String,
    title: String,
    titleHighlight: String,
    titleEnd: String,
    description: String,
    primaryBtn: ButtonSchema,
    secondaryBtn: ButtonSchema,
    gradient: String,
    bgImage: String
}, { _id: false });

const StatSchema = new mongoose.Schema({
    id: Number,
    value: String,
    label: String,
    gradient: String
}, { _id: false });

const AwardSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    icon: String,
    image: String,
    iconGradient: String,
    bgGradient: String,
    borderColor: String
}, { _id: false });

const ClientSchema = new mongoose.Schema({
    id: Number,
    name: String,
    industry: String,
    icon: String,
    image: String,
    colorClass: String,
    gradient: String
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    icon: String,
    colorClass: String,
    gradient: String
}, { _id: false });

const WhyChooseUsItemSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    gradient: String
}, { _id: false });

const CompanySchema = new mongoose.Schema({
    name: String,
    tagline: String,
    description: String,
    phone: String,
    email: String,
    officeAddress: String,
    registeredAddress: String
}, { _id: false });

const AboutSchema = new mongoose.Schema({
    badge: String,
    title: String,
    titleHighlight: String,
    description1: String,
    description2: String,
    whyChooseUs: [WhyChooseUsItemSchema]
}, { _id: false });

const ContactSchema = new mongoose.Schema({
    badge: String,
    title: String,
    subtitle: String,
    ctaTitle: String,
    ctaDescription: String
}, { _id: false });

const SocialLinksSchema = new mongoose.Schema({
    facebook: String,
    twitter: String,
    linkedin: String,
    whatsapp: String
}, { _id: false });

const FooterSchema = new mongoose.Schema({
    copyright: String,
    designedBy: String,
    designerLink: String
}, { _id: false });

// Main Site Content Schema
const SiteContentSchema = new mongoose.Schema({
    company: CompanySchema,
    heroSlides: [HeroSlideSchema],
    stats: [StatSchema],
    awards: [AwardSchema],
    clients: [ClientSchema],
    services: [ServiceSchema],
    about: AboutSchema,
    contact: ContactSchema,
    socialLinks: SocialLinksSchema,
    footer: FooterSchema
}, {
    timestamps: true,
    collection: 'sitecontent'
});

module.exports = mongoose.model('SiteContent', SiteContentSchema);
