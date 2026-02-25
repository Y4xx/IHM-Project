<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Vérifie si l'utilisateur est un administrateur
     */
    public function estAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifie si l'utilisateur est un enseignant
     */
    public function estEnseignant(): bool
    {
        return $this->role === 'enseignant';
    }

    /**
     * Vérifie si l'utilisateur est un étudiant
     */
    public function estEtudiant(): bool
    {
        return $this->role === 'etudiant';
    }

    /**
     * Cours enseignés par l'enseignant
     */
    public function coursEnseignes(): HasMany
    {
        return $this->hasMany(Cours::class, 'enseignant_id');
    }

    /**
     * Présences de l'étudiant
     */
    public function presences(): HasMany
    {
        return $this->hasMany(Presence::class, 'etudiant_id');
    }
}
