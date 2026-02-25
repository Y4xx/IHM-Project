<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSeanceRequest;
use App\Models\Cours;
use App\Models\Seance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $seances = Seance::whereHas('cours', function ($query) use ($request) {
            $query->where('enseignant_id', $request->user()->id);
        })
            ->with(['cours', 'presences'])
            ->withCount('presences')
            ->orderBy('date', 'desc')
            ->paginate(10);

        return Inertia::render('enseignant/seances/index', [
            'seances' => $seances,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $cours = Cours::where('enseignant_id', $request->user()->id)
            ->orderBy('nom')
            ->get();

        return Inertia::render('enseignant/seances/create', [
            'cours' => $cours,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSeanceRequest $request): RedirectResponse
    {
        // Vérifier que le cours appartient à l'enseignant
        $cours = Cours::findOrFail($request->validated('cours_id'));
        if ($cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à créer une séance pour ce cours.');
        }

        $seance = Seance::create($request->validated());

        return redirect()->route('enseignant.seances.show', $seance)
            ->with('success', 'La séance a été créée avec succès. Le QR code est prêt.');
    }

    /**
     * Display the specified resource with QR code.
     */
    public function show(Request $request, Seance $seance): Response
    {
        // Vérifier que l'enseignant est propriétaire du cours
        if ($seance->cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à voir cette séance.');
        }

        $seance->load(['cours', 'presences.etudiant']);

        // Récupérer les statistiques
        $stats = [
            'total' => $seance->presences->count(),
            'presents' => $seance->presences->where('statut', 'present')->count(),
            'retards' => $seance->presences->where('statut', 'retard')->count(),
            'absents' => $seance->presences->where('statut', 'absent')->count(),
        ];

        // Générer l'URL pour le QR code
        $qrUrl = route('pointage.scan', ['token' => $seance->qr_token]);

        return Inertia::render('enseignant/seances/show', [
            'seance' => $seance,
            'stats' => $stats,
            'qrUrl' => $qrUrl,
            'qrToken' => $seance->qr_token,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Seance $seance): Response
    {
        if ($seance->cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à modifier cette séance.');
        }

        $cours = Cours::where('enseignant_id', $request->user()->id)
            ->orderBy('nom')
            ->get();

        return Inertia::render('enseignant/seances/edit', [
            'seance' => $seance->load('cours'),
            'cours' => $cours,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreSeanceRequest $request, Seance $seance): RedirectResponse
    {
        if ($seance->cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à modifier cette séance.');
        }

        $seance->update($request->validated());

        return redirect()->route('enseignant.seances.show', $seance)
            ->with('success', 'La séance a été mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Seance $seance): RedirectResponse
    {
        if ($seance->cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à supprimer cette séance.');
        }

        $seance->delete();

        return redirect()->route('enseignant.seances.index')
            ->with('success', 'La séance a été supprimée avec succès.');
    }

    /**
     * Régénérer le QR code d'une séance.
     */
    public function regenerateQr(Request $request, Seance $seance): RedirectResponse
    {
        if ($seance->cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à régénérer le QR code.');
        }

        $seance->update([
            'qr_token' => \Illuminate\Support\Str::random(64),
        ]);

        return redirect()->route('enseignant.seances.show', $seance)
            ->with('success', 'Le QR code a été régénéré avec succès.');
    }

    /**
     * Basculer l'état actif/inactif d'une séance.
     */
    public function toggleActive(Request $request, Seance $seance): RedirectResponse
    {
        if ($seance->cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à modifier cette séance.');
        }

        $seance->update([
            'active' => ! $seance->active,
        ]);

        $message = $seance->active
            ? 'La séance a été activée.'
            : 'La séance a été désactivée.';

        return redirect()->back()->with('success', $message);
    }

    /**
     * Afficher la liste des présences pour une séance.
     */
    public function presences(Request $request, Seance $seance): Response
    {
        if ($seance->cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à voir les présences.');
        }

        $seance->load(['cours', 'presences.etudiant']);

        return Inertia::render('enseignant/seances/presences', [
            'seance' => $seance,
            'presences' => $seance->presences,
        ]);
    }
}
