import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircle2, 
    Clock, 
    XCircle, 
    History,
    MapPin,
    Calendar,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Presence, PresenceStats, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: '/etudiant/dashboard',
    },
    {
        title: 'Historique',
        href: '/etudiant/historique',
    },
];

interface Props {
    presences: PaginatedData<Presence>;
    stats: PresenceStats;
}

export default function Historique({ presences, stats }: Props) {
    const getStatutBadge = (statut: string) => {
        switch (statut) {
            case 'present':
                return (
                    <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Présent
                    </Badge>
                );
            case 'retard':
                return (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 gap-1">
                        <Clock className="h-3 w-3" />
                        Retard
                    </Badge>
                );
            case 'absent':
                return (
                    <Badge className="bg-red-500 hover:bg-red-600 gap-1">
                        <XCircle className="h-3 w-3" />
                        Absent
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{statut}</Badge>;
        }
    };

    const formatDateTime = (dateTimeString: string | null) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historique des présences" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <History className="h-6 w-6" />
                        Historique des présences
                    </h1>
                    <p className="text-muted-foreground">
                        Consultez l'ensemble de vos présences enregistrées
                    </p>
                </div>

                {/* Statistiques résumées */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <History className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Présences</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.presents}</p>
                                </div>
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Retards</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.retards}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Absences</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.absents}</p>
                                </div>
                                <XCircle className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tableau des présences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des présences</CardTitle>
                        <CardDescription>
                            {presences.total} enregistrement(s) au total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {presences.data.length === 0 ? (
                            <div className="text-center py-8">
                                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    Aucune présence enregistrée pour le moment.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Cours</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Horaire</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Distance</TableHead>
                                                <TableHead>Scanné le</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {presences.data.map((presence) => (
                                                <TableRow key={presence.id}>
                                                    <TableCell className="font-medium">
                                                        {presence.seance?.cours?.nom}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            {presence.seance?.date}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {presence.seance?.heure_debut} - {presence.seance?.heure_fin}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatutBadge(presence.statut)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {presence.distance ? (
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <MapPin className="h-3 w-3" />
                                                                {Math.round(presence.distance)}m
                                                            </div>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {formatDateTime(presence.scanne_le)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {presences.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Page {presences.current_page} sur {presences.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {presences.current_page > 1 && (
                                                <Link 
                                                    href={`/etudiant/historique?page=${presences.current_page - 1}`}
                                                >
                                                    <Button variant="outline" size="sm">
                                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                                        Précédent
                                                    </Button>
                                                </Link>
                                            )}
                                            {presences.current_page < presences.last_page && (
                                                <Link 
                                                    href={`/etudiant/historique?page=${presences.current_page + 1}`}
                                                >
                                                    <Button variant="outline" size="sm">
                                                        Suivant
                                                        <ChevronRight className="h-4 w-4 ml-1" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
