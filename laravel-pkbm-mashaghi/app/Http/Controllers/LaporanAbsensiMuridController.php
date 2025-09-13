<?php

namespace App\Http\Controllers;

use App\Models\AbsensiMurid;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Mapel;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AbsensiMuridExport;

class LaporanAbsensiMuridController extends Controller
{
    public function index(Request $request)
    {
        $bulan   = $request->input('bulan', now()->month);
        $tahun   = $request->input('tahun', now()->year);
        $kelasId = $request->input('kelas_id');
        $mapelId = $request->input('mapel_id');

        $kelas = $kelasId ? Kelas::find($kelasId) : null;
        $mapel = $mapelId ? Mapel::find($mapelId) : null;

        $query = AbsensiMurid::with('murid')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->when($kelasId, fn($q) => $q->where('kelas_id', $kelasId))
            ->when($mapelId, fn($q) => $q->where('mapel_id', $mapelId));

        $rekap = $query->get()
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
            })->values();

        return response()->json([
            'kelas' => $kelas ? [
                'id' => $kelas->id,
                'nama' => $kelas->nama ?? ($kelas->nama_kelas ?? null),
                'nama_kelas' => $kelas->nama_kelas ?? ($kelas->nama ?? null),
            ] : null,
            'mapel' => $mapel ? [
                'id' => $mapel->id,
                'nama' => $mapel->nama ?? ($mapel->nama_mapel ?? null),
                'nama_mapel' => $mapel->nama_mapel ?? ($mapel->nama ?? null),
            ] : null,
            'bulan' => (int)$bulan,
            'tahun' => (int)$tahun,
            'rekap' => $rekap,
        ]);
    }

   public function showMurid($id, Request $request)
{
    $tahun   = $request->input('tahun', now()->year);
    $kelasId = $request->input('kelas_id');
    $mapelId = $request->input('mapel_id');

    $murid = User::findOrFail($id);
    $kelas = $kelasId ? Kelas::find($kelasId) : null;
    $mapel = $mapelId ? Mapel::find($mapelId) : null;

    $absensi = AbsensiMurid::query()
        ->where('murid_id', $id)
        ->when($kelasId, fn($q) => $q->where('kelas_id', $kelasId))
        ->when($mapelId, fn($q) => $q->where('mapel_id', $mapelId))
        ->whereYear('tanggal', $tahun)
        ->get();

    // --- Statistik Mingguan ---
    $weekly = $absensi->groupBy(fn($a) => Carbon::parse($a->tanggal)->weekOfMonth);
    $weekLabels = [];
    $weekValues = ['hadir' => [], 'sakit' => [], 'izin' => [], 'alpha' => []];

    foreach ($weekly as $week => $items) {
        $weekLabels[] = "M{$week}";
        $weekValues['hadir'][] = $items->where('status', 'hadir')->count();
        $weekValues['sakit'][] = $items->where('status', 'sakit')->count();
        $weekValues['izin'][]  = $items->where('status', 'izin')->count();
        $weekValues['alpha'][] = $items->where('status', 'alpha')->count();
    }

    // --- Statistik Bulanan ---
    $monthLabels = [];
    $monthValues = ['hadir' => [], 'sakit' => [], 'izin' => [], 'alpha' => []];

    for ($m = 1; $m <= 12; $m++) {
        $from = Carbon::create($tahun, $m, 1)->startOfDay();
        $to   = Carbon::create($tahun, $m, 1)->endOfMonth()->endOfDay();

        $monthLabels[] = Carbon::create()->month($m)->format('M');
        $monthValues['hadir'][] = $absensi->whereBetween('tanggal', [$from, $to])->where('status', 'hadir')->count();
        $monthValues['sakit'][] = $absensi->whereBetween('tanggal', [$from, $to])->where('status', 'sakit')->count();
        $monthValues['izin'][]  = $absensi->whereBetween('tanggal', [$from, $to])->where('status', 'izin')->count();
        $monthValues['alpha'][] = $absensi->whereBetween('tanggal', [$from, $to])->where('status', 'alpha')->count();
    }

    return response()->json([
        'murid' => [
            'id' => $murid->id,
            'name' => $murid->name,
        ],
        'kelas' => $kelas ? [
            'id' => $kelas->id,
            'nama' => $kelas->nama ?? ($kelas->nama_kelas ?? null),
        ] : null,
        'mapel' => $mapel ? [
            'id' => $mapel->id,
            'nama' => $mapel->nama ?? ($mapel->nama_mapel ?? null),
        ] : null,
        'tahun' => (int) $tahun,
        'week' => [
            'labels' => $weekLabels,
            'values' => $weekValues,
        ],
        'month' => [
            'labels' => $monthLabels,
            'values' => $monthValues,
        ],
    ]);
}

    public function laporanMurid(Request $request)
{
    $request->validate([
        'kelas_id' => 'nullable|exists:kelas,id',
        'mapel_id' => 'nullable|exists:mapels,id',
    ]);

    $query = AbsensiMurid::query()
        ->when($request->kelas_id, fn($q) => $q->where('kelas_id', $request->kelas_id))
        ->when($request->mapel_id, fn($q) => $q->where('mapel_id', $request->mapel_id));

    $rekap = $query->selectRaw('
            murid_id,
            SUM(status = "hadir") as hadir,
            SUM(status = "sakit") as sakit,
            SUM(status = "izin") as izin,
            SUM(status = "alpha") as alpha
        ')
        ->groupBy('murid_id')
        ->with('murid:id,name')
        ->get()
        ->map(fn($r) => [
            'id'    => $r->murid_id,
            'name'  => $r->murid->name ?? '—',
            'hadir' => (int) $r->hadir,
            'sakit' => (int) $r->sakit,
            'izin'  => (int) $r->izin,
            'alpha' => (int) $r->alpha,
        ]);

    $kelasInfo = null;
    if ($request->kelas_id) {
        $kelasInfo = \App\Models\Kelas::find($request->kelas_id);
    }

    return response()->json([
        'kelas' => $kelasInfo,
        'rekap' => $rekap,
    ]);
}
    public function exportHarian(Request $request)
    {
        $tanggal = $request->input('tanggal', Carbon::now()->toDateString());
        $kelasId = $request->input('kelas_id');
        $mapelId = $request->input('mapel_id');

        return Excel::download(
            new AbsensiMuridExport('harian', $tanggal, null, null, $kelasId, $mapelId),
            "Absensi_Murid_Harian_{$tanggal}" . ($kelasId ? "_Kelas{$kelasId}" : "") . ($mapelId ? "_Mapel{$mapelId}" : "") . ".xlsx"
        );
    }
    public function exportBulanan(Request $request)
    {
        $bulan   = $request->input('bulan', Carbon::now()->month);
        $tahun   = $request->input('tahun', Carbon::now()->year);
        $kelasId = $request->input('kelas_id');
        $mapelId = $request->input('mapel_id');

        return Excel::download(
            new AbsensiMuridExport('bulanan', null, $bulan, $tahun, $kelasId, $mapelId),
            "Absensi_Murid_Bulanan_{$bulan}_{$tahun}" . ($kelasId ? "_Kelas{$kelasId}" : "") . ($mapelId ? "_Mapel{$mapelId}" : "") . ".xlsx"
        );
    }
}