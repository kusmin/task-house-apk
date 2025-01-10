// src/types/index.ts

export interface User {
    ID: number;
    Username: string;
    // Password não é retornado pela API por segurança
}

export interface Task {
    ID: number;
    Title: string;
    Description: string;
    Completed: boolean;
    UserID: number;
    DueDate: string; // ISO String
}

export interface Category {
    ID: number;
    Name: string;
    Notes: Note[];
}

export interface Note {
    ID: number;
    Title: string;
    Content: string;
    ImageURL?: string;
    Link?: string;
    CategoryID: number;
    Category?: Category;
    UserID: number;
    DueDate?: string; // Opcional, caso deseje adicionar
}
