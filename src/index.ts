import express from 'express';
import cors from 'cors';
import connectDB from './services/mongoDB';
import PatientModel from './services/PatientModel';

const app = express();
const PORT = process.env.PORT || 4001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await PatientModel.find();
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/patients/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const patient = await PatientModel.findByIdAndUpdate(
            id,
            { needsReview: status === 'needs-review' },
            { new: true }
        );
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        res.json(patient);
    } catch (error) {
        console.error('Error updating patient status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

startServer();
