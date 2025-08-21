<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Kepala Sekolah
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

        // Tenaga Pendidik (staff TU)
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

        ;

        
      
    }
}