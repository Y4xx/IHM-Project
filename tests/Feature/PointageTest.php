<?php

use App\Models\Cours;
use App\Models\Presence;
use App\Models\Seance;
use App\Models\User;
use App\Services\GeolocationService;

test('students can access pointage page', function () {
    $student = User::factory()->create(['role' => 'etudiant']);
    $this->actingAs($student);

    $response = $this->get(route('pointage.scan'));
    $response->assertOk();
});

test('teachers cannot access pointage page', function () {
    $teacher = User::factory()->create(['role' => 'enseignant']);
    $this->actingAs($teacher);

    $response = $this->get(route('pointage.scan'));
    $response->assertForbidden();
});

test('geolocation service calculates distance correctly', function () {
    $service = new GeolocationService;

    // Test with same coordinates (distance should be 0)
    $distance = $service->calculerDistance(
        GeolocationService::UNIVERSITE_LAT,
        GeolocationService::UNIVERSITE_LON,
        GeolocationService::UNIVERSITE_LAT,
        GeolocationService::UNIVERSITE_LON
    );
    expect($distance)->toBe(0.0);

    // Test location verification within radius
    $result = $service->verifierLocalisation(
        GeolocationService::UNIVERSITE_LAT,
        GeolocationService::UNIVERSITE_LON
    );
    expect($result['estDansLeRayon'])->toBeTrue();
    expect($result['distance'])->toBe(0.0);
});

test('geolocation service rejects locations outside radius', function () {
    $service = new GeolocationService;

    // Test with coordinates far away (Paris coordinates)
    $result = $service->verifierLocalisation(48.8566, 2.3522);
    expect($result['estDansLeRayon'])->toBeFalse();
});

test('student can validate presence with valid token and location', function () {
    $teacher = User::factory()->create(['role' => 'enseignant']);
    $student = User::factory()->create(['role' => 'etudiant']);

    $cours = Cours::create([
        'nom' => 'Test Course',
        'enseignant_id' => $teacher->id,
    ]);

    $seance = Seance::create([
        'cours_id' => $cours->id,
        'date' => now()->format('Y-m-d'),
        'heure_debut' => now()->subHour()->format('H:i'),
        'heure_fin' => now()->addHour()->format('H:i'),
        'active' => true,
    ]);

    $this->actingAs($student);

    $response = $this->postJson(route('pointage.valider'), [
        'qr_token' => $seance->qr_token,
        'latitude' => GeolocationService::UNIVERSITE_LAT,
        'longitude' => GeolocationService::UNIVERSITE_LON,
    ]);

    $response->assertOk();
    $response->assertJson(['success' => true]);

    $this->assertDatabaseHas('presences', [
        'etudiant_id' => $student->id,
        'seance_id' => $seance->id,
        'statut' => 'present',
    ]);
});

test('student cannot validate presence with invalid location', function () {
    $teacher = User::factory()->create(['role' => 'enseignant']);
    $student = User::factory()->create(['role' => 'etudiant']);

    $cours = Cours::create([
        'nom' => 'Test Course',
        'enseignant_id' => $teacher->id,
    ]);

    $seance = Seance::create([
        'cours_id' => $cours->id,
        'date' => now()->format('Y-m-d'),
        'heure_debut' => now()->subHour()->format('H:i'),
        'heure_fin' => now()->addHour()->format('H:i'),
        'active' => true,
    ]);

    $this->actingAs($student);

    // Try with Paris coordinates (far from university)
    $response = $this->postJson(route('pointage.valider'), [
        'qr_token' => $seance->qr_token,
        'latitude' => 48.8566,
        'longitude' => 2.3522,
    ]);

    $response->assertStatus(422);
    $response->assertJson(['success' => false]);
});

test('student cannot validate presence twice', function () {
    $teacher = User::factory()->create(['role' => 'enseignant']);
    $student = User::factory()->create(['role' => 'etudiant']);

    $cours = Cours::create([
        'nom' => 'Test Course',
        'enseignant_id' => $teacher->id,
    ]);

    $seance = Seance::create([
        'cours_id' => $cours->id,
        'date' => now()->format('Y-m-d'),
        'heure_debut' => now()->subHour()->format('H:i'),
        'heure_fin' => now()->addHour()->format('H:i'),
        'active' => true,
    ]);

    // Create existing presence
    Presence::create([
        'etudiant_id' => $student->id,
        'seance_id' => $seance->id,
        'statut' => 'present',
        'scanne_le' => now(),
    ]);

    $this->actingAs($student);

    $response = $this->postJson(route('pointage.valider'), [
        'qr_token' => $seance->qr_token,
        'latitude' => GeolocationService::UNIVERSITE_LAT,
        'longitude' => GeolocationService::UNIVERSITE_LON,
    ]);

    $response->assertStatus(422);
    $response->assertJson(['success' => false]);
});

test('teachers can create courses', function () {
    $teacher = User::factory()->create(['role' => 'enseignant']);
    $this->actingAs($teacher);

    $response = $this->post(route('enseignant.cours.store'), [
        'nom' => 'New Course',
        'description' => 'A test course',
    ]);

    $response->assertRedirect(route('enseignant.cours.index'));
    $this->assertDatabaseHas('cours', [
        'nom' => 'New Course',
        'enseignant_id' => $teacher->id,
    ]);
});

test('teachers can create sessions', function () {
    $teacher = User::factory()->create(['role' => 'enseignant']);
    $cours = Cours::create([
        'nom' => 'Test Course',
        'enseignant_id' => $teacher->id,
    ]);

    $this->actingAs($teacher);

    $response = $this->post(route('enseignant.seances.store'), [
        'cours_id' => $cours->id,
        'date' => now()->addDay()->format('Y-m-d'),
        'heure_debut' => '08:00',
        'heure_fin' => '10:00',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('seances', [
        'cours_id' => $cours->id,
    ]);
});
