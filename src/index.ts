import express from 'express';
import cors from 'cors';
import connectDB from './services/mongoDB';
import PatientModel from './services/PatientModel';

const app = express();
const PORT = process.env.PORT || 4001;

// Enable CORS with specific origin
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Routes
app.get('/api/patients', async (req, res) => {
    try {
        console.log('Fetching patients from database...');
        const patients = await PatientModel.find();
        console.log(`Found ${patients.length} patients`);
        res.json(patients);
    } catch (error: any) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error?.message || 'Unknown error'
        });
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
    } catch (error: any) {
        console.error('Error updating patient status:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error?.message || 'Unknown error'
        });
    }
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Add a test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        console.log('✅ MongoDB connected successfully');
        
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📍 API available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

startServer();
