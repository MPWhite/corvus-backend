import express from 'express';
import dotenv from 'dotenv';
import connectDB from './services/mongoDB';
import PatientModel from './services/PatientModel';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4001;
// Connect to MongoDB
connectDB();
// Middleware
app.use(express.json());
// GET Endpoint to Fetch All Patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await PatientModel.find();
        res.status(200).json(patients);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch patients' });
    }
});
// Start the Server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
