<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Seance extends Model
{
    protected $fillable = [
        'cours_id',
        'date',
        'heure_debut',
        'heure_fin',
        'qr_token',
        'active',
    ];

    protected $casts = [
        'date' => 'date',
        'active' => 'boolean',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($seance) {
            if (empty($seance->qr_token)) {
                $seance->qr_token = Str::random(64);
            }
        });
    }

    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class);
    }

    public function presences(): HasMany
    {
        return $this->hasMany(Presence::class);
    }

    /**
     * Vérifie si la séance est actuellement active (dans la plage horaire)
     */
    public function estActive(): bool
    {
        if (! $this->active) {
            return false;
        }

        $now = now();
        $dateSeance = $this->date->format('Y-m-d');
        $heureDebut = $dateSeance.' '.$this->heure_debut;
        $heureFin = $dateSeance.' '.$this->heure_fin;

        return $now->between($heureDebut, $heureFin);
    }

    /**
     * Vérifie si l'étudiant est en retard (plus de 15 minutes après le début)
     */
    public function estEnRetard(): bool
    {
        $now = now();
        $dateSeance = $this->date->format('Y-m-d');
        $heureDebut = \Carbon\Carbon::parse($dateSeance.' '.$this->heure_debut);

        return $now->diffInMinutes($heureDebut) > 15;
    }
}
