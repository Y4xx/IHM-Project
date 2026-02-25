<?php

use App\Http\Controllers\CoursController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\SeanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Dashboard par défaut - redirige selon le rôle
Route::get('dashboard', function () {
    $user = auth()->user();

    if ($user->estAdmin()) {
        return redirect()->route('admin.dashboard');
    } elseif ($user->estEnseignant()) {
        return redirect()->route('enseignant.dashboard');
    } else {
        return redirect()->route('etudiant.dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

// Routes pour les étudiants
Route::middleware(['auth', 'verified', 'role:etudiant'])->prefix('etudiant')->name('etudiant.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'etudiant'])->name('dashboard');
    Route::get('historique', [PresenceController::class, 'historique'])->name('historique');
});

// Routes pour le pointage (étudiants uniquement)
Route::middleware(['auth', 'verified', 'role:etudiant'])->group(function () {
    Route::get('pointage/{token?}', [PresenceController::class, 'scanPage'])->name('pointage.scan');
    Route::post('pointage/valider', [PresenceController::class, 'valider'])->name('pointage.valider');
    Route::post('pointage/verifier-localisation', [PresenceController::class, 'verifierLocalisation'])->name('pointage.verifier-localisation');
});

// Routes pour les enseignants
Route::middleware(['auth', 'verified', 'role:enseignant'])->prefix('enseignant')->name('enseignant.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'enseignant'])->name('dashboard');

    // Gestion des cours
    Route::resource('cours', CoursController::class);

    // Gestion des séances
    Route::resource('seances', SeanceController::class);
    Route::post('seances/{seance}/regenerate-qr', [SeanceController::class, 'regenerateQr'])->name('seances.regenerate-qr');
    Route::post('seances/{seance}/toggle-active', [SeanceController::class, 'toggleActive'])->name('seances.toggle-active');
    Route::get('seances/{seance}/presences', [SeanceController::class, 'presences'])->name('seances.presences');
});

// Routes pour les administrateurs
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'admin'])->name('dashboard');
    Route::get('export-csv', [DashboardController::class, 'exportCsv'])->name('export-csv');
});

require __DIR__.'/settings.php';
