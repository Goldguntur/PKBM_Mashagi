<?php

namespace App\Http\Controllers;

use PDF;
use App\Exports\AbsensiExport;
use App\Models\AbsensiGuruTendik;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class LaporanAbsensiController extends Controller
{
    public function exportExcel(Request $request)
    {
        $bulan = $request->bulan ?? now()->month;
        $tahun = $request->tahun ?? now()->year;

        return Excel::download(new AbsensiExport($bulan, $tahun), "laporan-absensi-$bulan-$tahun.xlsx");
    }

    public function exportPdf(Request $request)
    {
        $bulan = $request->bulan ?? now()->month;
        $tahun = $request->tahun ?? now()->year;

        $rekap = AbsensiGuruTendik::with('user')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->get();

        $pdf = FacadePdf::loadView('exports.absensi_pdf', compact('rekap', 'bulan', 'tahun'));
        return $pdf->download("laporan-absensi-$bulan-$tahun.pdf");
    }
}