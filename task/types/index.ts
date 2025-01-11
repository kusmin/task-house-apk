// src/types/index.ts

export interface User {
    ID: number;
    Username: string;
    // Password não é retornado pela API por segurança
}

export interface Task {
    ID: number;
    title: string;
    description: string;
    completed: boolean;
    UserID: number;
    DueDate: string; // ISO String
}

export interface Category {
    ID: number;
    name: string;
    notes: Note[];
}

export interface Note {
    ID: number;
    title: string;
    content: string;
    ImageURL?: string;
    link?: string;
    category_id: number;
    category?: Category;
    user_id: number;
    DueDate?: string; // Opcional, caso deseje adicionar
}
