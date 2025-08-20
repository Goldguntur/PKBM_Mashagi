<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MapelController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\MutasiController;

Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => $request->user());
Route::middleware('auth:sanctum')->get('/me', fn (Request $request) => $request->user());

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// 📌 BIKIN PUBLIC: daftar mapel untuk dipakai saat register (belum login)
Route::get('/mapel', [MapelController::class, 'index']);

Route::get('/pengumuman',  [PengumumanController::class, 'index']);
Route::post('/pengumuman', [PengumumanController::class, 'store']);

Route::get('/guru/{id}', [AuthController::class, 'showGuru']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/mapel',           [MapelController::class, 'store']);
    Route::get('/mapel/{id}',       [MapelController::class, 'show']);
    Route::put('/mapel/{id}',       [MapelController::class, 'update']);
    Route::delete('/mapel/{id}',    [MapelController::class, 'destroy']);
    Route::post('/mapel/{id}/assign-guru',   [MapelController::class, 'assignGuru']);
    Route::post('/mapel/{id}/unassign-guru', [MapelController::class, 'unassignGuru']);
});

