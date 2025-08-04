<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\authController;



// Example route group with auth middleware
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::post('/register', [authController::class, 'register']);
Route::post('/login', [authController::class, 'login']);