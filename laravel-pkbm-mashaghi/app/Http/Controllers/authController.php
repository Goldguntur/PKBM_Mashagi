<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use Exception;
class authController extends Controller
{

public function register(Request $request)
{
    $rules = [
        'username' => 'required|string|max:255|unique:users',
         'name' => 'required|string|max:255',
         'email' => 'required|string|email|max:255|unique:users',
         'no_wa' => [
             'required',
             'regex:/^(?:\+62|62|0)8[1-9][0-9]{7,10}$/',
             'unique:users',
            ],
        'nisn' => 'string|max:20|unique:users',
        'nisn' => 'string|max:20|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'role' => 'required|in:kepalaSekolah,tenagaPendidik,guru,pesertaDidik', 
    ]; 
    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => $validator->errors(),
        ], 422);
    }

    try {
        $dataUser = new User();
        $dataUser->username = $request->username;
        $dataUser->name = $request->name;
        $dataUser->email = $request->email;
        $dataUser->no_wa = $request->no_wa;
        $dataUser->nisn = $request->nisn;
        $dataUser->nik = $request->nik;
        $dataUser->password = Hash::make($request->password);
        $dataUser->role = $request->role;
        $dataUser->save();

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'data' => $dataUser
        ], 201);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Server error: ' . $e->getMessage(),
        ], 500);
    }
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
        'user' => [
            'id' => $dataUser->id,
            'username' => $dataUser->username,
            'name' => $dataUser->name,
            'email' => $dataUser->email,
            'role' => $dataUser->role,
        ],
    ]);
    }

  
}
