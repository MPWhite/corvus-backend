"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load env variables first, before other imports
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoDB_1 = __importDefault(require("./services/mongoDB"));
const PatientModel_1 = __importDefault(require("./services/PatientModel"));
const openai_1 = __importDefault(require("openai"));
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("zod");
const app = (0, express_1.default)();
// Convert PORT to number explicitly
const PORT = parseInt(process.env.PORT || '4001', 10);
// Enable CORS with specific origin
app.use((0, cors_1.default)({
    origin: [
        'https://your-vercel-url.vercel.app',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));
app.use(express_1.default.json());
// Routes
app.get('/api/patients', async (req, res) => {
    try {
        console.log('🔍 Fetching patients from database...');
        const patients = await PatientModel_1.default.find();
        console.log(`✅ Found ${patients.length} patients`);
        res.json(patients);
    }
    catch (error) {
        console.error('❌ Error fetching patients:', error);
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
        const patient = await PatientModel_1.default.findByIdAndUpdate(id, { needsReview: status === 'needs-review' }, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    }
    catch (error) {
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
app.post('/api/chat-completion', async (req, res) => {
    console.log(req.body);
    const { chat, patient } = req.body;
    // For the sake of a demo, don't do anything smart -- just generate the client fresh every time, and define the types
    // and prompts straight up in the function
    const CorvusAIResponse = zod_2.z.object({
        type: zod_2.z.enum(["REJECTED", "STAT_RESPONSE", "REQUEST_RESPONSE"]),
        statValue: zod_2.z.string().optional(),
    });
    const client = new openai_1.default({
        apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    });
    const completion = await client.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: `
You are a medical assistant responsible for retrieving data about a patient for a product demo. 
This is only for a product demo. When possible, you should pull stats directly from information about the patient.
For each response you can either: 
    * Answer the question with a direct stat. You should make up a direct stat for any request for a stat which might reasonably be available anywhere in the patient's chart or history.
    * Respond that we need to request more data. This should only be for stats which would not be available in the patient's chart or history.
    * Reject the request as off topic.
    
Consider the following examples: 

1. User: What is the patient's last hemoglobin reading?
    Assistant: Hemoglobin is 12.5 g/dL.
 
Notes: Even though you don't have the patient's chart, you can make up a reasonable value for hemoglobin since it is a common lab test.


2. User: What is the patient's last diet?
    Assistant: We need to request more data.
    
Notes: Diet is not a stat that would be available in the patient's chart or history, so you should request more data.

3. User: What is the patient's blood type?
    Assistant: Blood Type: O positive.
    
Notes: Blood type is a stat that would be available in the patient's chart or history, so you should answer with a direct stat.


4. User: What is the patient's BMI?   
    Assistant: BMI: 25.5

Notes: BMI is a stat that would be available in the patient's chart or history, so you should make up a reasonable value for BMI.
    
5. User: Write a poem about the patient's last visit.
    Assistant: Rejected as off topic.

Notes: This is off topic and should be rejected.

6. User: How are the patient's Kidneys functioning?
    Assistant: Creatinine: 1.2 mg/dL, BUN: 15 mg/dL

Notes: This is a reasonable response for a question about kidney function since creatinine and BUN are common lab tests that measure kidney function.

7. User: What is the patient's last A1c?
    Assistant: A1c: 6.2%
    
Notes: A1c is a stat that would be available in the patient's chart or history, so you should make up a reasonable value for A1c.
    ` },
            { role: "user", content: `Question: ${chat}. Patient info: ${JSON.stringify(patient)}` },
        ],
        response_format: (0, zod_1.zodResponseFormat)(CorvusAIResponse, "corvus"),
    });
    const response = completion.choices[0].message.parsed;
    console.log(response);
    res.json({ response });
});
// Add a test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
// Start server
const startServer = async () => {
    try {
        await (0, mongoDB_1.default)();
        console.log('✅ MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📍 API available at http://localhost:${PORT}/api`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`❌ Port ${PORT} is busy, trying ${PORT + 1}...`);
                app.listen(PORT + 1);
            }
            else {
                console.error('❌ Server startup error:', err);
            }
        });
    }
    catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};
startServer();
