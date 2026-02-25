<?php

namespace App\Http\Controllers;

use App\Http\Requests\PointageRequest;
use App\Models\Presence;
use App\Models\Seance;
use App\Services\GeolocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PresenceController extends Controller
{
    public function __construct(
        protected GeolocationService $geolocationService
    ) {}

    /**
     * Afficher la page de scan QR pour les étudiants.
     */
    public function scanPage(Request $request, ?string $token = null): Response
    {
        return Inertia::render('etudiant/pointage', [
            'token' => $token,
            'universiteLat' => GeolocationService::UNIVERSITE_LAT,
            'universiteLon' => GeolocationService::UNIVERSITE_LON,
            'universiteRayon' => GeolocationService::UNIVERSITE_RAYON,
        ]);
    }

    /**
     * Valider la présence d'un étudiant.
     */
    public function valider(PointageRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        // 1. Vérifier la localisation côté backend (sécurité obligatoire)
        $locationCheck = $this->geolocationService->verifierLocalisation(
            $validated['latitude'],
            $validated['longitude']
        );

        if (! $locationCheck['estDansLeRayon']) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas dans le périmètre de l\'université. Distance: '.
                    round($locationCheck['distance']).' mètres (maximum autorisé: '.
                    GeolocationService::UNIVERSITE_RAYON.' mètres).',
                'distance' => $locationCheck['distance'],
            ], 422);
        }

        // 2. Vérifier que le token QR est valide
        $seance = Seance::where('qr_token', $validated['qr_token'])->first();

        if (! $seance) {
            return response()->json([
                'success' => false,
                'message' => 'Le QR code est invalide ou expiré.',
            ], 422);
        }

        // 3. Vérifier que la séance est active
        if (! $seance->active) {
            return response()->json([
                'success' => false,
                'message' => 'Cette séance n\'est plus active.',
            ], 422);
        }

        // 4. Vérifier que la séance est dans la plage horaire
        if (! $seance->estActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette séance n\'est pas en cours. Vérifiez les horaires.',
            ], 422);
        }

        // 5. Vérifier que l'étudiant n'a pas déjà pointé
        $existingPresence = Presence::where('etudiant_id', $user->id)
            ->where('seance_id', $seance->id)
            ->first();

        if ($existingPresence && $existingPresence->scanne_le) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà enregistré votre présence pour cette séance.',
            ], 422);
        }

        // 6. Déterminer le statut (présent ou retard)
        $statut = $seance->estEnRetard() ? 'retard' : 'present';

        // 7. Enregistrer ou mettre à jour la présence
        $presence = Presence::updateOrCreate(
            [
                'etudiant_id' => $user->id,
                'seance_id' => $seance->id,
            ],
            [
                'statut' => $statut,
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'distance' => $locationCheck['distance'],
                'scanne_le' => now(),
            ]
        );

        $seance->load('cours');

        $message = $statut === 'retard'
            ? 'Présence enregistrée avec retard pour '.$seance->cours->nom.'.'
            : 'Présence enregistrée avec succès pour '.$seance->cours->nom.'.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'statut' => $statut,
            'presence' => $presence,
            'seance' => [
                'id' => $seance->id,
                'cours' => $seance->cours->nom,
                'date' => $seance->date->format('d/m/Y'),
                'heure' => $seance->heure_debut.' - '.$seance->heure_fin,
            ],
        ]);
    }

    /**
     * Afficher l'historique des présences de l'étudiant.
     */
    public function historique(Request $request): Response
    {
        $presences = Presence::where('etudiant_id', $request->user()->id)
            ->with(['seance.cours'])
            ->orderBy('scanne_le', 'desc')
            ->paginate(10);

        // Calculer les statistiques
        $stats = [
            'total' => Presence::where('etudiant_id', $request->user()->id)->count(),
            'presents' => Presence::where('etudiant_id', $request->user()->id)
                ->where('statut', 'present')->count(),
            'retards' => Presence::where('etudiant_id', $request->user()->id)
                ->where('statut', 'retard')->count(),
            'absents' => Presence::where('etudiant_id', $request->user()->id)
                ->where('statut', 'absent')->count(),
        ];

        return Inertia::render('etudiant/historique', [
            'presences' => $presences,
            'stats' => $stats,
        ]);
    }

    /**
     * Vérifier la localisation (API pour le frontend).
     */
    public function verifierLocalisation(Request $request): JsonResponse
    {
        $request->validate([
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $result = $this->geolocationService->verifierLocalisation(
            $request->latitude,
            $request->longitude
        );

        return response()->json($result);
    }
}
