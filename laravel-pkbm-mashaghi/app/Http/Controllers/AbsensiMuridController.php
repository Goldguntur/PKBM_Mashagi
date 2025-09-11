<?php

namespace App\Http\Controllers;

use App\Models\AbsensiMurid;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;


/**
 * @property \Illuminate\Database\Eloquent\Collection|\App\Models\Mapel[] $mapels
 */
class AbsensiMuridController extends Controller
{
    public function index(Request $request)
    {
        $today = now()->toDateString();

        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapels,id',
        ]);

        $murid = User::where('role', 'pesertaDidik')
            ->where('kelas_id', $request->kelas_id)
            ->get();

        $absensi = AbsensiMurid::whereDate('tanggal', $today)
            ->where('kelas_id', $request->kelas_id)
            ->where('mapel_id', $request->mapel_id)
            ->get()
            ->keyBy('murid_id');

        $result = $murid->map(function ($m) use ($absensi) {
            $absen = $absensi->get($m->id);

            return [
                'id'        => $m->id,
                'name'      => $m->name,
                'username'  => $m->username,
                'email'  => $m->email,
                'kelas_id'  => $m->kelas_id,
                'status'    => $absen?->status ?? 'belum absen',
                'jam_masuk' => $absen?->waktu ? Carbon::parse($absen->waktu)->format('H:i') : null,
            ];
        });

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $guru = Auth::user();

        if ($guru->role !== 'guru') {
            return response()->json(['message' => 'Hanya guru yang bisa mengakses'], 403);
        }

        $request->validate([
            'murid_id' => 'required|exists:users,id',
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapels,id',
            'status'   => 'required|in:hadir,izin,sakit,alpha',
        ]);

        $absensi = AbsensiMurid::create([
            'murid_id' => $request->murid_id,
            'kelas_id' => $request->kelas_id,
            'mapel_id' => $request->mapel_id,
            'guru_id'  => $guru->id,
            'tanggal'  => now()->toDateString(),
            'waktu'    => now()->toTimeString(),
            'status'   => $request->status,
        ]);

        return response()->json(['message' => 'Absensi berhasil disimpan', 'data' => $absensi], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:hadir,izin,sakit,alpha',
        ]);

        $absensi = AbsensiMurid::findOrFail($id);
        $absensi->update(['status' => $request->status]);

        return response()->json(['message' => 'Status absensi berhasil diperbarui', 'data' => $absensi]);
    }

    public function show($murid_id)
    {
        $absensi = AbsensiMurid::with(['kelas:id,nama_kelas', 'mapel:id,nama_mapel'])
            ->where('murid_id', $murid_id)
            ->get();

        return response()->json($absensi);
    }

    
public function getAbsensiHariIni(Request $request)
{
    $guru = Auth::user();
    $today = now()->toDateString();

    $request->validate([
        'mapel_id' => 'required|exists:mapels,id',
    ]);

    $mapel = $guru->mapels()->findOrFail($request->mapel_id);

    $kelas = $mapel->kelas()->with('users.kelas')->get();

    $absensi = AbsensiMurid::where('mapel_id', $mapel->id)
        ->whereDate('tanggal', $today)
        ->get()
        ->keyBy('murid_id');

    $result = [];
    foreach ($kelas as $k) {
        $muridData = $k->users->map(function ($m) use ($absensi) {
            $absen = $absensi->get($m->id);

            return [
                'murid_id'  => $m->id,
                'nama'      => $m->name,
                'username'  => $m->username,
                'email'  => $m->email,
                'kelas'     => optional($m->kelas)->nama_kelas,
                'status'    => $absen?->status ?? 'belum absen',
                'jam_masuk' => $absen?->waktu ? \Carbon\Carbon::parse($absen->waktu)->format('H:i') : null,
            ];
        });

        $result[] = [
            'kelas_id'   => $k->id,
            'nama_kelas' => $k->nama_kelas,
            'murid'      => $muridData,
        ];
    }

    return response()->json($result);
}
}