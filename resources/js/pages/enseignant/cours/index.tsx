import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { 
    BookOpen, 
    Plus,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Calendar
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
import type { BreadcrumbItem, Cours, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: '/enseignant/dashboard',
    },
    {
        title: 'Cours',
        href: '/enseignant/cours',
    },
];

interface Props {
    cours: PaginatedData<Cours>;
}

export default function CoursIndex({ cours }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.')) {
            router.delete(`/enseignant/cours/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes cours" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="h-6 w-6" />
                            Mes cours
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez vos cours et leurs séances
                        </p>
                    </div>
                    <Link href="/enseignant/cours/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nouveau cours
                        </Button>
                    </Link>
                </div>

                {/* Liste des cours */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des cours</CardTitle>
                        <CardDescription>
                            {cours.total} cours au total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {cours.data.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Aucun cours</h3>
                                <p className="text-muted-foreground mb-4">
                                    Vous n'avez pas encore créé de cours.
                                </p>
                                <Link href="/enseignant/cours/create">
                                    <Button>Créer votre premier cours</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom du cours</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Séances</TableHead>
                                                <TableHead>Date de création</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cours.data.map((c) => (
                                                <TableRow key={c.id}>
                                                    <TableCell className="font-medium">
                                                        {c.nom}
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {c.description || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {c.seances_count || 0}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {new Date(c.created_at).toLocaleDateString('fr-FR')}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/enseignant/cours/${c.id}`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/enseignant/cours/${c.id}/edit`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => handleDelete(c.id)}
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
                                {cours.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Page {cours.current_page} sur {cours.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            {cours.current_page > 1 && (
                                                <Link href={`/enseignant/cours?page=${cours.current_page - 1}`}>
                                                    <Button variant="outline" size="sm">
                                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                                        Précédent
                                                    </Button>
                                                </Link>
                                            )}
                                            {cours.current_page < cours.last_page && (
                                                <Link href={`/enseignant/cours?page=${cours.current_page + 1}`}>
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
