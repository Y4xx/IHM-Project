<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users are redirected to their role-specific dashboard', function () {
    // Test student redirect
    $student = User::factory()->create(['role' => 'etudiant']);
    $this->actingAs($student);
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('etudiant.dashboard'));

    // Test teacher redirect
    $teacher = User::factory()->create(['role' => 'enseignant']);
    $this->actingAs($teacher);
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('enseignant.dashboard'));

    // Test admin redirect
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('admin.dashboard'));
});

test('students can access their dashboard', function () {
    $student = User::factory()->create(['role' => 'etudiant']);
    $this->actingAs($student);
    $response = $this->get(route('etudiant.dashboard'));
    $response->assertOk();
});

test('teachers can access their dashboard', function () {
    $teacher = User::factory()->create(['role' => 'enseignant']);
    $this->actingAs($teacher);
    $response = $this->get(route('enseignant.dashboard'));
    $response->assertOk();
});

test('admins can access their dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);
    $response = $this->get(route('admin.dashboard'));
    $response->assertOk();
});
