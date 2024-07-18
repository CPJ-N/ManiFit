import { Routine } from "./routine.model";

// Session.ts
export interface Session {
    sessionId: string;
    routines: Routine[]; // Array of routine IDs included in the session
    createdBy: string; // Trainer ID
    assignees: Assignee[]; // Array of objects containing trainee IDs and specific session dates
}

export interface Assignee {
    traineeId: string;
    date: string; // Specific date the session is assigned to this trainee
    status: 'planned' | 'completed' | 'missed'; // Current status of the session for this trainee
}