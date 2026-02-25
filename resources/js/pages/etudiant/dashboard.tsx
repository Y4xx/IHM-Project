import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircle2, 
    Clock, 
    XCircle, 
    QrCode, 
    History,
    TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Presence, PresenceStats } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord étudiant',
        href: '/etudiant/dashboard',
    },
];

interface Props {
    presencesRecentes: Presence[];
    stats: PresenceStats;
}

export default function DashboardEtudiant({ presencesRecentes, stats }: Props) {
    const getStatutBadge = (statut: string) => {
        switch (statut) {
            case 'present':
                return <Badge className="bg-green-500 hover:bg-green-600">Présent</Badge>;
            case 'retard':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Retard</Badge>;
            case 'absent':
                return <Badge className="bg-red-500 hover:bg-red-600">Absent</Badge>;
            default:
                return <Badge variant="secondary">{statut}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord - Étudiant" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Tableau de bord
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez vos présences et suivez votre assiduité
                        </p>
                    </div>
                    <Link href="/pointage">
                        <Button size="lg" className="gap-2">
                            <QrCode className="h-5 w-5" />
                            Scanner un QR Code
                        </Button>
                    </Link>
                </div>

                {/* Statistiques */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Séances
                            </CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                Séances enregistrées
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Présences
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.presents}</div>
                            <p className="text-xs text-muted-foreground">
                                Présences validées
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Retards
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.retards}</div>
                            <p className="text-xs text-muted-foreground">
                                Arrivées en retard
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Absences
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.absents}</div>
                            <p className="text-xs text-muted-foreground">
                                Absences non justifiées
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Taux de présence */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Taux de présence global
                        </CardTitle>
                        <CardDescription>
                            Votre assiduité sur l'ensemble des séances
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Progression</span>
                            <span className="text-2xl font-bold">{stats.tauxPresence ?? 0}%</span>
                        </div>
                        <Progress value={stats.tauxPresence ?? 0} className="h-3" />
                        <p className="text-sm text-muted-foreground">
                            {stats.presents + stats.retards} présences sur {stats.total} séances
                        </p>
                    </CardContent>
                </Card>

                {/* Présences récentes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Présences récentes</CardTitle>
                            <CardDescription>
                                Vos dernières séances enregistrées
                            </CardDescription>
                        </div>
                        <Link href="/etudiant/historique">
                            <Button variant="outline" size="sm">
                                Voir tout l'historique
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {presencesRecentes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    Aucune présence enregistrée pour le moment.
                                </p>
                                <Link href="/pointage" className="mt-4">
                                    <Button>Scanner votre premier QR Code</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {presencesRecentes.map((presence) => (
                                    <div
                                        key={presence.id}
                                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {presence.seance?.cours?.nom}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {presence.seance?.date} • {presence.seance?.heure_debut} - {presence.seance?.heure_fin}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {presence.distance && (
                                                <span className="text-xs text-muted-foreground">
                                                    {Math.round(presence.distance)}m
                                                </span>
                                            )}
                                            {getStatutBadge(presence.statut)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
