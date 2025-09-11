<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->get());
     }


    public function show($id)
    {
        $user = User::with('kelas', 'mapels')->findOrFail($id);
        return response()->json($user);
    }

    public function setAbsensiManager(Request $request, $id)
{
    $request->validate([
        'absensi_guruTendik' => 'required|boolean'
    ]);

    $user = User::findOrFail($id);
    $user->absensi_guruTendik = $request->absensi_guruTendik;
    $user->save();

    return response()->json([
        'message' => 'Status absensi manager berhasil diubah',
        'user' => $user
    ]);
}
}