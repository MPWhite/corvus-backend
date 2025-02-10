import mongoose, { Document, Schema } from 'mongoose';
import { IPatient } from '../services/PatientModel';

const patientSchema = new Schema({
    name: String,
    age: Number,
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    bmi: Number,
    reason: String,
    needsReview: Boolean,
    isCandidate: Boolean,
    assignedTo: String,
    referringProvider: String,
    referralNotes: String,
    surgeryType: String,
    surgeryRequirements: [{
        name: String,
        value: Schema.Types.Mixed,
        required: Schema.Types.Mixed,
        met: Boolean
    }],
    medicalHistory: [String],
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        prescribedBy: String
    }],
    requiredDocuments: [{
        type: String,
        received: Boolean,
        url: String,
        dateReceived: Date
    }],
    lastUpdated: Date,
    notes: [{
        content: String,
        author: String,
        timestamp: Date,
        type: {
            type: String,
            enum: ['general', 'surgical', 'medical', 'requirement']
        }
    }]
});

export const Patient = mongoose.model<IPatient>('Patient', patientSchema); 