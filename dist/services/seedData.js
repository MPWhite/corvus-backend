import connectDB from './mongoDB.js';
import PatientModel from './PatientModel.js';
const surgeryTypes = ['Knee Replacement', 'Hip Surgery', 'Shoulder Repair', 'Spinal Fusion'];
const referringProviders = ['Dr. Allen', 'Dr. Brown', 'Dr. Patel', 'Dr. Chen'];
const assignedTo = ['Dr. Smith', 'Dr. Johnson', 'Dr. White'];
const medicalConditions = ['Hypertension', 'Diabetes', 'Osteoarthritis', 'COPD'];
const medications = ['Lisinopril', 'Metformin', 'Ibuprofen', 'Atorvastatin'];
const generateRequirements = () => {
    const bmi = Math.floor(Math.random() * 10) + 25;
    const a1c = (Math.random() * 2 + 6).toFixed(1);
    return [
        {
            name: "BMI",
            value: bmi,
            required: "< 30",
            met: bmi < 30
        },
        {
            name: "A1C",
            value: parseFloat(a1c),
            required: "< 7.0",
            met: parseFloat(a1c) < 7.0
        },
        {
            name: "Smoking Status",
            value: Math.random() > 0.3 ? "Non-smoker" : "Smoker",
            required: "Non-smoker",
            met: Math.random() > 0.3
        },
        {
            name: "Cardiac Clearance",
            value: Math.random() > 0.2,
            required: true,
            met: Math.random() > 0.2
        }
    ];
};
const generateDocuments = () => [
    {
        type: "MRI Report",
        received: Math.random() > 0.5,
        url: Math.random() > 0.5 ? "https://example.com/mri-report.pdf" : undefined,
        dateReceived: Math.random() > 0.5 ? new Date() : undefined
    },
    {
        type: "X-Ray",
        received: Math.random() > 0.5,
        url: Math.random() > 0.5 ? "https://example.com/xray.pdf" : undefined,
        dateReceived: Math.random() > 0.5 ? new Date() : undefined
    },
    {
        type: "Blood Work",
        received: Math.random() > 0.5,
        url: Math.random() > 0.5 ? "https://example.com/bloodwork.pdf" : undefined,
        dateReceived: Math.random() > 0.5 ? new Date() : undefined
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
const generatePatients = () => {
    const patients = [];
    for (let i = 1; i <= 50; i++) {
        const surgeryType = surgeryTypes[i % surgeryTypes.length];
        const provider = assignedTo[i % assignedTo.length];
        const requirements = generateRequirements();
        const isCandidate = requirements.every(req => req.met);
        patients.push({
            name: `Patient ${i}`,
            age: Math.floor(Math.random() * 60) + 20,
            gender: Math.random() > 0.5 ? 'male' : 'female',
            bmi: Math.floor(Math.random() * 10) + 20,
            reason: `Consultation for ${surgeryType}`,
            needsReview: Math.random() > 0.5,
            isCandidate,
            assignedTo: provider,
            referringProvider: referringProviders[i % referringProviders.length],
            referralNotes: `Patient referred for ${surgeryType} evaluation.`,
            surgeryType,
            surgeryRequirements: requirements,
            medicalHistory: medicalConditions.slice(0, Math.floor(Math.random() * 3) + 1),
            medications: medications.slice(0, Math.floor(Math.random() * 3) + 1),
            requiredDocuments: generateDocuments(),
            lastUpdated: new Date(),
            notes: generateNotes(surgeryType, provider)
        });
    }
    return patients;
};
const seedPatients = async () => {
    await connectDB();
    const patients = generatePatients();
    try {
        await PatientModel.deleteMany({});
        await PatientModel.insertMany(patients);
        console.log('✅ Seeded 50 patients successfully!');
        process.exit();
    }
    catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};
seedPatients();
