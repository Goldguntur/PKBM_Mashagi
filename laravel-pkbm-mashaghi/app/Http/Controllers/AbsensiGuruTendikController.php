<?php

namespace App\Http\Controllers;

use App\Models\AbsensiGuruTendik;
use App\Models\User;
use Illuminate\Http\Request;

class AbsensiGuruTendikController extends Controller
{
    public function index(Request $request)
{ 
    $today = now()->toDateString();

    $query = \App\Models\User::query();

    if ($request->role) {
        $query->where('role', $request->role);
    } else {
        $query->whereIn('role', ['guru', 'tendik']);
    }

    $users = $query->get();

    $absensi = AbsensiGuruTendik::whereDate('tanggal', $today)->get()->keyBy('user_id');

   $result = $users->map(function ($user) use ($absensi) {
    $absen = $absensi->get($user->id);

    return [
        'id'         => $user->id,
        'name'       => $user->name,
        'email'      => $user->email,
        'username'   => $user->username,
        'role'       => $user->role,
        'status'     => $absen?->status ?? 'belum absen',
        'jam_masuk'  => $absen?->jam_masuk ? \Carbon\Carbon::parse($absen->jam_masuk)->format('H:i') : null,
        'jam_pulang' => $absen?->jam_pulang ? \Carbon\Carbon::parse($absen->jam_pulang)->format('H:i') : null,
    ];
});

    return response()->json($result);
}
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'status'  => 'required|in:hadir,izin,sakit,alpha',
        ]);

        $absensi = AbsensiGuruTendik::create([
            'user_id'   => $request->user_id,
            'tanggal'   => now()->toDateString(),
            'jam_masuk' => now()->toTimeString(),
            'status'    => $request->status,
        ]);

        return response()->json(['message' => 'Absensi masuk tercatat', 'data' => $absensi], 201);
    }

    public function pulang(Request $request, $id)
    {
        $absensi = AbsensiGuruTendik::findOrFail($id);
        $absensi->update([
            'jam_pulang' => now()->toTimeString()
        ]);

        return response()->json(['message' => 'Jam pulang tercatat', 'data' => $absensi]);
    }

    public function show($id)
    {
        $absensi = AbsensiGuruTendik::with('user')->where('user_id', $id)->get();
        return response()->json($absensi);
    }
}