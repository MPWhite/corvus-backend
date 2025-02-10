"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Schema Definitions
const surgeryRequirementSchema = new mongoose_1.default.Schema({
    name: String,
    value: mongoose_1.default.Schema.Types.Mixed,
    required: mongoose_1.default.Schema.Types.Mixed,
    met: Boolean,
    description: String,
    critical: Boolean
});
const documentSchema = new mongoose_1.default.Schema({
    type: String,
    received: Boolean,
    url: String,
    dateReceived: Date,
    status: {
        type: String,
        enum: ['pending', 'received', 'expired']
    },
    requestedDate: Date
});
const medicationSchema = new mongoose_1.default.Schema({
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    prescribedBy: String
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
const labResultSchema = new mongoose_1.default.Schema({
    testName: String,
    date: Date,
    result: String,
    unit: String,
    isAbnormal: Boolean
});
const surgicalHistorySchema = new mongoose_1.default.Schema({
    procedure: String,
    date: Date,
    surgeon: String,
    facility: String,
    complications: String
});
const requiredActionSchema = new mongoose_1.default.Schema({
    id: String,
    type: String,
    description: String,
    dueDate: Date,
    assignedTo: String,
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
});
// Main Patient Schema
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
    medications: [{
            name: String,
            dosage: String,
            frequency: String,
            startDate: Date,
            prescribedBy: String
        }],
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
        default: 'medium'
    },
    priorityScore: {
        type: Number,
        min: 1,
        max: 100,
        default: 50
    },
    ehrId: {
        type: String,
        default: () => Math.random().toString(36).substr(2, 9)
    },
    referralType: {
        type: String,
        enum: ['self', 'external', 'internal'],
        default: 'external'
    },
    reviewStatus: {
        type: String,
        enum: ['PENDING_MA_REVIEW', 'READY_FOR_SURGEON', 'NEEDS_MORE_INFO', 'SURGEON_APPROVED', 'SCHEDULED', 'REJECTED'],
        default: 'PENDING_MA_REVIEW'
    },
    referralDate: Date,
    scheduledDate: Date,
    reviewedAt: Date,
    reviewNotes: [noteSchema],
    requiredActions: [requiredActionSchema],
    surgicalHistory: [{
            procedure: String,
            date: Date,
            surgeon: String,
            facility: String,
            complications: String
        }],
    labResults: [{
            testName: String,
            date: Date,
            result: String,
            unit: String,
            isAbnormal: Boolean
        }]
});
// Priority Score Calculation
patientSchema.methods.calculatePriorityScore = function () {
    const urgencyScores = {
        'critical': 100,
        'high': 75,
        'medium': 50,
        'low': 25
    };
    const referralScores = {
        'internal': 20,
        'external': 10,
        'self': 5
    };
    const urgencyScore = urgencyScores[this.urgencyLevel] || 50;
    const daysWaiting = Math.floor((Date.now() - new Date(this.consultDate).getTime()) / (1000 * 60 * 60 * 24));
    const waitingScore = Math.min(daysWaiting * 2, 100);
    const documentsReceived = this.requiredDocuments.filter(doc => doc.received).length;
    const totalDocuments = this.requiredDocuments.length;
    const documentScore = totalDocuments > 0 ? (documentsReceived / totalDocuments) * 100 : 0;
    const requirementsMet = this.surgeryRequirements.filter(req => req.met).length;
    const totalRequirements = this.surgeryRequirements.length;
    const requirementsScore = totalRequirements > 0 ? (requirementsMet / totalRequirements) * 100 : 0;
    const finalScore = Math.round((urgencyScore * 0.4) +
        (waitingScore * 0.3) +
        (documentScore * 0.15) +
        (requirementsScore * 0.15) +
        (referralScores[this.referralType] || 0));
    this.priorityScore = Math.min(Math.max(finalScore, 1), 100);
    return this.priorityScore;
};
patientSchema.pre('save', function (next) {
    this.calculatePriorityScore();
    next();
});
const PatientModel = mongoose_1.default.model('Patient', patientSchema);
exports.default = PatientModel;
