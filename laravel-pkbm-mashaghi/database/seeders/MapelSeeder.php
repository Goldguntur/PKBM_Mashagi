<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mapel;

class MapelSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['kode_mapel' => 'MAT', 'nama_mapel' => 'Matematika'],
            ['kode_mapel' => 'IPA', 'nama_mapel' => 'IPA'],
            ['kode_mapel' => 'IPS', 'nama_mapel' => 'IPS'],
            ['kode_mapel' => 'BIN', 'nama_mapel' => 'Bahasa Indonesia'],
            ['kode_mapel' => 'BIG', 'nama_mapel' => 'Bahasa Inggris'],
            ['kode_mapel' => 'AGM', 'nama_mapel' => 'Agama'],
        ];

        foreach ($items as $it) {
            Mapel::firstOrCreate(
                ['kode_mapel' => $it['kode_mapel']],
                ['nama_mapel' => $it['nama_mapel']]
            );
        }
    }
}