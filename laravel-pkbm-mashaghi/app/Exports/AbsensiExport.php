<?php

namespace App\Exports;

use App\Models\AbsensiGuruTendik;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class AbsensiExport implements FromView
{
    protected $bulan, $tahun;

    public function __construct($bulan, $tahun)
    {
        $this->bulan = $bulan;
        $this->tahun = $tahun;
    }

    public function view(): View
    {
        $rekap = AbsensiGuruTendik::with('user')
            ->whereMonth('tanggal', $this->bulan)
            ->whereYear('tanggal', $this->tahun)
            ->get();

        return view('exports.absensi', [
            'rekap' => $rekap,
            'bulan' => $this->bulan,
            'tahun' => $this->tahun,
        ]);
    }
}