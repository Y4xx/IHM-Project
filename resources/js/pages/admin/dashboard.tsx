import { Head } from '@inertiajs/react';
import { 
    Users, 
    BookOpen, 
    Calendar, 
    TrendingUp,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    GraduationCap,
    School
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, AdminStats, CoursStats, Seance } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord administrateur',
        href: '/admin/dashboard',
    },
];

interface Props {
    stats: AdminStats;
    coursStats: CoursStats[];
    seancesRecentes: Seance[];
}

export default function DashboardAdmin({ stats, coursStats, seancesRecentes }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord - Administrateur" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Tableau de bord administrateur
                        </h1>
                        <p className="text-muted-foreground">
                            Vue d'ensemble du système de pointage universitaire
                        </p>
                    </div>
                    <a href="/admin/export-csv" download>
                        <Button className="gap-2">
                            <Download className="h-4 w-4" />
                            Exporter les données (CSV)
                        </Button>
                    </a>
                </div>

                {/* Statistiques principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Étudiants
                            </CardTitle>
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalEtudiants}</div>
                            <p className="text-xs text-muted-foreground">
                                Étudiants inscrits
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Enseignants
                            </CardTitle>
                            <School className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalEnseignants}</div>
                            <p className="text-xs text-muted-foreground">
                                Enseignants actifs
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cours
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCours}</div>
                            <p className="text-xs text-muted-foreground">
                                Cours créés
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Séances
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalSeances}</div>
                            <p className="text-xs text-muted-foreground">
                                Séances programmées
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Taux de présence global */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Taux de présence global
                        </CardTitle>
                        <CardDescription>
                            Statistiques de présence sur l'ensemble du système
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Progression globale</span>
                                    <span className="text-3xl font-bold">{stats.tauxPresenceGlobal}%</span>
                                </div>
                                <Progress value={stats.tauxPresenceGlobal} className="h-4" />
                                <p className="text-sm text-muted-foreground">
                                    {stats.presents + stats.retards} présences sur {stats.totalPresences} enregistrements
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                    <p className="text-xl font-bold text-green-600">{stats.presents}</p>
                                    <p className="text-xs text-muted-foreground">Présents</p>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                    <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                                    <p className="text-xl font-bold text-yellow-600">{stats.retards}</p>
                                    <p className="text-xs text-muted-foreground">Retards</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                                    <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                                    <p className="text-xl font-bold text-red-600">{stats.absents}</p>
                                    <p className="text-xs text-muted-foreground">Absents</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Statistiques par cours */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistiques par cours</CardTitle>
                            <CardDescription>
                                Taux de présence par cours
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {coursStats.length === 0 ? (
                                <div className="text-center py-8">
                                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Aucun cours disponible.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {coursStats.slice(0, 5).map((cours) => (
                                        <div key={cours.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{cours.nom}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {cours.enseignant} • {cours.totalSeances} séance(s)
                                                    </p>
                                                </div>
                                                <Badge variant="outline">{cours.tauxPresence}%</Badge>
                                            </div>
                                            <Progress value={cours.tauxPresence} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Séances récentes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Séances récentes</CardTitle>
                            <CardDescription>
                                Dernières séances du système
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {seancesRecentes.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Aucune séance disponible.
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Cours</TableHead>
                                                <TableHead>Enseignant</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Présences</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {seancesRecentes.map((seance) => (
                                                <TableRow key={seance.id}>
                                                    <TableCell className="font-medium">
                                                        {seance.cours?.nom}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {seance.cours?.enseignant?.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {seance.date}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {seance.presences_count || 0}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Information système */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du système</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Coordonnées université</p>
                                <p className="font-mono text-sm">33.225410, -8.486408</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Rayon autorisé</p>
                                <p className="font-mono text-sm">300 mètres</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Délai retard</p>
                                <p className="font-mono text-sm">15 minutes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
