<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Klein Moretti',
            'username' => 'klein01',
            'email' => 'klein@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111111',
            'nisn' => null,
            'nik' => '3276012309871001',
            'role' => 'kepalaSekolah',
            'kelas_id' => null,
        ]);

        User::create([
            'name' => 'Daly Simon',
            'username' => 'tu_daly',
            'email' => 'daly@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111112',
            'nisn' => null,
            'nik' => '3276012309871002',
            'role' => 'tenagaPendidik',
            'kelas_id' => null,
        ]);

        $guru1 = User::create([
            'name' => 'Roselle Gustav',
            'username' => 'guru_roselle',
            'email' => 'roselle@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111113',
            'nisn' => null,
            'nik' => '3276012309871003',
            'role' => 'guru',
            'absensi_guruTendik' => true,
        ]);
        $guru1->mapels()->attach([1, 2]); 
        $guru1->kelasMengajar()->attach([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        $guru2 = User::create([
            'name' => 'Zaratul',
            'username' => 'guru_zaratul',
            'email' => 'zaratul@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111114',
            'nisn' => null,
            'nik' => '3276012309871004',
            'role' => 'guru',
            'absensi_guruTendik' => false,
            'kelas_id' => null,
        ]);
        $guru2->mapels()->attach([3]); // IPS

        $guru3 = User::create([
            'name' => 'Hermes',
            'username' => 'guru_hermes',
            'email' => 'hermes@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111115',
            'nisn' => null,
            'nik' => '3276012309871005',
            'role' => 'guru',
            'absensi_guruTendik' => false,
            'kelas_id' => null,
        ]);
        $guru3->mapels()->attach([4, 5]);

        $guru4 = User::create([
            'name' => 'Amon',
            'username' => 'guru_amon',
            'email' => 'amon@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081111111116',
            'nisn' => null,
            'nik' => '3276012309871006',
            'role' => 'guru',
            'absensi_guruTendik' => false,
            'kelas_id' => null,
        ]);
        $guru4->mapels()->attach([6]); // Agama

        // ==== SISWA ====
        $siswas = [
            'Audrey Hall',
            'Alger Wilson',
            'Cattleya',
            'Leonard Mitchell',
            'Fors Wall',
            'Xio Derecha',
            'Emlyn White',
            'Sharron',
            'Danitz',
            'Anderson Hood',
            'Will Auceptin',
            'Miss Justice',
            'Mr Hanged Man',
            'Mr World',
            'Miss Magician',
            'Mr Tower',
            'Miss Moon',
            'Mr Sun',
            'Miss Hermit',
        ];

        $i = 1;
        foreach ($siswas as $s) {
            User::create([
                'name' => $s,
                'username' => 'murid' . $i,
                'email' => 'murid' . $i . '@example.com',
                'password' => Hash::make('password123'),
                'no_wa' => '0811111111' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'nisn' => '20230' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'role' => 'pesertaDidik',
                'kelas_id' => rand(1, 9), // random kelas
            ]);
            $i++;
        }
    }
}