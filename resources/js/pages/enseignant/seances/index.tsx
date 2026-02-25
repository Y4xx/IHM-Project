import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { 
    Calendar, 
    Plus,
    QrCode,
    Users,
    ChevronLeft,
    ChevronRight,
    Trash2
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
import type { BreadcrumbItem, Seance, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: '/enseignant/dashboard',
    },
    {
        title: 'Séances',
        href: '/enseignant/seances',
    },
];

interface Props {
    seances: PaginatedData<Seance>;
}

export default function SeancesIndex({ seances }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette séance ? Cette action est irréversible.')) {
            router.delete(`/enseignant/seances/${id}`);
        }
    };

    const handleToggleActive = (id: number) => {
        router.post(`/enseignant/seances/${id}/toggle-active`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes séances" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Calendar className="h-6 w-6" />
                            Mes séances
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez vos séances et les QR codes de présence
                        </p>
                    </div>
                    <Link href="/enseignant/seances/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nouvelle séance
                        </Button>
                    </Link>
                </div>

                {/* Liste des séances */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des séances</CardTitle>
                        <CardDescription>
                            {seances.total} séance(s) au total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {seances.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Aucune séance</h3>
                                <p className="text-muted-foreground mb-4">
                                    Vous n'avez pas encore créé de séances.
                                </p>
                                <Link href="/enseignant/seances/create">
                                    <Button>Créer votre première séance</Button>
                                </Link>
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
                                                <TableHead>Présences</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {seances.data.map((seance) => (
                                                <TableRow key={seance.id}>
                                                    <TableCell className="font-medium">
                                                        {seance.cours?.nom}
                                                    </TableCell>
                                                    <TableCell>
                                                        {seance.date}
                                                    </TableCell>
                                                    <TableCell>
                                                        {seance.heure_debut} - {seance.heure_fin}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleActive(seance.id)}
                                                            className="p-0"
                                                        >
                                                            <Badge 
                                                                variant={seance.active ? "default" : "secondary"}
                                                                className="cursor-pointer"
                                                            >
                                                                {seance.active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {seance.presences_count || 0}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/enseignant/seances/${seance.id}`}>
                                                                <Button variant="ghost" size="sm" className="gap-1">
                                                                    <QrCode className="h-4 w-4" />
                                                                    QR Code
                                                                </Button>
                                                            </Link>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => handleDelete(seance.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {seances.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Page {seances.current_page} sur {seances.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {seances.current_page > 1 && (
                                                <Link href={`/enseignant/seances?page=${seances.current_page - 1}`}>
                                                    <Button variant="outline" size="sm">
                                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                                        Précédent
                                                    </Button>
                                                </Link>
                                            )}
                                            {seances.current_page < seances.last_page && (
                                                <Link href={`/enseignant/seances?page=${seances.current_page + 1}`}>
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
