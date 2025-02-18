import connectDB from './mongoDB';
import PatientModel, { IPatient } from './PatientModel';
import DataSyncModel from './DataSyncModel';
import { generateMockPatients } from '../utils/mockDataGenerator';
import { generateMockDataSyncs } from '../utils/mockDataSyncGenerator';

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Only clear data syncs
        await DataSyncModel.deleteMany({});
        console.log('Cleared existing data syncs');

        // Get existing patients or create new ones if none exist
        let patients = await PatientModel.find();
        if (patients.length === 0) {
            const mockPatients = generateMockPatients(20);
            const patientsToInsert = mockPatients.map(patient => ({
                ...patient,
                _id: undefined // Let MongoDB generate the _id
            }));
            patients = await PatientModel.create(patientsToInsert);
            console.log(`Created ${patients.length} new patients`);
        }
        
        // Generate and save data syncs for each patient
        const allDataSyncs = patients.flatMap(patient => 
            generateMockDataSyncs(patient._id.toString(), patient)
        );
        await DataSyncModel.insertMany(allDataSyncs);
        console.log(`Created ${allDataSyncs.length} data syncs`);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
