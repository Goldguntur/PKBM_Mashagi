<?php

namespace App\Http\Controllers;

use App\Models\AbsensiMurid;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AbsensiExport;

class LaporanAbsensiMuridController extends Controller
{
    public function index(Request $request)
    {
        $bulan = $request->bulan ?? now()->month;
        $tahun = $request->tahun ?? now()->year;
        $kelas = $request->kelas_id;

        $rekap = AbsensiMurid::with('murid')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->when($kelas, fn($q) => $q->where('kelas_id', $kelas))
            ->get()
            ->groupBy('murid_id')
            ->map(function ($items) {
                $murid = $items->first()->murid;
                return [
                    'id'    => $murid->id,
                    'name'  => $murid->name,
                    'hadir' => $items->where('status', 'hadir')->count(),
                    'sakit' => $items->where('status', 'sakit')->count(),
                    'izin'  => $items->where('status', 'izin')->count(),
                    'alpha' => $items->where('status', 'alpha')->count(),
                ];
            })
            ->values();

        return response()->json($rekap);
    }

    public function showMurid($id, Request $request)
    {
        $tahun = $request->tahun ?? now()->year;
        $bulan = $request->bulan ?? now()->month;

        $murid = User::findOrFail($id);

        $absensi = AbsensiMurid::where('murid_id', $id)
            ->whereYear('tanggal', $tahun)
            ->get();

        $weekly = $absensi->groupBy(fn($a) => Carbon::parse($a->tanggal)->weekOfMonth);

        $weekLabels = [];
        $weekValues = ['hadir' => [], 'sakit' => [], 'izin' => [], 'alpha' => []];

        foreach ($weekly as $week => $items) {
            $weekLabels[] = "M$week";
            $weekValues['hadir'][] = $items->where('status', 'hadir')->count();
            $weekValues['sakit'][] = $items->where('status', 'sakit')->count();
            $weekValues['izin'][]  = $items->where('status', 'izin')->count();
            $weekValues['alpha'][] = $items->where('status', 'alpha')->count();
        }

        $monthly = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthly[Carbon::create()->month($m)->format('M')] = [
                'hadir' => $absensi->whereBetween('tanggal', [Carbon::create($tahun, $m, 1), Carbon::create($tahun, $m, 1)->endOfMonth()])->where('status', 'hadir')->count(),
                'sakit' => $absensi->whereBetween('tanggal', [Carbon::create($tahun, $m, 1), Carbon::create($tahun, $m, 1)->endOfMonth()])->where('status', 'sakit')->count(),
                'izin'  => $absensi->whereBetween('tanggal', [Carbon::create($tahun, $m, 1), Carbon::create($tahun, $m, 1)->endOfMonth()])->where('status', 'izin')->count(),
                'alpha' => $absensi->whereBetween('tanggal', [Carbon::create($tahun, $m, 1), Carbon::create($tahun, $m, 1)->endOfMonth()])->where('status', 'alpha')->count(),
            ];
        }

        return response()->json([
            'murid' => ['id' => $murid->id, 'name' => $murid->name],
            'week'  => ['labels' => $weekLabels, 'values' => $weekValues],
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
}