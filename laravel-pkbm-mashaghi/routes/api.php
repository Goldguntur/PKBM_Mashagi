<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\MapelController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\MutasiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AbsensiGuruTendikController;
use App\Http\Controllers\AbsensiMuridController;
use App\Http\Controllers\LaporanAbsensiController;
use App\Http\Controllers\LaporanAbsensiMuridController;

Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => $request->user());
Route::get('/test-relasi-guru/{id}', [AuthController::class, 'testRelasiGuru']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

Route::get('/mapel', [MapelController::class, 'index']);


Route::middleware('auth:sanctum')->prefix('mutasi')->group(function () {
    Route::get('/', [MutasiController::class, 'index']);  
    Route::post('/', [MutasiController::class, 'store']);  
    Route::get('/{id}', [MutasiController::class, 'show']);  
    Route::put('/{id}', [MutasiController::class, 'update']); 
    Route::delete('/{id}', [MutasiController::class, 'destroy']); 
});

    Route::get('/pengumuman',  [PengumumanController::class, 'index']);
    Route::get('/pengumuman/{id}', [PengumumanController::class, 'show']);
    Route::post('/pengumuman', [PengumumanController::class, 'store']); 
    Route::delete('/pengumuman/{id}', [PengumumanController::class, 'destroy']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']); 
    Route::patch('/users/{id}/absensi-manager', [UserController::class, 'setAbsensiManager']);
});


Route::get('/guru/{id}', [AuthController::class, 'showGuru']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/mapel',           [MapelController::class, 'store']);
    Route::get('/mapel/{id}/kelas', [MapelController::class, 'mapelKelas']);
    Route::get('/kelas/{id}/mapel', [MapelController::class, 'kelasMapel']);
    Route::get('/mapel/{id}',       [MapelController::class, 'show']);
    Route::put('/mapel/{id}',       [MapelController::class, 'update']);
    Route::delete('/mapel/{id}',    [MapelController::class, 'destroy']);
    Route::post('/mapel/{id}/assign-guru',   [MapelController::class, 'assignGuru']);
    Route::post('/mapel/{id}/unassign-guru', [MapelController::class, 'unassignGuru']);
});

Route::get('/mapels', [MapelController::class, 'index']);
Route::get('/kelas', [KelasController::class, 'index']);

Route::prefix('absensi-guru-tendik')
        ->middleware('auth:sanctum', 'absensi.permission:guru') 
        ->group(function () {
            Route::get('/', [AbsensiGuruTendikController::class, 'index']); 
            Route::post('/', [AbsensiGuruTendikController::class, 'store']); 
            Route::put('/{id}/pulang', [AbsensiGuruTendikController::class, 'pulang']); 
            Route::get('/{id}', [AbsensiGuruTendikController::class, 'show']); 
        });

Route::middleware(['auth:sanctum', 'role:kepalaSekolah'])->put('/users/{id}/absensi_guruTendik', [UserController::class, 'setAbsensiManager']);


Route::prefix('laporan-absensi')
->middleware('auth:sanctum', 'absensi.permission:guru')
->group(function () {
    Route::get('/', [LaporanAbsensiController::class, 'index']);    
    Route::get('/pdf', [LaporanAbsensiController::class, 'exportPdf']);
    Route::get('/excel', [LaporanAbsensiController::class, 'exportExcel']);
    Route::get('/export-harian', [LaporanAbsensiController::class, 'exportHarian']);
    Route::get('/export-bulanan', [LaporanAbsensiController::class, 'exportBulanan']);
    Route::get('/user/{id}', [LaporanAbsensiController::class, 'showUser']);
    });

    Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('absensi-murid')->group(function () {
        Route::get('/', [AbsensiMuridController::class, 'index']);
        Route::post('/', [AbsensiMuridController::class, 'store']); 
        Route::put('/{id}', [AbsensiMuridController::class, 'updateStatus']); 
        Route::get('/show/{murid_id}', [AbsensiMuridController::class, 'show']);
    });

    Route::prefix('laporan-murid')->group(function () {
        Route::get('/', [LaporanAbsensiMuridController::class, 'index']); 
        Route::get('/{id}', [LaporanAbsensiMuridController::class, 'showMurid']); 
    });
});