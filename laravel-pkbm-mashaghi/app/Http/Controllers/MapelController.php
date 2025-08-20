<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\User;
use Illuminate\Http\Request;

class MapelController extends Controller
{
    // List semua mapel
    public function index()
    {
        $mapel = Mapel::with('guru')->get();
        return response()->json($mapel);
    }

    // Tambah mapel
    public function store(Request $request)
    {
        $request->validate([
            'kode_mapel' => 'required|unique:mapels',
            'nama_mapel' => 'required',
        ]);

        $mapel = Mapel::create($request->all());
        return response()->json(['message' => 'Mapel berhasil dibuat', 'data' => $mapel], 201);
    }

    // Tampilkan detail mapel
    public function show($id)
    {
        $mapel = Mapel::with('guru')->findOrFail($id);
        return response()->json($mapel);
    }

    // Update mapel
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

    // Hapus mapel
    public function destroy($id)
    {
        $mapel = Mapel::findOrFail($id);
        $mapel->delete();
        return response()->json(['message' => 'Mapel berhasil dihapus']);
    }

    // Assign guru ke mapel
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

    // Unassign guru dari mapel
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
