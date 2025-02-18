import mongoose, { Document, Schema } from 'mongoose';

interface IDataSync {
    id: string;
    patientId: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    progress: number;  // 0-100
    steps: {
        id: string;
        title: string;
        description: string;
        status: 'pending' | 'in_progress' | 'completed' | 'failed';
        timestamp?: Date;
        details?: string;
    }[];
    source: {
        system: 'Epic' | 'Cerner' | 'Athena' | 'external';
        organization?: string;
    };
    lastUpdated: Date;
}

const dataSyncSchema = new Schema<IDataSync>({
    patientId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed', 'failed'],
        required: true 
    },
    progress: { 
        type: Number, 
        min: 0, 
        max: 100, 
        default: 0 
    },
    steps: [{
        id: String,
        title: String,
        description: String,
        status: { 
            type: String, 
            enum: ['pending', 'in_progress', 'completed', 'failed']
        },
        timestamp: Date,
        details: String
    }],
    source: {
        system: { 
            type: String, 
            enum: ['Epic', 'Cerner', 'Athena', 'external']
        },
        organization: String
    },
    lastUpdated: { type: Date, default: Date.now }
});

const DataSyncModel = mongoose.model<IDataSync>('DataSync', dataSyncSchema);

export default DataSyncModel; 