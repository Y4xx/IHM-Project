<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presence extends Model
{
    protected $fillable = [
        'etudiant_id',
        'seance_id',
        'statut',
        'latitude',
        'longitude',
        'distance',
        'scanne_le',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'distance' => 'decimal:2',
        'scanne_le' => 'datetime',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function seance(): BelongsTo
    {
        return $this->belongsTo(Seance::class);
    }
}
