<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kelas;

class KelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['nama_kelas' => 'Paket A Fase A'],
            ['nama_kelas' => 'Paket A Fase B'],
            ['nama_kelas' => 'Paket A Fase C'],
            ['nama_kelas' => 'Paket B Kelas 7'],
            ['nama_kelas' => 'Paket B Kelas 8'],
            ['nama_kelas' => 'Paket B Kelas 9'],
            ['nama_kelas' => 'Paket C Kelas 10'],
            ['nama_kelas' => 'Paket C Kelas 11'],
            ['nama_kelas' => 'Paket C Kelas 12'],
        ];

        Kelas::insert($data);
    }
}