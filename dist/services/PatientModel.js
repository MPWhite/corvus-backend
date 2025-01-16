"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const surgeryRequirementSchema = new mongoose_1.default.Schema({
    name: String,
    value: mongoose_1.default.Schema.Types.Mixed,
    required: mongoose_1.default.Schema.Types.Mixed,
    met: Boolean
});
const documentSchema = new mongoose_1.default.Schema({
    type: String,
    received: Boolean,
    url: String,
    dateReceived: Date
});
const noteSchema = new mongoose_1.default.Schema({
    id: String,
    content: String,
    author: String,
    timestamp: Date,
    type: {
        type: String,
        enum: ['general', 'surgical', 'medical', 'requirement']
    }
});
const patientSchema = new mongoose_1.default.Schema({
    name: String,
    age: Number,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    bmi: Number,
    reason: String,
    needsReview: Boolean,
    isCandidate: Boolean,
    assignedTo: String,
    referringProvider: String,
    referralNotes: String,
    surgeryType: String,
    surgeryRequirements: [surgeryRequirementSchema],
    medicalHistory: [String],
    medications: [String],
    requiredDocuments: [documentSchema],
    lastUpdated: Date,
    notes: [noteSchema],
    consultDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true,
        default: 'medium'
    },
    priorityScore: {
        type: Number,
        min: 1,
        max: 100,
        required: true,
        default: 50
    },
    ehrId: {
        type: String,
        required: true,
        default: () => Math.random().toString(36).substr(2, 9) // Generate a random ID
    },
    referralType: {
        type: String,
        enum: ['self', 'external', 'internal'],
        required: true,
        default: 'external'
    }
});
// Add a method to calculate priority score
patientSchema.methods.calculatePriorityScore = function () {
    // Base urgency scores (max 100)
    const urgencyScores = {
        'critical': 100,
        'high': 75,
        'medium': 50,
        'low': 25
    };
    // Referral type bonus (max 20)
    const referralScores = {
        'internal': 20,
        'external': 10,
        'self': 5
    };
    // Calculate base score from urgency (40% weight)
    const urgencyScore = urgencyScores[this.urgencyLevel] || 50;
    // Calculate waiting time score (30% weight)
    const daysWaiting = Math.floor((Date.now() - new Date(this.consultDate).getTime()) / (1000 * 60 * 60 * 24));
    const waitingScore = Math.min(daysWaiting * 2, 100); // 2 points per day, max 100
    // Calculate document readiness score (15% weight)
    const documentsReceived = this.requiredDocuments.filter(doc => doc.received).length;
    const totalDocuments = this.requiredDocuments.length;
    const documentScore = (documentsReceived / totalDocuments) * 100;
    // Calculate requirements score (15% weight)
    const requirementsMet = this.surgeryRequirements.filter(req => req.met).length;
    const totalRequirements = this.surgeryRequirements.length;
    const requirementsScore = (requirementsMet / totalRequirements) * 100;
    // Calculate final weighted score
    const finalScore = Math.round((urgencyScore * 0.4) +
        (waitingScore * 0.3) +
        (documentScore * 0.15) +
        (requirementsScore * 0.15) +
        (referralScores[this.referralType] || 0));
    // Ensure score is between 1 and 100
    this.priorityScore = Math.min(Math.max(finalScore, 1), 100);
    return this.priorityScore;
};
// Automatically calculate priority score before saving
patientSchema.pre('save', function (next) {
    this.calculatePriorityScore();
    next();
});
const PatientModel = mongoose_1.default.model('Patient', patientSchema);
exports.default = PatientModel;
