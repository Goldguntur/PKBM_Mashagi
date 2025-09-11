<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MapelController extends Controller
{

    public function index()
    {
        $mapel = Mapel::with('guru')->get();
        return response()->json($mapel);
    }
    
     public function mapelKelas($mapel_id)
    {
        $guru = Auth::user();

        if ($guru->role !== 'guru') {
            return response()->json(['message' => 'Hanya guru yang bisa mengakses'], 403);
        }

        // Pastikan guru mengajar mapel ini
        if (!$guru->mapels->pluck('id')->contains($mapel_id)) {
            return response()->json(['message' => 'Guru tidak mengajar mapel ini'], 403);
        }

        $mapel = Mapel::with(['kelas' => function ($q) use ($guru) {
            $q->whereIn('kelas.id', $guru->kelasMengajar->pluck('id'));
        }])->findOrFail($mapel_id);

        return response()->json([
            'mapel' => [
                'id' => $mapel->id,
                'nama_mapel' => $mapel->nama_mapel,
            ],
            'kelas' => $mapel->kelas
        ]);
    }

    public function kelasMapel($kelas_id)
    {
        $guru = Auth::user();

        if ($guru->role !== 'guru') {
            return response()->json(['message' => 'Hanya guru yang bisa mengakses'], 403);
        }

        if (!$guru->kelasMengajar->pluck('id')->contains($kelas_id)) {
            return response()->json(['message' => 'Guru tidak mengajar di kelas ini'], 403);
        }

        $kelas = Kelas::with(['mapels' => function ($q) use ($guru) {
            $q->whereIn('mapels.id', $guru->mapels->pluck('id'));
        }])->findOrFail($kelas_id);

        return response()->json([
            'kelas' => [
                'id' => $kelas->id,
                'nama_kelas' => $kelas->nama_kelas,
            ],
            'mapels' => $kelas->mapels
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_mapel' => 'required|unique:mapels',
            'nama_mapel' => 'required',
        ]);

        $mapel = Mapel::create($request->all());
        return response()->json(['message' => 'Mapel berhasil dibuat', 'data' => $mapel], 201);
    }

    public function show($id)
    {
        $mapel = Mapel::with('guru')->findOrFail($id);
        return response()->json($mapel);
    }

    public function update(Request $request, $id)
    {
        $mapel = Mapel::findOrFail($id);

        $request->validate([
            'kode_mapel' => 'required|unique:mapels,kode_mapel,' . $id,
            'nama_mapel' => 'required',
        ]);

        $mapel->update($request->all());
        return response()->json(['message' => 'Mapel berhasil diperbarui', 'data' => $mapel]);
    }

    public function destroy($id)
    {
        $mapel = Mapel::findOrFail($id);
        $mapel->delete();
        return response()->json(['message' => 'Mapel berhasil dihapus']);
    }

    public function assignGuru(Request $request, $mapelId)
    {
        $request->validate([
            'guru_id' => 'required|exists:users,id',
        ]);

        $mapel = Mapel::findOrFail($mapelId);
        $guru = User::where('id', $request->guru_id)->where('role', 'guru')->firstOrFail();

        $mapel->guru()->syncWithoutDetaching([$guru->id]);

        return response()->json(['message' => 'Guru berhasil ditambahkan ke mapel']);
    }


    public function unassignGuru(Request $request, $mapelId)
    {
        $request->validate([
            'guru_id' => 'required|exists:users,id',
        ]);

        $mapel = Mapel::findOrFail($mapelId);
        $mapel->guru()->detach($request->guru_id);

        return response()->json(['message' => 'Guru berhasil dihapus dari mapel']);
    }
    public function showGuru($id)
{
    $guru = User::with('mapels')->findOrFail($id);
    return response()->json($guru);
}
}
