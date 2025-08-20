<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
        'role'          => 'required|in:pesertaDidik,guru,tenagaPendidik,kepalaSekolah',
        'kelas_id'      => 'nullable|exists:kelas,id',
        'nisn'          => 'nullable|string|max:20',
        'nik'           => 'nullable|string|max:20',
        'no_wa'         => 'nullable|string|max:20',
        'tanggal_lahir' => 'nullable|date',
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
        'tanggal_lahir' => $request->tanggal_lahir,
    ]);

    if ($user->role === 'guru' && method_exists($user, 'mapels')) {
        if ($request->filled('mapel_ids')) {
            $user->mapels()->sync($request->mapel_ids);
        } elseif ($request->filled('mapel')) {
            $user->mapels()->sync([$request->mapel]); 
        }
    }

    return response()->json([
        'message' => 'Registrasi berhasil',
        'user'    => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'username' => $user->username,
            'kelas_id' => $user->kelas_id,
            'no_wa' => $user->no_wa,
            'tanggal_lahir' => $user->tanggal_lahir,
            'mapels' => $user->mapels()->get(['mapels.id', 'mapels.nama_mapel', 'mapels.kode_mapel']),
            'nisn' => $user->nisn,
            'nik' => $user->nik
        ],
    ], 201);
}

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                    ->orWhere('username', $request->email)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email/Username atau password salah.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        if ($user->role === 'guru' && method_exists($user, 'mapels')) {
            $user->setRelation('mapels', $user->mapels()
                ->select('mapels.id', 'mapels.nama_mapel', 'mapels.kode_mapel')
                ->get());
        }

        return response()->json([
            'message'      => 'Login berhasil',
            'token' => $token,
            'token_type'   => 'Bearer',
            'user' =>  [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'role' => $user->role,
            'email' => $user->email,
            'no_wa' => $user->no_wa,
            'nisn' => $user->nisn,
            'nik' => $user->nik,
            'kelas_id' => $user->kelas_id,
            'tanggal_lahir' => $user->tanggal_lahir
        ]
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'guru' && method_exists($user, 'mapels')) {
            $user->setRelation('mapels', $user->mapels()
                ->select('mapels.id', 'mapels.nama_mapel', 'mapels.kode_mapel')
                ->get());
        }

        return response()->json($user);
    }

    public function showGuru($id)
{
    $guru = User::with('mapels')->findOrFail($id);
    return response()->json($guru);
}

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}