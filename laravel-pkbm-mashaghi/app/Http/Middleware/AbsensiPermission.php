<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AbsensiPermission
{
    public function handle(Request $request, Closure $next, string $type)
    {
        $user = $request->user();

    if($type === 'tenagaPendidik' || $type === 'pesertaDidik') {
        return response()->json(['message' => 'Tidak bisa melakukan absensi!'], 403);
    }

     if ($type === 'guru') {
    if ($user->role === 'kepalaSekolah') {
        return $next($request);
    }

    // Guru dengan flag absensi_guruTendik = true
    if ($user->role === 'guru' && $user->absensi_guruTendik) {
        return $next($request);
    }

    // Guru biasa ditolak
    return response()->json(['message' => 'Guru biasa tidak bisa melakukan absensi!'], 403);
}

        return $next($request);
    }
}