import { Types } from 'mongoose';
import { IPatient } from '../services/PatientModel';

// First, let's define more specific types for our data collection tasks

interface DataCollectionTask {
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
    steps: {
        id: string;
        title: string;
        description: string;
        status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
        timestamp: Date;
        details: string;
        blockers?: string[];
        nextAction?: string;
    }[];
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

// Helper functions for specific surgery types
const generateSurgerySpecificTasks = (patient: IPatient): DataCollectionTask[] => {
    const tasks: DataCollectionTask[] = [];
    
    switch (patient.surgeryType) {
        case 'Knee Replacement':
            tasks.push({
                id: new Types.ObjectId().toString(),
                patientId: patient._id.toString(),
                category: 'imaging',
                title: 'Standing Knee X-rays Collection',
                description: 'Weight-bearing AP/Lateral views needed from Central Imaging',
                priority: 'high',
                status: 'in_progress',
                progress: 30,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                steps: [
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Query CareEverywhere HIE',
                        description: 'Check for existing knee X-rays in last 6 months',
                        status: 'completed',
                        timestamp: new Date(),
                        details: 'Found records from St. Mary\'s Hospital, but older than 6 months',
                        nextAction: undefined
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Contact Central Imaging Scheduling',
                        description: 'Schedule new standing X-rays',
                        status: 'in_progress',
                        timestamp: new Date(),
                        details: 'Called (555) 123-4567, on hold with scheduling',
                        nextAction: 'Call back scheduling dept at 2pm'
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Insurance Pre-authorization',
                        description: 'Submit X-ray pre-auth to UnitedHealth',
                        status: 'pending',
                        timestamp: new Date(),
                        details: 'Access UHC provider portal at provider.unitedhealthcare.com',
                        nextAction: 'Submit pre-auth form #XR-2023'
                    }
                ],
                source: {
                    system: 'CareEverywhere HIE',
                    organization: 'Central Imaging',
                    contact: {
                        name: 'Sarah Johnson',
                        role: 'Radiology Scheduler',
                        phone: '555-123-4567',
                        email: 'scheduling@centralimaging.com'
                    }
                },
                metadata: {
                    attempts: 1,
                    lastAttempt: new Date(),
                    method: 'phone',
                    urgency: 'routine',
                    notes: ['Patient prefers afternoon appointments', 'Needs transportation assistance']
                },
                lastUpdated: new Date()
            });
            break;

        case 'Spinal Fusion':
            tasks.push({
                id: new Types.ObjectId().toString(),
                patientId: patient._id.toString(),
                category: 'imaging',
                title: 'Spine Imaging & Neurological Workup',
                description: 'Full spine imaging package required from Northwestern Imaging',
                priority: 'high',
                status: 'in_progress',
                progress: 40,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                steps: [
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Query Epic CareLink',
                        description: 'Search for existing spine studies',
                        status: 'completed',
                        timestamp: new Date(),
                        details: 'Found MRI from 3 months ago at Rush Hospital, requesting transfer',
                        nextAction: 'Confirm image transfer via PowerShare'
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Schedule CT Myelogram',
                        description: 'Required for surgical planning',
                        status: 'in_progress',
                        timestamp: new Date(),
                        details: 'Left VM for Northwestern Spine Center (312-555-0178)',
                        nextAction: 'Follow up with Laura at scheduling if no callback by 2pm'
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'DEXA Scan Authorization',
                        description: 'Bone density required for fusion planning',
                        status: 'pending',
                        timestamp: new Date(),
                        details: 'Need to submit to Aetna via provider portal (auth code: DEX-2023)',
                        nextAction: 'Complete Aetna form B-17 for osteoporosis screening'
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Neurology Consultation',
                        description: 'Pre-operative neurological assessment',
                        status: 'blocked',
                        timestamp: new Date(),
                        details: 'Dr. Patel requires updated EMG before consultation',
                        blockers: ['Waiting for EMG authorization'],
                        nextAction: 'Call Aetna Spine Team at (800) 555-9999'
                    }
                ],
                source: {
                    system: 'Epic CareLink',
                    organization: 'Northwestern Spine Center',
                    contact: {
                        name: 'Laura Chen',
                        role: 'Spine Coordinator',
                        phone: '312-555-0178',
                        email: 'spine.scheduling@northwestern.edu',
                        fax: '312-555-0179'
                    }
                },
                metadata: {
                    attempts: 2,
                    lastAttempt: new Date(),
                    method: 'portal',
                    urgency: 'expedited',
                    notes: [
                        'Patient has existing images at Rush',
                        'Needs sedation for MRI - claustrophobic',
                        'Preferred imaging time: mornings only'
                    ]
                },
                lastUpdated: new Date()
            });
            break;

