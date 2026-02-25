<?php

namespace App\Services;

class GeolocationService
{
    // Coordonnées de l'université
    public const UNIVERSITE_LAT = 33.225410;
    public const UNIVERSITE_LON = -8.486408;
    public const UNIVERSITE_RAYON = 300; // en mètres

    /**
     * Calcule la distance entre deux points en utilisant la formule de Haversine
     * 
     * @param float $lat1 Latitude du premier point
     * @param float $lon1 Longitude du premier point
     * @param float $lat2 Latitude du deuxième point
     * @param float $lon2 Longitude du deuxième point
     * @return float Distance en mètres
     */
    public function calculerDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $rayonTerre = 6371000; // Rayon de la Terre en mètres

        $lat1Rad = deg2rad($lat1);
        $lat2Rad = deg2rad($lat2);
        $deltaLat = deg2rad($lat2 - $lat1);
        $deltaLon = deg2rad($lon2 - $lon1);

        $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
             cos($lat1Rad) * cos($lat2Rad) *
             sin($deltaLon / 2) * sin($deltaLon / 2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $rayonTerre * $c;
    }

    /**
     * Vérifie si les coordonnées sont dans le rayon autorisé de l'université
     * 
     * @param float $latitude Latitude de l'utilisateur
     * @param float $longitude Longitude de l'utilisateur
     * @return array{estDansLeRayon: bool, distance: float}
     */
    public function verifierLocalisation(float $latitude, float $longitude): array
    {
        $distance = $this->calculerDistance(
            $latitude,
            $longitude,
            self::UNIVERSITE_LAT,
            self::UNIVERSITE_LON
        );

        return [
            'estDansLeRayon' => $distance <= self::UNIVERSITE_RAYON,
            'distance' => round($distance, 2),
        ];
    }
}
