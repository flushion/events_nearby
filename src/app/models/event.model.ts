export interface Event {
    id?: string; // ID de Firestore
    title: string;
    description: string;
    location: string;
    date: Date;
    favorite?: boolean;
}