<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AbsensiPermission
{
    public function handle(Request $request, Closure $next, string $type)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        switch ($type) {
            case 'guru':
                // Kepala Sekolah otomatis boleh
                if ($user->role === 'kepalaSekolah') {
                    return $next($request);
                }

                // Guru diperbolehkan jika punya relasi absensi_guruTendik
                if ($user->role === 'guru' && $user->absensi_guruTendik) {
                    return $next($request);
                }

                return response()->json(['message' => 'Akses ditolak: guru biasa tidak bisa melakukan absensi!'], 403);

            case 'tenagaPendidik':
            case 'pesertaDidik':
                return response()->json(['message' => 'Akses ditolak: role ini tidak bisa melakukan absensi!'], 403);

            default:
                return response()->json(['message' => 'Tipe absensi tidak valid!'], 400);
        }
    }
}