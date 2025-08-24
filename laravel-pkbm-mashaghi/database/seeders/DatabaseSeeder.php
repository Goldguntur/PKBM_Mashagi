<?php

namespace Database\Seeders;

use App\Models\HistoriMutasi;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            KelasSeeder::class,
            MapelSeeder::class,
            UserSeeder::class,
            MutasiSeeder::class,
            HistoriMutasiSeeder::class
        ]);
    }

}