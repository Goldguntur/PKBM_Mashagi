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
            'name' => 'Pak Kepala',
            'username' => 'kepsek01',
            'email' => 'kepala@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081234567890',
            'nisn' => null,
            'nik' => '3276012309870001',
            'role' => 'kepalaSekolah',
            'kelas_id' => null,
        ]);

        User::create([
            'name' => 'Bu TU',
            'username' => 'tuperson',
            'email' => 'tu@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081234567891',
            'nisn' => null,
            'nik' => '3276012309870002',
            'role' => 'tenagaPendidik',
            'kelas_id' => null,
        ]);

        $guru = User::create([
            'name' => 'Pak Adrian',
            'username' => 'guru01',
            'email' => 'guru@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081234567892',
            'nisn' => null,
            'nik' => '3276012309870003',
            'role' => 'guru',
            'absensi_guruTendik' => false,
            'kelas_id' => null,
        ]);
        $guru->mapels()->attach([1, 2]);

        $guruManager = User::create([
    'name' => 'Pak Rizki',
    'username' => 'guruManager',
    'email' => 'gurumanager@example.com',
    'password' => Hash::make('password123'),
    'no_wa' => '081234567896',
    'nisn' => null,
    'nik' => '3276012309870005',
    'role' => 'guru',
    'kelas_id' => null,
    'absensi_guruTendik' => true, 
        ]);
        $guruManager->mapels()->attach([1]);

        $guruKeluar = User::create([
            'name' => 'Miss Tia',
            'username' => 'guruKeluar',
            'email' => 'gurukeluar@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081234567899',
            'nisn' => null,
            'nik' => '3276012309870004',
            'role' => 'guru',
            'absensi_guruTendik' => false,
            'kelas_id' => null,
        ]);
        $guruKeluar->mapels()->attach([3]);

        User::create([
            'name' => 'Siswa A',
            'username' => 'murid01',
            'email' => 'murid01@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081234567893',
            'nisn' => '20230101',
            'role' => 'pesertaDidik',
            'kelas_id' => 1, 
        ]);

        User::create([
            'name' => 'Siswa B',
            'username' => 'murid02',
            'email' => 'murid02@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081234567894',
            'nisn' => '10230102',
            'role' => 'pesertaDidik',
            'kelas_id' => 4, // Paket B Kelas 7
        ]);

        // Murid untuk lulus
        User::create([
            'name' => 'Siswa C',
            'username' => 'murid03',
            'email' => 'murid03@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081234567895',
            'nisn' => '20230103',
            'role' => 'pesertaDidik',
            'kelas_id' => 7, // Paket C Kelas 10
        ]);

        // Murid untuk keluar
        User::create([
            'name' => 'Siswa D',
            'username' => 'murid04',
            'email' => 'murid04@example.com',
            'password' => Hash::make('password123'),
            'no_wa' => '081234561125',
            'nisn' => '20230104',
            'role' => 'pesertaDidik',
            'kelas_id' => 7, // Paket C Kelas 10
        ]);
    }
}