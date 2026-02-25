export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'enseignant' | 'etudiant';
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

// Types pour le système de pointage
export type Cours = {
    id: number;
    nom: string;
    description: string | null;
    enseignant_id: number;
    enseignant?: User;
    seances_count?: number;
    seances?: Seance[];
    created_at: string;
    updated_at: string;
};

export type Seance = {
    id: number;
    cours_id: number;
    date: string;
    heure_debut: string;
    heure_fin: string;
    qr_token: string;
    active: boolean;
    cours?: Cours;
    presences?: Presence[];
    presences_count?: number;
    created_at: string;
    updated_at: string;
};

export type Presence = {
    id: number;
    etudiant_id: number;
    seance_id: number;
    statut: 'present' | 'absent' | 'retard';
    latitude: number | null;
    longitude: number | null;
    distance: number | null;
    scanne_le: string | null;
    etudiant?: User;
    seance?: Seance;
    created_at: string;
    updated_at: string;
};

export type PresenceStats = {
    total: number;
    presents: number;
    retards: number;
    absents: number;
    tauxPresence?: number;
};

export type EnseignantStats = {
    totalCours: number;
    totalSeances: number;
    totalPresences: number;
    tauxPresence: number;
};

export type AdminStats = {
    totalEtudiants: number;
    totalEnseignants: number;
    totalCours: number;
    totalSeances: number;
    totalPresences: number;
    tauxPresenceGlobal: number;
    presents: number;
    retards: number;
    absents: number;
};

export type CoursStats = {
    id: number;
    nom: string;
    enseignant: string;
    totalSeances: number;
    totalPresences: number;
    tauxPresence: number;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};
