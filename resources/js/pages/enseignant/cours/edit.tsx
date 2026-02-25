import { Head, useForm, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    ArrowLeft,
    Save,
    Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Cours } from '@/types';

interface Props {
    cours: Cours;
}

export default function EditCours({ cours }: Props) {
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
        {
            title: 'Modifier',
            href: `/enseignant/cours/${cours.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nom: cours.nom,
        description: cours.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/enseignant/cours/${cours.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier - ${cours.nom}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/enseignant/cours/${cours.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="h-6 w-6" />
                            Modifier le cours
                        </h1>
                        <p className="text-muted-foreground">
                            Modifiez les informations du cours "{cours.nom}"
                        </p>
                    </div>
                </div>

                {/* Formulaire */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Informations du cours</CardTitle>
                        <CardDescription>
                            Modifiez les informations de base du cours
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="nom">Nom du cours *</Label>
                                <Input
                                    id="nom"
                                    type="text"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    placeholder="Ex: Mathématiques avancées"
                                    disabled={processing}
                                />
                                {errors.nom && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.nom}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optionnel)</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description du cours..."
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={processing}
                                />
                                {errors.description && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.description}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Mise à jour...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Enregistrer
                                        </>
                                    )}
                                </Button>
                                <Link href={`/enseignant/cours/${cours.id}`}>
                                    <Button type="button" variant="outline" disabled={processing}>
                                        Annuler
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
