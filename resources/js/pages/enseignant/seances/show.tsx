import { Head, Link, router } from '@inertiajs/react';
import { 
    Calendar, 
    ArrowLeft,
    QrCode,
    RefreshCw,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    Copy,
    Download,
    ToggleLeft,
    ToggleRight,
    MapPin
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import type { BreadcrumbItem, Seance, PresenceStats } from '@/types';

interface Props {
    seance: Seance;
    stats: PresenceStats;
    qrUrl: string;
    qrToken: string;
}

export default function ShowSeance({ seance, stats, qrUrl, qrToken }: Props) {
    const [copied, setCopied] = useState(false);

    // Generate QR code URL using useMemo
    const qrImageUrl = useMemo(() => {
        const qrData = encodeURIComponent(qrUrl);
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
    }, [qrUrl]);

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
            title: `Séance du ${seance.date}`,
            href: `/enseignant/seances/${seance.id}`,
        },
    ];

    const handleCopyToken = () => {
        navigator.clipboard.writeText(qrToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerateQr = () => {
        if (confirm('Êtes-vous sûr de vouloir régénérer le QR code ? L\'ancien code sera invalidé.')) {
            router.post(`/enseignant/seances/${seance.id}/regenerate-qr`);
        }
    };

    const handleToggleActive = () => {
        router.post(`/enseignant/seances/${seance.id}/toggle-active`);
    };

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

    const tauxPresence = stats.total > 0 
        ? Math.round(((stats.presents + stats.retards) / stats.total) * 100) 
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Séance - ${seance.cours?.nom}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                                {seance.cours?.nom}
                            </h1>
                            <p className="text-muted-foreground">
                                {seance.date} • {seance.heure_debut} - {seance.heure_fin}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge 
                            variant={seance.active ? "default" : "secondary"}
                            className="text-sm"
                        >
                            {seance.active ? 'Séance active' : 'Séance inactive'}
                        </Badge>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleToggleActive}
                            className="gap-1"
                        >
                            {seance.active ? (
                                <>
                                    <ToggleRight className="h-4 w-4" />
                                    Désactiver
                                </>
                            ) : (
                                <>
                                    <ToggleLeft className="h-4 w-4" />
                                    Activer
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* QR Code */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="h-5 w-5" />
                                QR Code de la séance
                            </CardTitle>
                            <CardDescription>
                                Affichez ce QR code pour que les étudiants puissent marquer leur présence
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!seance.active && (
                                <Alert variant="destructive">
                                    <AlertTitle>Séance inactive</AlertTitle>
                                    <AlertDescription>
                                        Cette séance est actuellement inactive. Les étudiants ne pourront pas marquer leur présence.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* QR Code Display */}
                            <div className="flex justify-center p-4 bg-white rounded-lg border">
                                <div className="text-center">
                                    <img 
                                        src={qrImageUrl} 
                                        alt="QR Code" 
                                        className="mx-auto"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        Scannez ce QR code avec votre téléphone
                                    </p>
                                </div>
                            </div>

                            {/* Token */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Token (pour saisie manuelle)</label>
                                <div className="flex gap-2">
                                    <code className="flex-1 p-2 bg-muted rounded text-xs font-mono truncate">
                                        {qrToken}
                                    </code>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={handleCopyToken}
                                    >
                                        {copied ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={handleRegenerateQr}
                                    className="flex-1 gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Régénérer
                                </Button>
                                <a href={qrImageUrl} download={`qr-seance-${seance.id}.png`}>
                                    <Button variant="outline" className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Télécharger
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistiques */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Statistiques de présence
                            </CardTitle>
                            <CardDescription>
                                Vue d'ensemble des présences pour cette séance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-green-600">{stats.presents}</p>
                                    <p className="text-sm text-muted-foreground">Présents</p>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                                    <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-yellow-600">{stats.retards}</p>
                                    <p className="text-sm text-muted-foreground">Retards</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-red-600">{stats.absents}</p>
                                    <p className="text-sm text-muted-foreground">Absents</p>
                                </div>
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                </div>
                            </div>

                            {stats.total > 0 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Taux de présence</span>
                                        <span className="font-bold">{tauxPresence}%</span>
                                    </div>
                                    <Progress value={tauxPresence} className="h-3" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Liste des présences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des présences</CardTitle>
                        <CardDescription>
                            Étudiants ayant marqué leur présence
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!seance.presences || seance.presences.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    Aucune présence enregistrée pour cette séance.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Étudiant</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead>Distance</TableHead>
                                            <TableHead>Heure de scan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {seance.presences.map((presence) => (
                                            <TableRow key={presence.id}>
                                                <TableCell className="font-medium">
                                                    {presence.etudiant?.name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {presence.etudiant?.email}
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
                                                <TableCell className="text-muted-foreground">
                                                    {presence.scanne_le 
                                                        ? new Date(presence.scanne_le).toLocaleString('fr-FR')
                                                        : '-'
                                                    }
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
