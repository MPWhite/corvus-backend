import { IPatient } from '../services/PatientModel';

export const generateMockPatients = (count: number = 20): Partial<IPatient>[] => {
    const patients: Partial<IPatient>[] = [];
    
    const urgencyLevels = ['low', 'medium', 'high', 'critical'] as const;
    const referralTypes = ['self', 'external', 'internal'] as const;
    const reviewStatuses = ['PENDING_MA_REVIEW', 'READY_FOR_SURGEON', 'NEEDS_MORE_INFO', 'SURGEON_APPROVED', 'SCHEDULED'] as const;
    const noteTypes = ['general', 'surgical', 'medical', 'requirement'] as const;
    const documentStatuses = ['pending', 'received', 'expired'] as const;
    
    for (let i = 0; i < count; i++) {
        // Generate mock documents - make sure they're received
        const mockDocuments = [
            {
                type: 'Medical History',
                received: true,
                url: 'https://example.com/doc1.pdf',
                dateReceived: new Date(2023, 11, 25)
            },
            {
                type: 'Insurance Card',
                received: true,
                url: 'https://example.com/doc2.pdf',
                dateReceived: new Date(2023, 11, 26)
            },
            {
                type: 'Lab Results',
                received: Math.random() > 0.5,
                url: 'https://example.com/labs.pdf',
                dateReceived: new Date(2023, 11, 27),
                status: 'received' as const,
                requestedDate: new Date(2023, 11, 22)
            },
            {
                type: 'Imaging Results',
                received: Math.random() > 0.5,
                url: 'https://example.com/imaging.pdf',
                dateReceived: new Date(2023, 11, 28),
                status: 'pending' as const,
                requestedDate: new Date(2023, 11, 23)
            }
        ];

        // Generate mock notes with proper typing
        const mockNotes = [
            {
                id: `note${i}1`,
                content: 'Initial assessment completed',
                author: 'Dr. Smith',
                timestamp: new Date(2023, 11, 20),
                type: 'general' as const
            },
            {
                id: `note${i}2`,
                content: 'Patient cleared for surgery',
                author: 'Dr. Johnson',
                timestamp: new Date(2023, 11, 21),
                type: 'surgical' as const
            }
        ];

        // Generate mock medications
        const mockMedications = [
            {
                name: 'Metformin',
                dosage: '500mg',
                frequency: 'Twice daily',
                startDate: new Date(2023, 6, 1),
                prescribedBy: 'Dr. Smith'
            },
            {
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                startDate: new Date(2023, 6, 1),
                prescribedBy: 'Dr. Johnson'
            }
        ];

        // Generate mock lab results
        const mockLabResults = [
            {
                testName: 'Complete Blood Count',
                date: new Date(2023, 11, 1),
                result: '14.2',
                unit: 'g/dL',
                isAbnormal: false
            },
            {
                testName: 'A1C',
                date: new Date(2023, 11, 1),
                result: '5.7',
                unit: '%',
                isAbnormal: true
            },
            {
                testName: 'Blood Pressure',
                date: new Date(2023, 11, 1),
                result: '120/80',
                unit: 'mmHg',
                isAbnormal: false
            }
        ];

        // Generate mock surgery requirements
        const mockSurgeryRequirements = [
            {
                name: 'BMI Requirement',
                value: 28,
                required: '< 35',
                met: true,
                description: 'Patient must have BMI under 35',
                critical: true
            },
            {
                name: 'A1C Level',
                value: 6.5,
                required: '< 7.0',
                met: true,
                description: 'Blood sugar control must be stable',
                critical: true
            }
        ];

        // Generate mock surgical history
        const mockSurgicalHistory = [
            {
                procedure: 'Appendectomy',
                date: new Date(2020, 5, 15),
                surgeon: 'Dr. Wilson',
                facility: 'Central Hospital',
                complications: 'None'
            },
            {
                procedure: 'Knee Arthroscopy',
                date: new Date(2019, 3, 10),
                surgeon: 'Dr. Anderson',
                facility: 'Sports Medicine Center',
                complications: 'Minor infection'
            }
        ];

        // Generate mock required actions
        const mockRequiredActions = [
            {
                id: `action${i}1`,
                type: 'document',
                description: 'Obtain cardiac clearance',
                dueDate: new Date(2024, 0, 15),
                assignedTo: 'Dr. Smith',
                status: 'pending' as const
            }
        ];

        const patient: Partial<IPatient> = {
            name: `Patient ${i + 1}`,
            age: 30 + Math.floor(Math.random() * 40),
            gender: Math.random() > 0.5 ? 'male' : 'female',
            bmi: 20 + Math.random() * 15,
            reason: `Consultation for ${['Knee Replacement', 'Hip Surgery', 'Shoulder Repair', 'Spinal Fusion'][i % 4]}`,
            needsReview: true,
            isCandidate: Math.random() > 0.3,
            assignedTo: `Dr. ${['Smith', 'Johnson', 'Williams'][i % 3]}`,
            referringProvider: `Dr. ${['Brown', 'Davis', 'Miller'][i % 3]}`,
            surgeryType: ['Knee Replacement', 'Hip Surgery', 'Shoulder Repair', 'Spinal Fusion'][i % 4],
            medicalHistory: [
                'Hypertension',
                'Type 2 Diabetes',
                'Osteoarthritis',
                'High Cholesterol',
                'Sleep Apnea'
            ],
            medications: mockMedications,
            requiredDocuments: mockDocuments,
            lastUpdated: new Date(),
            notes: mockNotes,
            consultDate: new Date(2023, 11, 1),
            urgencyLevel: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
            priorityScore: Math.floor(Math.random() * 100),
            ehrId: Math.random().toString(36).substr(2, 9),
            referralType: referralTypes[Math.floor(Math.random() * referralTypes.length)],
            reviewStatus: reviewStatuses[Math.floor(Math.random() * reviewStatuses.length)],
            referralDate: new Date(2023, 10, 15),
            surgeryRequirements: mockSurgeryRequirements,
            labResults: mockLabResults,
            reviewNotes: mockNotes,
            surgicalHistory: mockSurgicalHistory,
            requiredActions: mockRequiredActions
        };

        // IMPORTANT: Force some patients to be ready for surgeon
        if (i < 5) { // First 5 patients will be ready for surgeon
            patient.reviewStatus = 'READY_FOR_SURGEON';
            patient.requiredDocuments = mockDocuments;
            patient.surgeryRequirements = mockSurgeryRequirements;
            console.log(`Setting patient ${i + 1} to READY_FOR_SURGEON`);
        } else if (i < count / 2) { // Make another 17% scheduled
            patient.reviewStatus = 'SCHEDULED';
            patient.requiredDocuments = mockDocuments;
            patient.scheduledDate = new Date(2024, 0, 15);
        }

        patients.push(patient);
    }
    
    // Debug logs
    console.log('=== Mock Data Generation ===');
    const statusCounts = patients.reduce((acc, p) => {
        const status = p.reviewStatus || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    console.log('Generated patients by status:', statusCounts);
    
    const readyPatients = patients.filter(p => p.reviewStatus === 'READY_FOR_SURGEON');
    console.log('Ready for surgeon patients:', readyPatients.length);
    if (readyPatients.length > 0) {
        console.log('Sample ready patient:', {
            name: readyPatients[0].name,
            status: readyPatients[0].reviewStatus,
            docs: readyPatients[0].requiredDocuments?.map(d => ({ type: d.type, received: d.received }))
        });
    }
    
    return patients;
}; 