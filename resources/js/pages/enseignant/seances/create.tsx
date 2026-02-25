import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Calendar, 
    ArrowLeft,
    Save,
    Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Cours } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: '/enseignant/dashboard',
    },
    {
        title: 'Séances',
        href: '/enseignant/seances',
    },
    {
        title: 'Nouvelle séance',
        href: '/enseignant/seances/create',
    },
];

interface Props {
    cours: Cours[];
}

export default function CreateSeance({ cours }: Props) {
    // Get cours_id from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const defaultCoursId = urlParams.get('cours_id') || '';

    const { data, setData, post, processing, errors } = useForm({
        cours_id: defaultCoursId,
        date: '',
        heure_debut: '',
        heure_fin: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/enseignant/seances');
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouvelle séance" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/enseignant/seances">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Calendar className="h-6 w-6" />
                            Nouvelle séance
                        </h1>
                        <p className="text-muted-foreground">
                            Créez une nouvelle séance avec son QR code
                        </p>
                    </div>
                </div>

                {/* Formulaire */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Informations de la séance</CardTitle>
                        <CardDescription>
                            Un QR code unique sera généré automatiquement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {cours.length === 0 ? (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">
                                    Vous devez d'abord créer un cours avant de pouvoir créer une séance.
                                </p>
                                <Link href="/enseignant/cours/create">
                                    <Button>Créer un cours</Button>
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cours_id">Cours *</Label>
                                    <Select
                                        value={data.cours_id}
                                        onValueChange={(value) => setData('cours_id', value)}
                                        disabled={processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un cours" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cours.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.cours_id && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.cours_id}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Date *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        min={today}
                                        disabled={processing}
                                    />
                                    {errors.date && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.date}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="heure_debut">Heure de début *</Label>
                                        <Input
                                            id="heure_debut"
                                            type="time"
                                            value={data.heure_debut}
                                            onChange={(e) => setData('heure_debut', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.heure_debut && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.heure_debut}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="heure_fin">Heure de fin *</Label>
                                        <Input
                                            id="heure_fin"
                                            type="time"
                                            value={data.heure_fin}
                                            onChange={(e) => setData('heure_fin', e.target.value)}
                                            disabled={processing}
                                        />
                                        {errors.heure_fin && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.heure_fin}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>

                                <Alert>
                                    <AlertDescription>
                                        Un QR code unique sera automatiquement généré pour cette séance. 
                                        Les étudiants pourront le scanner pour marquer leur présence.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Création en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Créer la séance
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/enseignant/seances">
                                        <Button type="button" variant="outline" disabled={processing}>
                                            Annuler
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
