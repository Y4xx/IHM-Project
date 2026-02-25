<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seance_id')->constrained('seances')->onDelete('cascade');
            $table->enum('statut', ['present', 'absent', 'retard'])->default('absent');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->decimal('distance', 8, 2)->nullable(); // distance en mètres
            $table->timestamp('scanne_le')->nullable();
            $table->timestamps();

            $table->unique(['etudiant_id', 'seance_id']);
            $table->index('etudiant_id');
            $table->index('seance_id');
            $table->index('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
