"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoDB_1 = __importDefault(require("./mongoDB"));
const PatientModel_1 = __importDefault(require("./PatientModel"));
const mockDataGenerator_1 = require("../utils/mockDataGenerator");
const seedPatients = async () => {
    try {
        await (0, mongoDB_1.default)();
        console.log('Connected to MongoDB');
        // Clear existing patients
        await PatientModel_1.default.deleteMany({});
        console.log('Cleared existing patients');
        const patients = (0, mockDataGenerator_1.generateMockPatients)(20);
        console.log('Generated mock patients:', patients.length);
        // Insert patients one by one and log each
        for (const patient of patients) {
            const patientDoc = new PatientModel_1.default(patient);
            await patientDoc.save();
            console.log('Saved patient:', {
                id: patientDoc._id,
                name: patientDoc.name,
                medicalHistory: patientDoc.medicalHistory?.length || 0,
                medications: patientDoc.medications?.length || 0,
                labResults: patientDoc.labResults?.length || 0
            });
        }
        console.log('✅ Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};
seedPatients();
