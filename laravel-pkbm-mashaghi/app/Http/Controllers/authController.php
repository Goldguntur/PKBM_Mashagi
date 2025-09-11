<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    
    public function register(Request $request)
{
    $request->validate([
        'name'          => 'required|string|max:255',
        'username'      => 'nullable|string|max:50|unique:users',
        'email'         => 'required|string|email|max:255|unique:users',
        'password'      => 'required|string|min:6|confirmed',
        'role'          => 'in:pesertaDidik,guru,tenagaPendidik,kepalaSekolah',
        'kelas_id'      => 'nullable|exists:kelas,id',
        'nisn'          => 'nullable|string|max:20',
        'nik'           => 'nullable|string|max:20',
        'no_wa'         => 'nullable|string|max:20',
        'absensi_guruTendik' => 'nullable|boolean',
        'tanggal_lahir' => 'nullable|date',
        'mapel_ids'     => 'array',
        'kelas_ids'     => 'array',
    ]);

    $user = User::create([
        'name'          => $request->name,
        'username'      => $request->username ?? $request->email,
        'email'         => $request->email,
        'password'      => Hash::make($request->password),
        'role'          => $request->role,
        'kelas_id'      => $request->role === 'pesertaDidik' ? $request->kelas_id : null,
        'nisn'          => $request->role === 'pesertaDidik' ? $request->nisn : null,
        'nik'           => $request->role !== 'pesertaDidik' ? $request->nik : null,
        'no_wa'         => $request->no_wa,
        'absensi_guruTendik' => $request->role === 'guru' ? $request->absensi_guruTendik : null,
        'tanggal_lahir' => $request->tanggal_lahir,
    ]);

    if ($user->role === 'guru') {
        if ($request->filled('mapel_ids')) {
            $user->mapels()->sync($request->mapel_ids);
        }
        if ($request->filled('kelas_ids')) {
            $user->kelasMengajar()->sync($request->kelas_ids);
        }
    }

    $user->load([
        'mapels:id,nama_mapel,kode_mapel',
        'kelasMengajar:id,nama_kelas'
    ]);

    return response()->json([
        'message' => 'Registrasi berhasil',
        'user'    => [
        'id'                => $user->id,
        'username'          => $user->username,
        'name'              => $user->name,
        'email'             => $user->email,
        'no_wa'             => $user->no_wa,
        'nisn'              => $user->nisn,
        'nik'               => $user->nik,
        'tanggal_lahir'     => $user->tanggal_lahir,
        'role'              => $user->role,
        'absensi_guruTendik'=> $user->absensi_guruTendik,
        'kelas_id'          => $user->kelas_id,
        'mapels' => $user->mapels->map(fn($m) => [
            'id' => $m->id,
            'nama_mapel' => $m->nama_mapel,
            'kode_mapel' => $m->kode_mapel,
        ]),
        'kelas_mengajar' => $user->kelasMengajar->map(fn($k) => [
            'id' => $k->id,
            'nama_kelas' => $k->nama_kelas,
        ]),
    ]
    ], 201);
}

 public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|string',
        'password' => 'required|string',
        'role'     => 'in:pesertaDidik,guru,tenagaPendidik,kepalaSekolah',
    ]);

    $user = User::where('email', $request->email)
                ->orWhere('username', $request->email)
                ->first();            

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Email/Username atau password salah.'],
        ]);
    }

    if ($user->role !== $request->role) {
        throw ValidationException::withMessages([
            'role' => ['Role tidak sesuai.'],
        ]);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    // load relasi untuk guru
    if ($user->role === 'guru') {
        $user->load([
            'mapels:id,nama_mapel,kode_mapel',
            'kelasMengajar:id,nama_kelas'
        ]);
    }

    return response()->json([
        'message'      => 'Login berhasil',
        'token'        => $token,
        'token_type'   => 'Bearer',
        'user'         => $user
    ]);
}

 public function me(Request $request)
    {
        $authId = Auth::id();

        $user = User::with([
            'mapels:id,nama_mapel,kode_mapel',
            'kelasMengajar:id,nama_kelas',
            'kelas:id,nama_kelas'
        ])->find($authId);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        return response()->json(['auth_id' => $authId, 'user' => $user]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }
}