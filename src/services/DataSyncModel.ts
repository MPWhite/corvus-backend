import mongoose, { Schema, Document } from 'mongoose';

export interface IDataSync extends Document {
    id: string;
    patientId: string;
    category: 'insurance' | 'medical_records' | 'lab_work' | 'imaging' | 'documentation' | 'coordination';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
    progress: number;
    dueDate: Date;
    assignedTo?: string;
    steps: Array<{
        id: string;
        title: string;
        description: string;
        status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
        timestamp: Date;
        details: string;
        blockers?: string[];
        nextAction?: string;
    }>;
    source: {
        system: string;
        organization: string;
        contact?: {
            name: string;
            role: string;
            phone?: string;
            email?: string;
            fax?: string;
        };
    };
    metadata: {
        attempts: number;
        lastAttempt?: Date;
        nextAttempt?: Date;
        method: 'fax' | 'phone' | 'email' | 'portal' | 'mail';
        urgency: 'routine' | 'expedited' | 'stat';
        notes?: string[];
    };
    lastUpdated: Date;
}

const dataSyncSchema = new Schema({
    id: String,
    patientId: String,
    category: {
        type: String,
        enum: ['insurance', 'medical_records', 'lab_work', 'imaging', 'documentation', 'coordination']
    },
    title: String,
    description: String,
    priority: {
        type: String,
        enum: ['high', 'medium', 'low']
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'blocked', 'failed']
    },
    progress: Number,
    dueDate: Date,
    assignedTo: String,
    steps: [{
        id: String,
        title: String,
        description: String,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'blocked', 'failed']
        },
        timestamp: Date,
        details: String,
        blockers: [String],
        nextAction: String
    }],
    source: {
        system: String,
        organization: String,
        contact: {
            name: String,
            role: String,
            phone: String,
            email: String,
            fax: String
        }
    },
    metadata: {
        attempts: Number,
        lastAttempt: Date,
        nextAttempt: Date,
        method: {
            type: String,
            enum: ['fax', 'phone', 'email', 'portal', 'mail']
        },
        urgency: {
            type: String,
            enum: ['routine', 'expedited', 'stat']
        },
        notes: [String]
    },
    lastUpdated: Date
});

export default mongoose.model<IDataSync>('DataSync', dataSyncSchema); 