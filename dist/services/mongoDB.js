"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Debug environment loading
console.log('🔍 Current working directory:', process.cwd());
console.log('📁 Looking for .env file...');
// Try to load .env file
dotenv_1.default.config();
const connectDB = async () => {
    try {
        // Debug environment variables
        console.log('🔑 Available environment variables:', {
            MONGO_URI_exists: !!process.env.MONGO_URI,
            NODE_ENV: process.env.NODE_ENV,
            PWD: process.cwd()
        });
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        // Try to use non-SRV connection if SRV fails
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            retryWrites: true,
            w: "majority",
            dns: {
                servers: ['8.8.8.8', '8.8.4.4'] // Use Google's DNS servers
            }
        };
        try {
            console.log('🔄 Attempting MongoDB connection with SRV...');
            await mongoose_1.default.connect(uri, options);
        } catch (srvError) {
            console.log('⚠️ SRV connection failed, trying direct connection...');
            // Convert SRV URL to direct URL
            const directUri = uri.replace(
                'mongodb+srv://',
                'mongodb://'
            ) + '&ssl=true';
            await mongoose_1.default.connect(directUri, options);
        }
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            syscall: error.syscall,
            hostname: error.hostname
        });
        // Additional debugging info
        console.error('💡 Troubleshooting steps:\n' +
            '1. Check if you can resolve the hostname:\n' +
            '   $ nslookup corvuscluster.dzrhi.mongodb.net\n' +
            '2. Check if port 27017 is accessible:\n' +
            '   $ nc -zv corvuscluster.dzrhi.mongodb.net 27017\n' +
            '3. Verify your IP is whitelisted in MongoDB Atlas\n' +
            '4. Check your network/firewall settings');
        process.exit(1);
    }
};
exports.default = connectDB;
