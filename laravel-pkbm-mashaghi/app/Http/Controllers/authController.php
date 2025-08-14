<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class authController extends Controller
{

  public function register(Request $request)
    {
        $kelasEnum = [
            'paketA_faseA',
            'paketA_faseB',
            'paketA_faseC',
            'paketB_kelas7',
            'paketB_kelas8',
            'paketB_kelas9',
            'paketC_kelas10',
            'paketC_kelas11',
            'paketC_kelas12'
        ];

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'no_wa' => [
                'required',
                'regex:/^(?:\+62|62|0)8[1-9][0-9]{7,10}$/',
                'unique:users',
            ],
            'nisn' => 'nullable|string|max:20|unique:users',
            'nik' => 'nullable|string|max:20|unique:users',
            'kelas' => [
                'nullable',
                Rule::in($kelasEnum)
            ],
            'tanggal_lahir' => 'nullable|date',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['kepalaSekolah', 'tenagaPendidik', 'guru', 'pesertaDidik'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        if ($request->role !== 'pesertaDidik') {
            $request->merge(['kelas' => null]);
        }

        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'no_wa' => $request->no_wa,
            'nisn' => $request->nisn,
            'nik' => $request->nik,
            'kelas' => $request->kelas,
            'tanggal_lahir' => $request->tanggal_lahir,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'data' => $user
        ], 201);
    }

    public function login(Request $request) {
    $rules = [
        'email' => 'required|email',
        'password' => 'required|string|min:8',
        'role' => 'required|in:kepalaSekolah,tenagaPendidik,guru,pesertaDidik',
    ];

    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Proses login gagal',
            'data' => $validator->errors(),
        ], 422);
    }
    if(!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
            'status' => 'error',
            'message' => 'Email atau password salah',
        ], 401);
    }
    if (Auth::user()->role !== $request->role) {
        return response()->json([
            'status' => 'error',
            'message' => 'Role tidak sesuai',
        ], 403);
    }

    $dataUser = User::where('email', $request->email)->first();
    return response()->json([
        'status' => true,
        'message' => 'Login berhasil',
        'token' => $dataUser->createToken('auth-token')->plainTextToken,
        'user' =>  [
            'id' => $dataUser->id,
            'name' => $dataUser->name,
            'username' => $dataUser->username,
            'role' => $dataUser->role,
            'email' => $dataUser->email,
            'no_wa' => $dataUser->no_wa,
            'nisn' => $dataUser->nisn,
            'nik' => $dataUser->nik,
            'kelas' => $dataUser->kelas,
            'tanggal_lahir' => $dataUser->tanggal_lahir
        ]
    ]);
    }

  
}
