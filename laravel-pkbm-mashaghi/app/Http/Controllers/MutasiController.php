<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Mutasi;
use App\Models\HistoriMutasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MutasiController extends Controller
{
    // List semua mutasi
    public function index()
    {
        $this->authorizeKepsek();

        $mutasi = Mutasi::with(['user' => fn($q) => $q->withTrashed(), 'kelasAsal', 'kelasTujuan'])
            ->latest()
            ->get();

        return response()->json($mutasi);
    }

 public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'          => 'required|exists:users,id',
            'jenis'            => 'required|string',
            'kelas_tujuan_id'  => 'nullable|exists:kelas,id',
            'mapel_tujuan_id'  => 'nullable|array',             
            'mapel_tujuan_id.*'=> 'exists:mapels,id',           
            'alasan'           => 'nullable|string',
        ]);

        $user = User::findOrFail($validated['user_id']);

        // Buat record mutasi
        $mutasi = Mutasi::create([
            'user_id'         => $user->id,
            'jenis'           => $validated['jenis'],
            'kelas_tujuan_id' => $validated['kelas_tujuan_id'] ?? null,
            'alasan'          => $validated['alasan'] ?? null,
        ]);

        // Proses mutasi sesuai jenis
        switch ($validated['jenis']) {
            case 'murid_pindah_kelas':
            case 'murid_naik_kelas':
                if (!empty($validated['kelas_tujuan_id'])) {
                    $user->kelas_id = $validated['kelas_tujuan_id'];
                    $user->save();
                }
                break;

            case 'murid_lulus':
                $user->status = 'lulus';
                $user->save();
                break;

            case 'murid_keluar':
                $user->status = 'keluar';
                $user->save();
                break;

            case 'guru_pindah_mapel':
                if (!empty($validated['mapel_tujuan_id'])) {
                    // sync array mapel tujuan
                    $user->mapels()->sync($validated['mapel_tujuan_id']);
                }
                break;

            case 'guru_keluar':
                $user->status = 'keluar';
                $user->save();
                break;

            case 'tendik_keluar':
                $user->status = 'keluar';
                $user->save();
                break;
        }

        return response()->json([
            'mutasi' => $mutasi->load('kelasTujuan', 'user', 'user.mapels'),
        ]);
    }
    // Detail mutasi
    public function show($id)
    {
        $this->authorizeKepsek();

        $mutasi = Mutasi::with([
            'user' => fn($q) => $q->withTrashed(),
            'kelasAsal',
            'kelasTujuan',
            'histori'
        ])->findOrFail($id);

        return response()->json($mutasi);
    }

    public function update(Request $request, $id)
    {
        $this->authorizeKepsek();

        $validated = $request->validate([
            'status' => 'required|string|in:disetujui,ditolak',
        ]);

        $mutasi = Mutasi::findOrFail($id);
        $mutasi->status = $validated['status'];
        $mutasi->save();

        $user = User::withTrashed()->find($mutasi->user_id);

        $this->simpanHistori($mutasi, $user, $validated['status']);

        return response()->json([
            'message' => 'Mutasi berhasil diperbarui',
            'mutasi'  => $mutasi
        ]);
    }

    private function simpanHistori(Mutasi $mutasi, ?User $user, $aksi)
    {
        HistoriMutasi::create([
            'mutasi_id' => $mutasi->id,
            'user_id'   => $user?->id,
            'aksi'      => $aksi,
            'keterangan'=> $mutasi->jenis
        ]);

        if ($user) {
            // Batasi histori max 50 record per user
            $historiCount = HistoriMutasi::where('user_id', $user->id)->count();
            if ($historiCount > 50) {
                $toDelete = HistoriMutasi::where('user_id', $user->id)
                    ->orderBy('created_at', 'asc')
                    ->take($historiCount - 50)
                    ->get();

                foreach ($toDelete as $h) {
                    $h->delete();
                }
            }
        }
    }

    private function authorizeKepsek()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'kepalaSekolah') {
            abort(403, 'Unauthorized');
        }
    }
}