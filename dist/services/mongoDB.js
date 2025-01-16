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
        await mongoose_1.default.connect(uri);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
