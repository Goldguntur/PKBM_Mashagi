<?php

namespace Database\Seeders;

use App\Models\Kelas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Kelas::create(['nama' => 'paketA_faseA', 'tingkat' => 'A']);
        Kelas::create(['nama' => 'paketA_faseB', 'tingkat' => 'B']);
        Kelas::create(['nama' => 'paketA_faseC', 'tingkat' => 'C']);
        Kelas::create(['nama' => 'paketB_kelas7', 'tingkat' => '7']);
        Kelas::create(['nama' => 'paketB_kelas8', 'tingkat' => '8']);
        Kelas::create(['nama' => 'paketB_kelas9', 'tingkat' => '9']);
        Kelas::create(['nama' => 'paketC_kelas10', 'tingkat' => '10']);
        Kelas::create(['nama' => 'paketC_kelas11', 'tingkat' => '11']);
        Kelas::create(['nama' => 'paketC_kelas12', 'tingkat' => '12']);
    }
}
