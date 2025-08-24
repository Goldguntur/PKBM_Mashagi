<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HistoriMutasi;
use App\Models\Mutasi;
use App\Models\User;

class HistoriMutasiSeeder extends Seeder
{
    public function run(): void
    {
        $kepsek = User::where('role', 'kepalaSekolah')->first();

        $mutasis = Mutasi::all();
        foreach ($mutasis as $mutasi) {
            HistoriMutasi::create([
                'mutasi_id' => $mutasi->id,
                'user_id' => $kepsek?->id ?? $mutasi->user_id,
                'aksi' => "Proses {$mutasi->jenis}",
                'keterangan' => "Mutasi dengan status {$mutasi->status}",
            ]);
        }

        $users = User::all();
        foreach ($users as $user) {
            $histories = HistoriMutasi::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->skip(50)
                ->take(PHP_INT_MAX)
                ->get();

            foreach ($histories as $old) {
                $old->delete();
            }
        }
    }
}