        case 'ACL Reconstruction':
            tasks.push({
                id: new Types.ObjectId().toString(),
                patientId: patient._id.toString(),
                category: 'imaging',
                title: 'Sports Medicine Imaging Package',
                description: 'Complete knee injury assessment from Sports Medicine Center',
                priority: 'high',
                status: 'in_progress',
                progress: 45,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                steps: [
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Query Athena Health Portal',
                        description: 'Check for existing knee MRI studies',
                        status: 'completed',
                        timestamp: new Date(),
                        details: 'No recent studies found in network',
                        nextAction: 'Proceed with new imaging orders'
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Schedule MRI with Contrast',
                        description: 'High-resolution knee protocol required',
                        status: 'in_progress',
                        timestamp: new Date(),
                        details: 'Submitted request via Sports Med Portal (ref: MRI-2023-789)',
                        nextAction: 'Call Sports Med Imaging at (773) 555-0133 for expedited slot'
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Physical Therapy Assessment',
                        description: 'Pre-surgical functional evaluation',
                        status: 'pending',
                        timestamp: new Date(),
                        details: 'Need to schedule with ATI Physical Therapy',
                        nextAction: 'Submit referral through ATI provider portal'
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Injury Mechanism Documentation',
                        description: 'Collect detailed injury report',
                        status: 'in_progress',
                        timestamp: new Date(),
                        details: 'Faxed request to Urgent Care where initially seen',
                        nextAction: 'Follow up with UC records dept at (312) 555-0134'
                    }
                ],
                source: {
                    system: 'Athena Health',
                    organization: 'Sports Medicine Imaging Center',
                    contact: {
                        name: 'Mike Thompson',
                        role: 'Sports Medicine Coordinator',
                        phone: '773-555-0133',
                        email: 'scheduling@sportsmedimaging.com',
                        fax: '773-555-0135'
                    }
                },
                metadata: {
                    attempts: 1,
                    lastAttempt: new Date(),
                    method: 'portal',
                    urgency: 'expedited',
                    notes: [
                        'Patient is athlete - requesting expedited scheduling',
                        'Injury occurred during soccer match',
                        'Prefers early morning appointments'
                    ]
                },
                lastUpdated: new Date()
            });
            break;

        case 'Shoulder Surgery':
            tasks.push({
                id: new Types.ObjectId().toString(),
                patientId: patient._id.toString(),
                category: 'imaging',
                title: 'Advanced Shoulder Imaging Package',
                description: 'Complete rotator cuff assessment from MSK Imaging',
                priority: 'high',
                status: 'in_progress',
                progress: 60,
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                steps: [
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Query Epic Care Everywhere',
                        description: 'Search for recent shoulder studies',
                        status: 'completed',
                        timestamp: new Date(),
                        details: 'Retrieved MRI from Northwestern Memorial',
                        nextAction: undefined
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Schedule Dynamic Ultrasound',
                        description: 'Real-time rotator cuff assessment',
                        status: 'in_progress',
                        timestamp: new Date(),
                        details: 'Called MSK Imaging Center (312-555-0140)',
                        nextAction: 'Confirm appointment time with patient'
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Motion Study X-rays',
                        description: 'Stress views and motion series',
                        status: 'pending',
                        timestamp: new Date(),
                        details: 'Need to coordinate with fluoroscopy suite',
                        nextAction: 'Schedule with Dr. Roberts\' preferred facility'
                    }
                ],
                source: {
                    system: 'Epic Care Everywhere',
                    organization: 'MSK Imaging Center',
                    contact: {
                        name: 'Dr. Roberts',
                        role: 'MSK Radiologist',
                        phone: '312-555-0140',
                        email: 'roberts@mskimaging.com',
                        fax: '312-555-0141'
                    }
                },
                metadata: {
                    attempts: 2,
                    lastAttempt: new Date(),
                    method: 'portal',
                    urgency: 'routine',
                    notes: [
                        'Patient has metal implant in left shoulder',
                        'Previous surgery at Northwestern in 2019',
                        'Prefers afternoon appointments'
                    ]
                },
                lastUpdated: new Date()
            });
            break;

        // Add other surgery types...
    }

    return tasks;
};

