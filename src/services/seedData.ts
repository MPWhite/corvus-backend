import connectDB from './mongoDB';
import PatientModel from './PatientModel';
import { generateMockPatients } from '../utils/mockDataGenerator';

const seedPatients = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        
        // Clear existing patients
        await PatientModel.deleteMany({});
        console.log('Cleared existing patients');
        
        const patients = generateMockPatients(20);
        console.log('Generated mock patients:', patients.length);
        
        // Insert patients one by one and log each
        for (const patient of patients) {
            const patientDoc = new PatientModel(patient);
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
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedPatients();
