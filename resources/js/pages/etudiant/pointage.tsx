import { Head } from '@inertiajs/react';
import { 
    MapPin, 
    QrCode, 
    CheckCircle2, 
    XCircle, 
    Loader2,
    AlertCircle,
    Navigation,
    Clock
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pointage',
        href: '/pointage',
    },
];

interface Props {
    token?: string;
    universiteLat: number;
    universiteLon: number;
    universiteRayon: number;
}

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    loading: boolean;
    error: string | null;
}

interface PointageResult {
    success: boolean;
    message: string;
    statut?: 'present' | 'retard';
    seance?: {
        id: number;
        cours: string;
        date: string;
        heure: string;
    };
    distance?: number;
}

// Fonction Haversine pour calculer la distance
function calculerDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Rayon de la Terre en mètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

export default function Pointage({ token, universiteLat, universiteLon, universiteRayon }: Props) {
    const [qrToken, setQrToken] = useState(token || '');
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        loading: true,
        error: null,
    });
    const [distance, setDistance] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<PointageResult | null>(null);

    const estDansLeRayon = distance !== null && distance <= universiteRayon;

    // Obtenir la position GPS
    const getLocation = useCallback(() => {
        setLocation(prev => ({ ...prev, loading: true, error: null }));

        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                loading: false,
                error: 'La géolocalisation n\'est pas supportée par votre navigateur.',
            }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setLocation({
                    latitude,
                    longitude,
                    accuracy,
                    loading: false,
                    error: null,
                });

                // Calculer la distance
                const dist = calculerDistance(latitude, longitude, universiteLat, universiteLon);
                setDistance(Math.round(dist));
            },
            (error) => {
                let errorMessage = 'Impossible d\'obtenir votre position.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Veuillez autoriser l\'accès à votre position dans les paramètres du navigateur.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Information de position non disponible.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'La demande de position a expiré.';
                        break;
                }
                setLocation({
                    latitude: null,
                    longitude: null,
                    accuracy: null,
                    loading: false,
                    error: errorMessage,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [universiteLat, universiteLon]);

    useEffect(() => {
        getLocation();
        
        // Mettre à jour la position toutes les 5 secondes
        const interval = setInterval(getLocation, 5000);
        return () => clearInterval(interval);
    }, [getLocation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!qrToken || !location.latitude || !location.longitude) {
            return;
        }

        setIsSubmitting(true);
        setResult(null);

        try {
            const response = await fetch('/pointage/valider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    qr_token: qrToken,
                    latitude: location.latitude,
                    longitude: location.longitude,
                }),
            });

            const data = await response.json();
            setResult(data);
        } catch {
            setResult({
                success: false,
                message: 'Une erreur est survenue. Veuillez réessayer.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pointage - Scanner QR Code" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground">
                        Enregistrer votre présence
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Scannez le QR code affiché par votre enseignant
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto w-full">
                    {/* Carte de localisation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Votre localisation
                            </CardTitle>
                            <CardDescription>
                                Vous devez être à moins de {universiteRayon}m de l'université
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {location.loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <span className="ml-2">Obtention de votre position...</span>
                                </div>
                            ) : location.error ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Erreur de localisation</AlertTitle>
                                    <AlertDescription>{location.error}</AlertDescription>
                                </Alert>
                            ) : (
                                <>
                                    {/* Indicateur de distance */}
                                    <div className={`rounded-lg p-6 text-center ${
                                        estDansLeRayon 
                                            ? 'bg-green-50 dark:bg-green-950 border-2 border-green-500' 
                                            : 'bg-red-50 dark:bg-red-950 border-2 border-red-500'
                                    }`}>
                                        <div className="flex justify-center mb-4">
                                            {estDansLeRayon ? (
                                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                                            ) : (
                                                <XCircle className="h-16 w-16 text-red-500" />
                                            )}
                                        </div>
                                        <p className={`text-lg font-semibold ${
                                            estDansLeRayon ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                                        }`}>
                                            {estDansLeRayon 
                                                ? 'Vous êtes dans le périmètre autorisé' 
                                                : 'Vous êtes en dehors du périmètre'}
                                        </p>
                                        <div className="mt-4 flex items-center justify-center gap-2">
                                            <Navigation className="h-5 w-5" />
                                            <span className="text-3xl font-bold">{distance}m</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Distance jusqu'à l'université
                                            {!estDansLeRayon && ` (max: ${universiteRayon}m)`}
                                        </p>
                                    </div>

                                    <Button 
                                        variant="outline" 
                                        onClick={getLocation} 
                                        className="w-full"
                                    >
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Actualiser ma position
                                    </Button>

                                    {location.accuracy && (
                                        <p className="text-xs text-muted-foreground text-center">
                                            Précision: ±{Math.round(location.accuracy)}m
                                        </p>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Carte de scan QR */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="h-5 w-5" />
                                Code QR
                            </CardTitle>
                            <CardDescription>
                                Entrez le code affiché ou scannez le QR code
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="qr_token" className="text-sm font-medium">
                                        Token QR Code
                                    </label>
                                    <Input
                                        id="qr_token"
                                        type="text"
                                        value={qrToken}
                                        onChange={(e) => setQrToken(e.target.value)}
                                        placeholder="Entrez le token du QR code..."
                                        className="font-mono text-sm"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Le token se trouve sous le QR code affiché par l'enseignant
                                    </p>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    size="lg"
                                    disabled={
                                        isSubmitting || 
                                        !qrToken || 
                                        !location.latitude || 
                                        !estDansLeRayon
                                    }
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Validation en cours...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Valider ma présence
                                        </>
                                    )}
                                </Button>

                                {!estDansLeRayon && !location.loading && !location.error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Vous devez être à l'intérieur de l'université pour valider votre présence.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </form>

                            {/* Résultat */}
                            {result && (
                                <div className="mt-6">
                                    <Alert variant={result.success ? "default" : "destructive"} className={
                                        result.success 
                                            ? result.statut === 'retard' 
                                                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' 
                                                : 'border-green-500 bg-green-50 dark:bg-green-950'
                                            : ''
                                    }>
                                        {result.success ? (
                                            result.statut === 'retard' ? (
                                                <Clock className="h-4 w-4 text-yellow-500" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            )
                                        ) : (
                                            <XCircle className="h-4 w-4" />
                                        )}
                                        <AlertTitle>
                                            {result.success 
                                                ? result.statut === 'retard' 
                                                    ? 'Présence enregistrée (Retard)' 
                                                    : 'Présence validée !'
                                                : 'Erreur'
                                            }
                                        </AlertTitle>
                                        <AlertDescription>
                                            {result.message}
                                            {result.seance && (
                                                <div className="mt-2 text-sm">
                                                    <p><strong>Cours:</strong> {result.seance.cours}</p>
                                                    <p><strong>Date:</strong> {result.seance.date}</p>
                                                    <p><strong>Horaire:</strong> {result.seance.heure}</p>
                                                </div>
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Information */}
                <Card className="max-w-4xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle className="text-sm">Comment ça marche ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Assurez-vous d'être <strong>physiquement présent</strong> dans l'université</li>
                            <li>Autorisez l'accès à votre <strong>localisation GPS</strong></li>
                            <li>Scannez le <strong>QR code</strong> affiché par votre enseignant ou entrez le token</li>
                            <li>Cliquez sur <strong>"Valider ma présence"</strong></li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
