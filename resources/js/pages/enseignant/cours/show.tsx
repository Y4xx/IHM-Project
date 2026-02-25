import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    ArrowLeft,
    Edit,
    Plus,
    Calendar,
    QrCode,
    Users
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
import type { BreadcrumbItem, Cours } from '@/types';

interface Props {
    cours: Cours;
}

export default function ShowCours({ cours }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tableau de bord',
            href: '/enseignant/dashboard',
        },
        {
            title: 'Cours',
            href: '/enseignant/cours',
        },
        {
            title: cours.nom,
            href: `/enseignant/cours/${cours.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={cours.nom} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/enseignant/cours">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                                <BookOpen className="h-6 w-6" />
                                {cours.nom}
                            </h1>
                            {cours.description && (
                                <p className="text-muted-foreground">
                                    {cours.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/enseignant/cours/${cours.id}/edit`}>
                            <Button variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Modifier
                            </Button>
                        </Link>
                        <Link href={`/enseignant/seances/create?cours_id=${cours.id}`}>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Nouvelle séance
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Séances</p>
                                    <p className="text-2xl font-bold">{cours.seances?.length || 0}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total présences</p>
                                    <p className="text-2xl font-bold">
                                        {cours.seances?.reduce((acc, s) => acc + (s.presences_count || 0), 0) || 0}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Date de création</p>
                                    <p className="text-lg font-semibold">
                                        {new Date(cours.created_at).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Liste des séances */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Séances du cours</CardTitle>
                            <CardDescription>
                                Liste de toutes les séances de ce cours
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!cours.seances || cours.seances.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Aucune séance</h3>
                                <p className="text-muted-foreground mb-4">
                                    Ce cours n'a pas encore de séances planifiées.
                                </p>
                                <Link href={`/enseignant/seances/create?cours_id=${cours.id}`}>
                                    <Button>Créer une séance</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Horaire</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead>Présences</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cours.seances.map((seance) => (
                                            <TableRow key={seance.id}>
                                                <TableCell className="font-medium">
                                                    {seance.date}
                                                </TableCell>
                                                <TableCell>
                                                    {seance.heure_debut} - {seance.heure_fin}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={seance.active ? "default" : "secondary"}>
                                                        {seance.active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {seance.presences_count || 0} étudiant(s)
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/enseignant/seances/${seance.id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <QrCode className="h-4 w-4" />
                                                            QR Code
                                                        </Button>
                                                    </Link>
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
        </AppLayout>
    );
}