// Helper for medical history based tasks
const generateMedicalHistoryTasks = (patient: IPatient): DataCollectionTask[] => {
    const tasks: DataCollectionTask[] = [];
    
    // Check for diabetes in medical history
    if (patient.medicalHistory.some(condition => condition.toLowerCase().includes('diabetes'))) {
        tasks.push({
            id: new Types.ObjectId().toString(),
            patientId: patient._id.toString(),
            category: 'lab_work',
            title: 'Diabetes Management Verification',
            description: 'Recent A1C and endocrinologist clearance required',
            priority: 'high',
            status: 'in_progress',
            progress: 30,
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            steps: [
                {
                    id: new Types.ObjectId().toString(),
                    title: 'A1C Test',
                    description: 'Recent A1C results needed',
                    status: 'in_progress',
                    timestamp: new Date(),
                    details: 'Lab order placed'
                },
                {
                    id: new Types.ObjectId().toString(),
                    title: 'Endocrinologist Clearance',
                    description: 'Pre-operative assessment',
                    status: 'pending',
                    timestamp: new Date(),
                    details: 'Appointment needed'
                }
            ],
            source: {
                system: 'EMR',
                organization: 'Endocrinology Associates',
                contact: {
                    name: 'Dr. Smith',
                    role: 'Endocrinologist',
                    phone: '555-0127'
                }
            },
            metadata: {
                attempts: 1,
                lastAttempt: new Date(),
                method: 'portal',
                urgency: 'routine'
            },
            lastUpdated: new Date()
        });
    }

    // Check age for cardiac clearance
    if (patient.age > 65) {
        tasks.push({
            id: new Types.ObjectId().toString(),
            patientId: patient._id.toString(),
            category: 'medical_records',
            title: 'Cardiac Clearance',
            description: 'Pre-operative cardiac evaluation required',
            priority: 'high',
            status: 'pending',
            progress: 0,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            steps: [
                {
                    id: new Types.ObjectId().toString(),
                    title: 'EKG',
                    description: 'Pre-operative EKG needed',
                    status: 'pending',
                    timestamp: new Date(),
                    details: 'Schedule with cardiology'
                },
                {
                    id: new Types.ObjectId().toString(),
                    title: 'Cardiac Consultation',
                    description: 'Cardiology clearance',
                    status: 'pending',
                    timestamp: new Date(),
                    details: 'Referral needed'
                }
            ],
            source: {
                system: 'EMR',
                organization: 'Cardiology Department',
                contact: {
                    name: 'Cardiology Scheduler',
                    role: 'Coordinator',
                    phone: '555-0128'
                }
            },
            metadata: {
                attempts: 0,
                method: 'phone',
                urgency: 'routine'
            },
            lastUpdated: new Date()
        });
    }

    return tasks;
};

