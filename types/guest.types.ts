export interface Guest {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    isChild: boolean;
    age: number | null;
    gender: 'Male' | 'Female' | null;
    createdAt: Date;
    updatedAt: Date;
    user?: any; // Optional user relation
}

export interface CreateGuestDto {
    firstName: string;
    lastName: string;
    isChild: boolean;
    age?: number | null;
    gender?: 'Male' | 'Female' | null;
}

export interface CreateGuestsBatchDto {
    guests: CreateGuestDto[];
}

export interface UpdateGuestDto {
    firstName?: string;
    lastName?: string;
    isChild?: boolean;
    age?: number | null;
    gender?: 'Male' | 'Female' | null;
}

export interface DeleteGuestsBatchDto {
    ids: string[];
}

export interface DeleteGuestsBatchResponse {
    count: number;
}

export interface GuestDetails {
    first_name: string;
    last_name: string;
    is_child: boolean;
    age?: number | null;
    gender?: 'Male' | 'Female' | null;
}
