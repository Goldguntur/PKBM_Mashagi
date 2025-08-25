<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\Request;

class KelasController extends Controller
{
     public function index()
    {
        $kelas = Kelas::with('users')->get();
        return response()->json($kelas);
    }

}
