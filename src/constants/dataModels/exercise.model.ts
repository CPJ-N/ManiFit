export interface Exercise {
    id?: string;
    name: string;
    description: string;
    duration?: number;
    repetitions?: number;
    sets?: number;
    weight?: number;
    image?: string;
    video?: string;
    trainerId: string;
    category: string;
}