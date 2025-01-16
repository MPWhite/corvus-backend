"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoDB_1 = __importDefault(require("./mongoDB"));
const PatientModel_1 = __importDefault(require("./PatientModel"));
const surgeryTypes = ['Knee Replacement', 'Hip Surgery', 'Shoulder Repair', 'Spinal Fusion'];
const referringProviders = ['Dr. Allen', 'Dr. Brown', 'Dr. Patel', 'Dr. Chen'];
const assignedTo = ['Dr. Smith', 'Dr. Johnson', 'Dr. White'];
const medicalConditions = ['Hypertension', 'Diabetes', 'Osteoarthritis', 'COPD'];
const medications = ['Lisinopril', 'Metformin', 'Ibuprofen', 'Atorvastatin'];
const referralTypes = ['self', 'external', 'internal'];
const generateRequirements = (status) => {
    // For scheduled patients, all requirements are met
    if (status === 'scheduled') {
        return [
            {
                name: "BMI",
                value: 28,
                required: "< 30",
                met: true
            },
            {
                name: "A1C",
                value: 6.5,
                required: "< 7.0",
                met: true
            },
            {
                name: "Smoking Status",
                value: "Non-smoker",
                required: "Non-smoker",
                met: true
            },
            {
                name: "Cardiac Clearance",
                value: true,
                required: true,
                met: true
            }
        ];
    }
    // For rejected patients, at least one requirement is not met
    if (status === 'rejected') {
        return [
            {
                name: "BMI",
                value: 32,
                required: "< 30",
                met: false
            },
            {
                name: "A1C",
                value: 7.5,
                required: "< 7.0",
                met: false
            },
            {
                name: "Smoking Status",
                value: "Smoker",
                required: "Non-smoker",
                met: false
            },
            {
                name: "Cardiac Clearance",
                value: false,
                required: true,
                met: false
            }
        ];
    }
    // For needs-review patients, all requirements are met (they're eligible)
    return [
        {
            name: "BMI",
            value: 27,
            required: "< 30",
            met: true
        },
        {
            name: "A1C",
            value: 6.8,
            required: "< 7.0",
            met: true
        },
        {
            name: "Smoking Status",
            value: "Non-smoker",
            required: "Non-smoker",
            met: true
        },
        {
            name: "Cardiac Clearance",
            value: true,
            required: true,
            met: true
        }
    ];
};
const generateDocuments = (isReviewed) => [
    {
        type: "MRI Report",
        received: isReviewed ? true : Math.random() > 0.5,
        url: isReviewed ? "https://example.com/mri-report.pdf" : (Math.random() > 0.5 ? "https://example.com/mri-report.pdf" : undefined),
        dateReceived: isReviewed ? new Date() : (Math.random() > 0.5 ? new Date() : undefined)
    },
    {
        type: "X-Ray",
        received: isReviewed ? true : Math.random() > 0.5,
        url: isReviewed ? "https://example.com/xray.pdf" : (Math.random() > 0.5 ? "https://example.com/xray.pdf" : undefined),
        dateReceived: isReviewed ? new Date() : (Math.random() > 0.5 ? new Date() : undefined)
    },
    {
        type: "Blood Work",
        received: isReviewed ? true : Math.random() > 0.5,
        url: isReviewed ? "https://example.com/bloodwork.pdf" : (Math.random() > 0.5 ? "https://example.com/bloodwork.pdf" : undefined),
        dateReceived: isReviewed ? new Date() : (Math.random() > 0.5 ? new Date() : undefined)
    }
];
const generateNotes = (surgeryType, provider) => {
    const notes = [];
    const noteTypes = ['general', 'surgical', 'medical', 'requirement'];
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
        notes.push({
            id: `note_${i}`,
            content: `Patient evaluation for ${surgeryType}. Follow-up required.`,
            author: provider,
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            type: noteTypes[Math.floor(Math.random() * noteTypes.length)]
        });
    }
    return notes;
};
const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
const generatePatients = () => {
    const patients = [];
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(today.getMonth() + 6);
    for (let i = 0; i < 50; i++) {
        // Distribute patients: 40% needs review, 40% scheduled, 20% rejected
        const roll = Math.random();
        const status = roll > 0.6 ? 'needs-review' :
            roll > 0.2 ? 'scheduled' :
                'rejected';
        const needsReview = status === 'needs-review';
        const isRejected = status === 'rejected';
        // Generate dates
        const consultDate = generateRandomDate(threeMonthsAgo, today);
        let reviewedAt = undefined;
        let scheduledDate = undefined;
        if (!needsReview) {
            // If reviewed, set reviewedAt to a date after consultDate but before today
            reviewedAt = generateRandomDate(consultDate, today);
            if (!isRejected) {
                // If scheduled, set scheduledDate to a date in the next 6 months
                const twoWeeksFromNow = new Date(today);
                twoWeeksFromNow.setDate(today.getDate() + 14);
                scheduledDate = generateRandomDate(twoWeeksFromNow, sixMonthsFromNow);
            }
        }
        // Weight urgency levels
        const urgencyRoll = Math.random();
        const urgencyLevel = urgencyRoll > 0.9 ? 'critical' :
            urgencyRoll > 0.7 ? 'high' :
                urgencyRoll > 0.4 ? 'medium' :
                    'low';
        // More explicit referral type distribution
        const referralRoll = Math.random();
        const referralType = referralRoll > 0.7 ? 'internal' :
            referralRoll > 0.3 ? 'external' :
                'self';
        const patient = {
            name: `Patient ${i}`,
            age: Math.floor(Math.random() * 60) + 20,
            gender: Math.random() > 0.5 ? 'male' : 'female',
            bmi: Math.floor(Math.random() * 10) + 20,
            reason: `Consultation for ${surgeryTypes[i % surgeryTypes.length]}`,
            needsReview,
            isCandidate: !isRejected,
            assignedTo: assignedTo[i % assignedTo.length],
            referringProvider: referringProviders[i % referringProviders.length],
            referralNotes: `Patient referred for ${surgeryTypes[i % surgeryTypes.length]} evaluation.`,
            surgeryType: surgeryTypes[i % surgeryTypes.length],
            surgeryRequirements: generateRequirements(status),
            medicalHistory: medicalConditions.slice(0, Math.floor(Math.random() * 3) + 1),
            medications: medications.slice(0, Math.floor(Math.random() * 3) + 1),
            requiredDocuments: generateDocuments(!needsReview),
            lastUpdated: new Date(),
            notes: generateNotes(surgeryTypes[i % surgeryTypes.length], assignedTo[i % assignedTo.length]),
            consultDate,
            reviewedAt,
            scheduledDate,
            urgencyLevel,
            ehrId: `EHR${String(i + 1).padStart(6, '0')}`,
            referralType,
        };
        patients.push(patient);
    }
    return patients;
};
const seedPatients = async () => {
    await (0, mongoDB_1.default)();
    const patients = generatePatients();
    try {
        await PatientModel_1.default.deleteMany({});
        // Insert patients one by one to ensure hooks run
        for (const patient of patients) {
            const patientDoc = new PatientModel_1.default(patient);
            await patientDoc.save();
        }
        console.log('✅ Seeded 50 patients successfully!');
        process.exit();
    }
    catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};
seedPatients();
