import mongoose from 'mongoose';

const surgeryRequirementSchema = new mongoose.Schema({
    name: String,
    value: mongoose.Schema.Types.Mixed,
    required: mongoose.Schema.Types.Mixed,
    met: Boolean
});

const documentSchema = new mongoose.Schema({
    type: String,
    received: Boolean,
    url: String,
    dateReceived: Date
});

const noteSchema = new mongoose.Schema({
    id: String,
    content: String,
    author: String,
    timestamp: Date,
    type: {
        type: String,
        enum: ['general', 'surgical', 'medical', 'requirement']
    }
});

const patientSchema = new mongoose.Schema({
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
    notes: [noteSchema]
});

export default mongoose.model('Patient', patientSchema);