// Add a function to handle missing documents
const generateDocumentCollectionTasks = (patient: IPatient): DataCollectionTask[] => {
    const tasks: DataCollectionTask[] = [];
    
    patient.requiredDocuments.forEach(doc => {
        if (!doc.received) {
            tasks.push({
                id: new Types.ObjectId().toString(),
                patientId: patient._id.toString(),
                category: 'documentation',
                title: `${doc.type} Collection`,
                description: `Required ${doc.type} missing from patient records`,
                priority: doc.type.toLowerCase().includes('consent') ? 'high' : 'medium',
                status: doc.status === 'pending' ? 'in_progress' : 'pending',
                progress: doc.status === 'pending' ? 25 : 0,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
                steps: [
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Initial Request',
                        description: `Request ${doc.type} from provider`,
                        status: 'in_progress',
                        timestamp: new Date(),
                        details: `Contacting ${patient.referringProvider} office`
                    },
                    {
                        id: new Types.ObjectId().toString(),
                        title: 'Follow-up',
                        description: 'Check status of request',
                        status: 'pending',
                        timestamp: new Date(),
                        details: 'Schedule follow-up in 48 hours',
                        nextAction: 'Call provider office'
                    }
                ],
                source: {
                    system: 'EMR',
                    organization: patient.referringProvider,
                    contact: {
                        name: 'Records Department',
                        role: 'Medical Records',
                        fax: '555-0126'
                    }
                },
                metadata: {
                    attempts: 1,
                    lastAttempt: new Date(),
                    method: 'fax',
                    urgency: doc.type.toLowerCase().includes('consent') ? 'expedited' : 'routine',
                    notes: [`Original request sent on ${doc.requestedDate}`]
                },
                lastUpdated: new Date()
            });
        }
    });

    return tasks;
};

// Main generator function
export const generateMockDataSyncs = (patientId: string, patient: IPatient) => {
    let dataSyncs: DataCollectionTask[] = [];

    // Add surgery-specific tasks
    dataSyncs = [...dataSyncs, ...generateSurgerySpecificTasks(patient)];

    // Add medical history based tasks
    dataSyncs = [...dataSyncs, ...generateMedicalHistoryTasks(patient)];

    // Add missing document tasks
    dataSyncs = [...dataSyncs, ...generateDocumentCollectionTasks(patient)];

    // Add insurance verification if needed
    if (!patient.insuranceVerified) {
        dataSyncs.push({
            id: new Types.ObjectId().toString(),
            patientId: patient._id.toString(),
            category: 'insurance',
            title: 'Insurance Verification',
            description: `Verify coverage for ${patient.surgeryType}`,
            priority: 'high',
            status: 'in_progress',
            progress: 25,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            steps: [
                {
                    id: new Types.ObjectId().toString(),
                    title: 'Benefits Verification',
                    description: 'Verify surgical benefits',
                    status: 'completed',
                    timestamp: new Date(),
                    details: 'Initial coverage confirmed'
                },
                {
                    id: new Types.ObjectId().toString(),
                    title: 'Pre-authorization',
                    description: 'Obtain surgical pre-auth',
                    status: 'in_progress',
                    timestamp: new Date(),
                    details: 'Documentation submitted'
                },
                {
                    id: new Types.ObjectId().toString(),
                    title: 'Patient Cost Estimate',
                    description: 'Calculate out-of-pocket costs',
                    status: 'pending',
                    timestamp: new Date(),
                    details: 'Awaiting insurance response'
                }
            ],
            source: {
                system: 'Insurance Portal',
                organization: 'Insurance Department',
                contact: {
                    name: 'Insurance Coordinator',
                    role: 'Benefits Specialist',
                    phone: '555-0131',
                    fax: '555-0132'
                }
            },
            metadata: {
                attempts: 2,
                lastAttempt: new Date(),
                method: 'portal',
                urgency: 'expedited',
                notes: ['Initial benefits verified', 'Awaiting pre-auth']
            },
            lastUpdated: new Date()
        });
    }

    return dataSyncs;
}; 