<?php

namespace App\Http\Controllers;

use PDF;
use App\Exports\AbsensiExport;
use App\Models\AbsensiGuruTendik;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class LaporanAbsensiController extends Controller
{
    public function index(Request $request)
{
    $bulan = $request->bulan ?? now()->month;
    $tahun = $request->tahun ?? now()->year;
    $role  = $request->role ?? 'guru';

    $rekap = AbsensiGuruTendik::with('user')
        ->whereMonth('tanggal', $bulan)
        ->whereYear('tanggal', $tahun)
        ->whereHas('user', fn($q) => $q->where('role', $role))
        ->get()
        ->groupBy('user_id')
        ->map(function ($items) {
            $user = $items->first()->user;
            return [
                'id'    => $user->id,
                'name'  => $user->name,
                'hadir' => $items->where('status', 'hadir')->count(),
                'sakit' => $items->where('status', 'sakit')->count(),
                'izin'  => $items->where('status', 'izin')->count(),
                'alpha' => $items->where('status', 'alpha')->count(),
            ];
        })
        ->values();

    return response()->json($rekap);
}

public function showUser($id, Request $request)
{
    $tahun = $request->tahun ?? now()->year;
    $bulan = $request->bulan ?? now()->month;

    $user = \App\Models\User::findOrFail($id);

    $absensi = \App\Models\AbsensiGuruTendik::where('user_id', $id)
        ->whereYear('tanggal', $tahun)
        ->get();

    $weekly = $absensi->groupBy(fn($a) => \Carbon\Carbon::parse($a->tanggal)->weekOfMonth);

    $weekLabels = [];
    $weekValues = [
        'hadir' => [],
        'sakit' => [],
        'izin'  => [],
        'alpha' => [],
    ];

    foreach ($weekly as $week => $items) {
        $weekLabels[] = "M$week";
        $weekValues['hadir'][] = $items->where('status', 'hadir')->count();
        $weekValues['sakit'][] = $items->where('status', 'sakit')->count();
        $weekValues['izin'][]  = $items->where('status', 'izin')->count();
        $weekValues['alpha'][] = $items->where('status', 'alpha')->count();
    }

    $monthly = [];
    for ($m = 1; $m <= 12; $m++) {
        $monthly[\Carbon\Carbon::create()->month($m)->format('M')] = [
            'hadir' => $absensi->whereBetween('tanggal', [
                \Carbon\Carbon::create($tahun, $m, 1),
                \Carbon\Carbon::create($tahun, $m, 1)->endOfMonth(),
            ])->where('status', 'hadir')->count(),
            'sakit' => $absensi->whereBetween('tanggal', [
                \Carbon\Carbon::create($tahun, $m, 1),
                \Carbon\Carbon::create($tahun, $m, 1)->endOfMonth(),
            ])->where('status', 'sakit')->count(),
            'izin' => $absensi->whereBetween('tanggal', [
                \Carbon\Carbon::create($tahun, $m, 1),
                \Carbon\Carbon::create($tahun, $m, 1)->endOfMonth(),
            ])->where('status', 'izin')->count(),
            'alpha' => $absensi->whereBetween('tanggal', [
                \Carbon\Carbon::create($tahun, $m, 1),
                \Carbon\Carbon::create($tahun, $m, 1)->endOfMonth(),
            ])->where('status', 'alpha')->count(),
        ];
    }

    return response()->json([
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
        ],
        'week' => [
            'labels' => $weekLabels,
            'values' => $weekValues,
        ],
        'month' => [
            'labels' => array_keys($monthly),
            'values' => [
                'hadir' => array_column($monthly, 'hadir'),
                'sakit' => array_column($monthly, 'sakit'),
                'izin'  => array_column($monthly, 'izin'),
                'alpha' => array_column($monthly, 'alpha'),
            ],
        ],
    ]);
}

 public function exportHarian(Request $request)
    {
        $tanggal = $request->input('tanggal', Carbon::now()->toDateString());
        return Excel::download(new AbsensiExport('harian', $tanggal), "Absensi_Harian_{$tanggal}.xlsx");
    }

    public function exportBulanan(Request $request)
    {
        $bulan = $request->input('bulan', Carbon::now()->month);
        $tahun = $request
        ->input('tahun', Carbon::now()->year);

        return Excel::download(new AbsensiExport('bulanan', null, $bulan, $tahun), "Absensi_Bulanan_{$bulan}_{$tahun}.xlsx");
    }
}