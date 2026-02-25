import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Calendar, 
    Users, 
    TrendingUp,
    Plus,
    QrCode,
    Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Cours, Seance, EnseignantStats } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord enseignant',
        href: '/enseignant/dashboard',
    },
];

interface Props {
    cours: Cours[];
    seancesRecentes: Seance[];
    stats: EnseignantStats;
}

export default function DashboardEnseignant({ cours, seancesRecentes, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord - Enseignant" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Tableau de bord
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez vos cours et suivez les présences de vos étudiants
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/enseignant/cours/create">
                            <Button variant="outline" className="gap-2">
                                <BookOpen className="h-4 w-4" />
                                Nouveau cours
                            </Button>
                        </Link>
                        <Link href="/enseignant/seances/create">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Nouvelle séance
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Mes cours
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCours}</div>
                            <p className="text-xs text-muted-foreground">
                                Cours actifs
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
                                Séances créées
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Présences
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPresences}</div>
                            <p className="text-xs text-muted-foreground">
                                Enregistrements
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Taux de présence
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.tauxPresence}%</div>
                            <Progress value={stats.tauxPresence} className="h-2 mt-2" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Mes cours */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Mes cours</CardTitle>
                                <CardDescription>
                                    Liste de vos cours actifs
                                </CardDescription>
                            </div>
                            <Link href="/enseignant/cours">
                                <Button variant="outline" size="sm">
                                    Voir tout
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {cours.length === 0 ? (
                                <div className="text-center py-8">
                                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Aucun cours créé pour le moment.
                                    </p>
                                    <Link href="/enseignant/cours/create" className="mt-4 inline-block">
                                        <Button>Créer votre premier cours</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cours.slice(0, 5).map((c) => (
                                        <div
                                            key={c.id}
                                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div>
                                                <p className="font-medium">{c.nom}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {c.seances_count || 0} séance(s)
                                                </p>
                                            </div>
                                            <Link href={`/enseignant/cours/${c.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Séances récentes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Séances récentes</CardTitle>
                                <CardDescription>
                                    Vos dernières séances créées
                                </CardDescription>
                            </div>
                            <Link href="/enseignant/seances">
                                <Button variant="outline" size="sm">
                                    Voir tout
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {seancesRecentes.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Aucune séance créée pour le moment.
                                    </p>
                                    <Link href="/enseignant/seances/create" className="mt-4 inline-block">
                                        <Button>Créer votre première séance</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {seancesRecentes.map((seance) => (
                                        <div
                                            key={seance.id}
                                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium">{seance.cours?.nom}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {seance.date} • {seance.heure_debut} - {seance.heure_fin}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={seance.active ? "default" : "secondary"}>
                                                    {seance.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {seance.presences_count || 0} présence(s)
                                                </span>
                                                <Link href={`/enseignant/seances/${seance.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <QrCode className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
