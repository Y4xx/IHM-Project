<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Presence;
use App\Models\Seance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardController extends Controller
{
    /**
     * Dashboard pour les étudiants.
     */
    public function etudiant(Request $request): Response
    {
        $user = $request->user();

        // Présences récentes
        $presencesRecentes = Presence::where('etudiant_id', $user->id)
            ->with(['seance.cours'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Statistiques
        $totalPresences = Presence::where('etudiant_id', $user->id)->count();
        $presents = Presence::where('etudiant_id', $user->id)
            ->where('statut', 'present')->count();
        $retards = Presence::where('etudiant_id', $user->id)
            ->where('statut', 'retard')->count();
        $absents = Presence::where('etudiant_id', $user->id)
            ->where('statut', 'absent')->count();

        $tauxPresence = $totalPresences > 0
            ? round((($presents + $retards) / $totalPresences) * 100, 1)
            : 0;

        return Inertia::render('etudiant/dashboard', [
            'presencesRecentes' => $presencesRecentes,
            'stats' => [
                'total' => $totalPresences,
                'presents' => $presents,
                'retards' => $retards,
                'absents' => $absents,
                'tauxPresence' => $tauxPresence,
            ],
        ]);
    }

    /**
     * Dashboard pour les enseignants.
     */
    public function enseignant(Request $request): Response
    {
        $user = $request->user();

        // Cours de l'enseignant
        $cours = Cours::where('enseignant_id', $user->id)
            ->withCount('seances')
            ->get();

        // Séances récentes
        $seancesRecentes = Seance::whereHas('cours', function ($query) use ($user) {
            $query->where('enseignant_id', $user->id);
        })
            ->with(['cours', 'presences'])
            ->withCount('presences')
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        // Statistiques globales
        $totalSeances = Seance::whereHas('cours', function ($query) use ($user) {
            $query->where('enseignant_id', $user->id);
        })->count();

        $totalPresences = Presence::whereHas('seance.cours', function ($query) use ($user) {
            $query->where('enseignant_id', $user->id);
        })->count();

        $presentsCount = Presence::whereHas('seance.cours', function ($query) use ($user) {
            $query->where('enseignant_id', $user->id);
        })->where('statut', 'present')->count();

        $tauxPresence = $totalPresences > 0
            ? round(($presentsCount / $totalPresences) * 100, 1)
            : 0;

        return Inertia::render('enseignant/dashboard', [
            'cours' => $cours,
            'seancesRecentes' => $seancesRecentes,
            'stats' => [
                'totalCours' => $cours->count(),
                'totalSeances' => $totalSeances,
                'totalPresences' => $totalPresences,
                'tauxPresence' => $tauxPresence,
            ],
        ]);
    }

    /**
     * Dashboard pour les administrateurs.
     */
    public function admin(Request $request): Response
    {
        // Statistiques globales
        $totalEtudiants = User::where('role', 'etudiant')->count();
        $totalEnseignants = User::where('role', 'enseignant')->count();
        $totalCours = Cours::count();
        $totalSeances = Seance::count();
        $totalPresences = Presence::count();

        // Taux de présence global
        $presentsCount = Presence::where('statut', 'present')->count();
        $retardsCount = Presence::where('statut', 'retard')->count();
        $absentsCount = Presence::where('statut', 'absent')->count();

        $tauxPresenceGlobal = $totalPresences > 0
            ? round((($presentsCount + $retardsCount) / $totalPresences) * 100, 1)
            : 0;

        // Statistiques par cours
        $coursStats = Cours::withCount(['seances'])
            ->with(['enseignant', 'seances.presences'])
            ->get()
            ->map(function ($cours) {
                $presences = $cours->seances->flatMap->presences;
                $total = $presences->count();
                $presents = $presences->where('statut', 'present')->count();
                $retards = $presences->where('statut', 'retard')->count();

                return [
                    'id' => $cours->id,
                    'nom' => $cours->nom,
                    'enseignant' => $cours->enseignant->name,
                    'totalSeances' => $cours->seances_count,
                    'totalPresences' => $total,
                    'tauxPresence' => $total > 0 ? round((($presents + $retards) / $total) * 100, 1) : 0,
                ];
            });

        // Séances récentes
        $seancesRecentes = Seance::with(['cours.enseignant'])
            ->withCount('presences')
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalEtudiants' => $totalEtudiants,
                'totalEnseignants' => $totalEnseignants,
                'totalCours' => $totalCours,
                'totalSeances' => $totalSeances,
                'totalPresences' => $totalPresences,
                'tauxPresenceGlobal' => $tauxPresenceGlobal,
                'presents' => $presentsCount,
                'retards' => $retardsCount,
                'absents' => $absentsCount,
            ],
            'coursStats' => $coursStats,
            'seancesRecentes' => $seancesRecentes,
        ]);
    }

    /**
     * Exporter les données en CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $presences = Presence::with(['etudiant', 'seance.cours'])
            ->orderBy('scanne_le', 'desc')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="presences_'.date('Y-m-d_H-i-s').'.csv"',
        ];

        return response()->stream(function () use ($presences) {
            $handle = fopen('php://output', 'w');

            // BOM for UTF-8
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // En-têtes
            fputcsv($handle, [
                'Étudiant',
                'Email',
                'Cours',
                'Date',
                'Heure début',
                'Heure fin',
                'Statut',
                'Distance (m)',
                'Scanné le',
            ], ';');

            foreach ($presences as $presence) {
                fputcsv($handle, [
                    $presence->etudiant->name,
                    $presence->etudiant->email,
                    $presence->seance->cours->nom,
                    $presence->seance->date->format('d/m/Y'),
                    $presence->seance->heure_debut,
                    $presence->seance->heure_fin,
                    $presence->statut,
                    $presence->distance,
                    $presence->scanne_le?->format('d/m/Y H:i:s'),
                ], ';');
            }

            fclose($handle);
        }, 200, $headers);
    }
}
