<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCoursRequest;
use App\Models\Cours;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CoursController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $cours = Cours::where('enseignant_id', $request->user()->id)
            ->withCount('seances')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('enseignant/cours/index', [
            'cours' => $cours,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('enseignant/cours/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCoursRequest $request): RedirectResponse
    {
        Cours::create([
            'nom' => $request->validated('nom'),
            'description' => $request->validated('description'),
            'enseignant_id' => $request->user()->id,
        ]);

        return redirect()->route('enseignant.cours.index')
            ->with('success', 'Le cours a été créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Cours $cours): Response
    {
        // Vérifier que l'enseignant est propriétaire du cours
        if ($cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à voir ce cours.');
        }

        $cours->load(['seances' => function ($query) {
            $query->withCount('presences')->orderBy('date', 'desc');
        }]);

        return Inertia::render('enseignant/cours/show', [
            'cours' => $cours,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Cours $cours): Response
    {
        if ($cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à modifier ce cours.');
        }

        return Inertia::render('enseignant/cours/edit', [
            'cours' => $cours,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreCoursRequest $request, Cours $cours): RedirectResponse
    {
        if ($cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à modifier ce cours.');
        }

        $cours->update([
            'nom' => $request->validated('nom'),
            'description' => $request->validated('description'),
        ]);

        return redirect()->route('enseignant.cours.index')
            ->with('success', 'Le cours a été mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Cours $cours): RedirectResponse
    {
        if ($cours->enseignant_id !== $request->user()->id) {
            abort(403, 'Vous n\'êtes pas autorisé à supprimer ce cours.');
        }

        $cours->delete();

        return redirect()->route('enseignant.cours.index')
            ->with('success', 'Le cours a été supprimé avec succès.');
    }
}
