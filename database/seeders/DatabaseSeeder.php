<?php

namespace Database\Seeders;

use App\Models\Cours;
use App\Models\Presence;
use App\Models\Seance;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer un administrateur
        User::factory()->create([
            'name' => 'Administrateur',
            'email' => 'admin@universite.ma',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Créer un enseignant
        $enseignant = User::factory()->create([
            'name' => 'Dr. Mohammed Alami',
            'email' => 'enseignant@universite.ma',
            'password' => bcrypt('password'),
            'role' => 'enseignant',
        ]);

        // Créer un deuxième enseignant
        $enseignant2 = User::factory()->create([
            'name' => 'Prof. Fatima Benali',
            'email' => 'fatima.benali@universite.ma',
            'password' => bcrypt('password'),
            'role' => 'enseignant',
        ]);

        // Créer des étudiants
        $etudiant1 = User::factory()->create([
            'name' => 'Ahmed Tazi',
            'email' => 'etudiant@universite.ma',
            'password' => bcrypt('password'),
            'role' => 'etudiant',
        ]);

        $etudiant2 = User::factory()->create([
            'name' => 'Sara Rachidi',
            'email' => 'sara.rachidi@universite.ma',
            'password' => bcrypt('password'),
            'role' => 'etudiant',
        ]);

        $etudiant3 = User::factory()->create([
            'name' => 'Youssef Berrada',
            'email' => 'youssef.berrada@universite.ma',
            'password' => bcrypt('password'),
            'role' => 'etudiant',
        ]);

        // Créer des cours
        $cours1 = Cours::create([
            'nom' => 'Mathématiques Avancées',
            'description' => 'Cours de mathématiques pour le semestre 1',
            'enseignant_id' => $enseignant->id,
        ]);

        $cours2 = Cours::create([
            'nom' => 'Programmation Web',
            'description' => 'Introduction au développement web moderne',
            'enseignant_id' => $enseignant->id,
        ]);

        $cours3 = Cours::create([
            'nom' => 'Base de données',
            'description' => 'Conception et gestion des bases de données',
            'enseignant_id' => $enseignant2->id,
        ]);

        // Créer des séances
        $seance1 = Seance::create([
            'cours_id' => $cours1->id,
            'date' => now()->format('Y-m-d'),
            'heure_debut' => '08:00',
            'heure_fin' => '10:00',
            'active' => true,
        ]);

        $seance2 = Seance::create([
            'cours_id' => $cours2->id,
            'date' => now()->format('Y-m-d'),
            'heure_debut' => '10:00',
            'heure_fin' => '12:00',
            'active' => true,
        ]);

        $seance3 = Seance::create([
            'cours_id' => $cours1->id,
            'date' => now()->addDays(1)->format('Y-m-d'),
            'heure_debut' => '14:00',
            'heure_fin' => '16:00',
            'active' => true,
        ]);

        // Créer des présences de démonstration
        Presence::create([
            'etudiant_id' => $etudiant1->id,
            'seance_id' => $seance1->id,
            'statut' => 'present',
            'latitude' => 33.225410,
            'longitude' => -8.486408,
            'distance' => 50.25,
            'scanne_le' => now()->subHours(2),
        ]);

        Presence::create([
            'etudiant_id' => $etudiant2->id,
            'seance_id' => $seance1->id,
            'statut' => 'retard',
            'latitude' => 33.225500,
            'longitude' => -8.486500,
            'distance' => 75.50,
            'scanne_le' => now()->subHours(1)->subMinutes(45),
        ]);

        Presence::create([
            'etudiant_id' => $etudiant3->id,
            'seance_id' => $seance1->id,
            'statut' => 'absent',
            'latitude' => null,
            'longitude' => null,
            'distance' => null,
            'scanne_le' => null,
        ]);

        Presence::create([
            'etudiant_id' => $etudiant1->id,
            'seance_id' => $seance2->id,
            'statut' => 'present',
            'latitude' => 33.225410,
            'longitude' => -8.486408,
            'distance' => 45.00,
            'scanne_le' => now()->subMinutes(30),
        ]);
    }
}
