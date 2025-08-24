<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mutasi;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Mapel;

class MutasiSeeder extends Seeder
{
    public function run(): void
    {
        // --- Ambil user yang sudah disediakan di UserSeeder ---
    //     $muridNaik   = User::where('username', 'murid01')->first();      // kelas: Paket A Fase A
    //     $muridPindah = User::where('username', 'murid02')->first();      // kelas: Paket B Kelas 7
    //     $muridLulus  = User::where('username', 'murid03')->first();      // kelas: Paket C Kelas 10
    //     $muridKeluar = User::where('username', 'murid04')->first();      // kelas: Paket C Kelas 10

    //     $guruAktif   = User::where('username', 'guru01')->first();       // mapels: [1,2]
    //     $guruKeluar  = User::where('username', 'guruKeluar')->first();   // mapels: [3]
    //     $tendik      = User::where('username', 'tuperson')->first();

    //     // --- Ambil kelas target dari KelasSeeder ---
    //     $faseA  = Kelas::where('nama_kelas', 'Paket A Fase A')->first();
    //     $faseB  = Kelas::where('nama_kelas', 'Paket A Fase B')->first();
    //     $b7     = Kelas::where('nama_kelas', 'Paket B Kelas 7')->first();
    //     $b8     = Kelas::where('nama_kelas', 'Paket B Kelas 8')->first();
    //     $c10    = Kelas::where('nama_kelas', 'Paket C Kelas 10')->first();
    //     $c12    = Kelas::where('nama_kelas', 'Paket C Kelas 12')->first();

    //     // --- Ambil mapel dari MapelSeeder ---
    //     $mat = Mapel::where('kode_mapel', 'MAT')->first();
    //     $big = Mapel::where('kode_mapel', 'BIG')->first();
    //     $bin = Mapel::where('kode_mapel', 'BIN')->first();

    //     $created = [];

    //     // 1) Murid01 naik kelas: A->B (disetujui) -> update kelas_id
    //     if ($muridNaik && $faseA && $faseB) {
    //         $created[] = Mutasi::create([
    //             'user_id'         => $muridNaik->id,
    //             'kelas_asal_id'   => $faseA->id,
    //             'kelas_tujuan_id' => $faseB->id,
    //             'jenis'           => 'murid_naik_kelas',
    //             'status'          => 'disetujui',
    //             'alasan'          => 'Kenaikan kelas rutin',
    //         ]);
    //     }

    //     // 2) Murid02 pindah kelas: B7->B8 (pending) -> tidak ada efek
    //     if ($muridPindah && $b7 && $b8) {
    //         $created[] = Mutasi::create([
    //             'user_id'         => $muridPindah->id,
    //             'kelas_asal_id'   => $b7->id,
    //             'kelas_tujuan_id' => $b8->id,
    //             'jenis'           => 'murid_pindah_kelas',
    //             'status'          => 'disetujui',
    //             'alasan'          => 'Penyesuaian rombel',
    //         ]);
    //     }

    //     // 3) Murid03 lulus (disetujui) -> kelas_id = null
    //     if ($muridLulus && $c10) {
    //         $created[] = Mutasi::create([
    //             'user_id'         => $muridLulus->id,
    //             'kelas_asal_id'   => $c10->id,
    //             'kelas_tujuan_id' => null, // lulus => keluar dari kelas
    //             'jenis'           => 'murid_lulus',
    //             'status'          => 'disetujui',
    //             'alasan'          => 'Telah menuntaskan program',
    //         ]);
    //     }

    //     // 4) Murid04 keluar (disetujui) -> kelas_id = null
    //     if ($muridKeluar && $c10) {
    //         $created[] = Mutasi::create([
    //             'user_id'         => $muridKeluar->id,
    //             'kelas_asal_id'   => $c10->id,
    //             'kelas_tujuan_id' => null,
    //             'jenis'           => 'murid_keluar',
    //             'status'          => 'disetujui',
    //             'alasan'          => 'Pindah domisili',
    //         ]);
    //     }

    //     // 5) Guru01 pindah mapel: MAT -> BIG (disetujui) -> sync mapel menjadi BIG saja
    //     if ($guruAktif && $mat && $big) {
    //         $created[] = Mutasi::create([
    //             'user_id'         => $guruAktif->id,
    //             'mapel_asal_id'   => $mat->id,
    //             'mapel_tujuan_id' => $big->id,
    //             'jenis'           => 'guru_pindah_mapel',
    //             'status'          => 'disetujui',
    //             'alasan'          => 'Kebutuhan pengampu Bahasa Inggris',
    //         ]);
    //     }

    //     // 6) Guru01 rencana pindah BIG -> BIN (pending) -> tidak ada efek
    //     if ($guruAktif && $big && $bin) {
    //         $created[] = Mutasi::create([
    //             'user_id'         => $guruAktif->id,
    //             'mapel_asal_id'   => $big->id,
    //             'mapel_tujuan_id' => $bin->id,
    //             'jenis'           => 'guru_pindah_mapel',
    //             'status'          => 'pending',
    //             'alasan'          => 'Rotasi semester depan',
    //         ]);
    //     }

    //     // 7) Guru "guruKeluar" keluar (disetujui) -> detach mapel, lalu delete user
    //     if ($guruKeluar) {
    //         $created[] = Mutasi::create([
    //             'user_id' => $guruKeluar->id,
    //             'jenis'   => 'guru_keluar',
    //             'status'  => 'disetujui',
    //             'alasan'  => 'Kontrak berakhir',
    //         ]);
    //     }

    //     // 8) Tendik keluar (ditolak) -> tidak ada efek
    //     if ($tendik) {
    //         $created[] = Mutasi::create([
    //             'user_id' => $tendik->id,
    //             'jenis'   => 'tendik_keluar',
    //             'status'  => 'ditolak',
    //             'alasan'  => 'Masih dibutuhkan di tata usaha',
    //         ]);
    //     }

    //     // 9) Bonus: Murid01 pindah lintas paket (pending) -> tidak ada efek
    //     if ($muridNaik && $faseB && $b7) {
    //         $created[] = Mutasi::create([
    //             'user_id'         => $muridNaik->id,
    //             'kelas_asal_id'   => $faseB->id,
    //             'kelas_tujuan_id' => $b7->id,
    //             'jenis'           => 'murid_pindah_kelas',
    //             'status'          => 'pending',
    //             'alasan'          => 'Uji coba lintas paket',
    //         ]);
    //     }

    //     // --- Terapkan efek ke tabel users untuk mutasi yang DISETUJUI ---
    //     foreach ($created as $mutasi) {
    //         if ($mutasi->status === 'disetujui') {
    //             $this->applyMutasiToUser($mutasi);
    //         }
    //     }
    // }

    // /**
    //  * Terapkan efek mutasi ke tabel users (mirror ke MutasiController::setujui).
    //  */
    // private function applyMutasiToUser(Mutasi $mutasi): void
    // {
    //     $user = User::with('mapels')->find($mutasi->user_id);
    //     if (!$user) return;

    //     switch ($mutasi->jenis) {
    //         case 'murid_pindah_kelas':
    //         case 'murid_naik_kelas':
    //             if ($mutasi->kelas_tujuan_id) {
    //                 $user->kelas_id = $mutasi->kelas_tujuan_id;
    //                 $user->save();
    //             }
    //             break;

    //         case 'murid_lulus':
    //         case 'murid_keluar':
    //             $user->kelas_id = null;
    //             $user->delete();
    //             break;

    //         case 'guru_pindah_mapel':
    //             if ($mutasi->mapel_tujuan_id) {
    //                 // ganti jadi satu mapel tujuan saja (sinkron ke controller)
    //                 $user->mapels()->sync([$mutasi->mapel_tujuan_id]);
    //             }
    //             break;

    //         case 'guru_keluar':
    //             // lepas pivot dulu untuk aman dari FK, lalu hapus user
    //             if ($user->role === 'guru') {
    //                 $user->mapels()->detach();
    //             }
    //             $user->delete(); // sesuai controller
    //             break;

    //         case 'tendik_keluar':
    //             // sesuai controller: delete
    //             if ($user->role === 'tenagaPendidik') {
    //                 $user->delete();
    //             }
    //             break;
    //     }
    }
}