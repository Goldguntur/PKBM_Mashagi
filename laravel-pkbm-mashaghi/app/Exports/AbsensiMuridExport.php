<?php

namespace App\Exports;

use App\Models\AbsensiMurid;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Mapel;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AbsensiMuridExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStyles, WithTitle, WithEvents
{
    protected $type;
    protected $tanggal;
    protected $bulan;
    protected $tahun;
    protected $kelasId;
    protected $mapelId;

    public function __construct($type = 'harian', $tanggal = null, $bulan = null, $tahun = null, $kelasId = null, $mapelId = null)
    {
        $this->type = $type;
        $this->tanggal = $tanggal;
        $this->bulan = $bulan;
        $this->tahun = $tahun;
        $this->kelasId = $kelasId;
        $this->mapelId = $mapelId;
    }

    public function collection()
    {
        return $this->type === 'harian'
            ? $this->collectionHarian()
            : $this->collectionBulanan();
    }

    /**
     * Harian:
     * - Jika kelasId ada -> tampilkan semua murid di kelas (walau belum absen).
     * - Ambil semua absensi murid di tanggal itu dalam 1 query, groupBy murid_id, pilih absen terakhir per murid.
     */
    protected function collectionHarian(): Collection
    {
        $rows = [];

        // Jika filter per kelas: ambil semua murid di kelas dulu
        if ($this->kelasId) {
            // eager load kelas
            $murids = User::with('kelas')
                ->where('role', 'pesertaDidik')
                ->where('kelas_id', $this->kelasId)
                ->orderBy('name')
                ->get();

            $muridIds = $murids->pluck('id')->toArray();

            $absensiQ = AbsensiMurid::with('mapel')
                ->whereDate('tanggal', $this->tanggal)
                ->whereIn('murid_id', $muridIds);

            if ($this->mapelId) {
                $absensiQ->where('mapel_id', $this->mapelId);
            }

            $absensi = $absensiQ->get()->groupBy('murid_id');

            $i = 1;
            foreach ($murids as $m) {
                $group = $absensi->get($m->id);

                // pilih record absen terakhir berdasarkan waktu (jika banyak)
                $rec = null;
                if ($group && $group->count() > 0) {
                    $rec = $group->sortByDesc(function ($item) {
                        // prefer 'waktu' if present, fallback to tanggal
                        return $item->waktu ?? $item->tanggal;
                    })->first();
                }

                $rows[] = [
                    $i++,
                    $m->name,
                    // ambil kelas dari User relasi (karena absensi mungkin ga menyimpan kelas_id)
                    optional($m->kelas)->nama_kelas ?? optional($m->kelas)->nama ?? "-",
                    // mapel dari rec (atau "-" jika belum absen)
                    $rec?->mapel?->nama ?? $rec?->mapel?->nama_mapel ?? "-",
                    $rec?->status ?? 'Belum Absen',
                    $rec?->waktu ?? "-",
                    $this->tanggal,
                ];
            }

            return collect($rows);
        }

        $recordsQ = AbsensiMurid::with(['murid.kelas', 'mapel'])
            ->whereDate('tanggal', $this->tanggal);

        if ($this->mapelId) {
            $recordsQ->where('mapel_id', $this->mapelId);
        }

        $records = $recordsQ->orderBy('kelas_id')->orderBy('murid_id')->get();

        $i = 1;
        foreach ($records as $r) {
            $rows[] = [
                $i++,
                $r->murid->name ?? "-",
                $r->murid->kelas?->nama_kelas ?? $r->murid->kelas?->nama ?? "-",
                $r->mapel?->nama ?? $r->mapel?->nama_mapel ?? "-",
                $r->status ?? 'Belum Absen',
                $r->waktu ?? "-",
                Carbon::parse($r->tanggal)->toDateString(),
            ];
        }

        return collect($rows);
    }

    protected function collectionBulanan(): Collection
    {
        $rows = [];

        $bulan = $this->bulan ?? Carbon::now()->month;
        $tahun = $this->tahun ?? Carbon::now()->year;

        if ($this->kelasId) {
            $murids = User::with('kelas')
                ->where('role', 'pesertaDidik')
                ->where('kelas_id', $this->kelasId)
                ->orderBy('name')
                ->get();

            $muridIds = $murids->pluck('id')->toArray();

            $absensiQ = AbsensiMurid::whereIn('murid_id', $muridIds)
                ->whereMonth('tanggal', $bulan)
                ->whereYear('tanggal', $tahun);

            if ($this->mapelId) {
                $absensiQ->where('mapel_id', $this->mapelId);
            }

            $absensiGrouped = $absensiQ->get()->groupBy('murid_id');

            $i = 1;
            foreach ($murids as $m) {
                $items = $absensiGrouped->get($m->id) ?? collect();

                $hadir = $items->where('status', 'hadir')->count();
                $sakit = $items->where('status', 'sakit')->count();
                $izin  = $items->where('status', 'izin')->count();
                $alpha = $items->where('status', 'alpha')->count();
                $total = $hadir + $sakit + $izin + $alpha;

                $rows[] = [
                    $i++,
                    $m->name,
                    optional($m->kelas)->nama_kelas ?? optional($m->kelas)->nama ?? "-",
                    $hadir,
                    $sakit,
                    $izin,
                    $alpha,
                    $total,
                ];
            }

            return collect($rows);
        }

        $recordsQ = AbsensiMurid::with('murid', 'kelas')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        if ($this->mapelId) {
            $recordsQ->where('mapel_id', $this->mapelId);
        }

        $recordsGrouped = $recordsQ->get()->groupBy('murid_id');

        $i = 1;
        foreach ($recordsGrouped as $muridId => $items) {
            $murid = $items->first()->murid;
            $hadir = $items->where('status', 'hadir')->count();
            $sakit = $items->where('status', 'sakit')->count();
            $izin  = $items->where('status', 'izin')->count();
            $alpha = $items->where('status', 'alpha')->count();
            $total = $hadir + $sakit + $izin + $alpha;

            $rows[] = [
                $i++,
                $murid->name ?? "-",
                optional($items->first()->kelas)->nama_kelas ?? optional($items->first()->kelas)->nama ?? "-",
                $hadir,
                $sakit,
                $izin,
                $alpha,
                $total,
            ];
        }

        return collect($rows);
    }
    
    public function headings(): array
    {
        $kelasInfo = $this->kelasId ? (Kelas::find($this->kelasId)?->nama_kelas ?? Kelas::find($this->kelasId)?->nama) : "Semua Kelas";
        $mapelInfo = $this->mapelId ? (Mapel::find($this->mapelId)?->nama ?? Mapel::find($this->mapelId)?->nama_mapel) : "Semua Mapel";

        if ($this->type === 'harian') {
            return [
                ["LAPORAN ABSENSI HARIAN MURID"],
                ["Tanggal: " . Carbon::parse($this->tanggal)->translatedFormat('d F Y')],
                ["Kelas: " . ($kelasInfo ?? "—")],
                ["Mapel: " . ($mapelInfo ?? "—")],
                [""],
                ['No', 'Nama Murid', 'Kelas', 'Mapel', 'Status', 'Waktu', 'Tanggal']
            ];
        }

        return [
            ["LAPORAN ABSENSI BULANAN MURID"],
            ["Bulan: " . Carbon::create($this->tahun, $this->bulan)->translatedFormat('F Y')],
            ["Kelas: " . ($kelasInfo ?? "—")],
            ["Mapel: " . ($mapelInfo ?? "—")],
            [""],
            ['No', 'Nama Murid', 'Kelas', 'Hadir', 'Sakit', 'Izin', 'Alpha', 'Total']
        ];
    }

   public function styles(Worksheet $sheet)
{
    return [
        1 => [
            'font' => ['bold' => true, 'size' => 16],
            'alignment' => ['horizontal' => 'center'],
        ],
        2 => [
            'font' => ['italic' => true, 'size' => 11],
            'alignment' => ['horizontal' => 'center'],
        ],
        3 => ['alignment' => ['horizontal' => 'center']],
        4 => ['alignment' => ['horizontal' => 'center']],
        6 => [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => 'solid',
                'startColor' => ['rgb' => '2F5597'],
            ],
            'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
        ],
    ];
}


    public function title(): string
    {
        if ($this->type === 'harian') {
            return "Harian_" . Carbon::parse($this->tanggal)->format('d-m-Y');
        }

        return "Bulanan_" . ($this->bulan ?? Carbon::now()->month) . "-" . ($this->tahun ?? Carbon::now()->year);
    }

 public function registerEvents(): array
{
    return [
        AfterSheet::class => function (AfterSheet $event) {
            $sheet = $event->sheet->getDelegate();
            $highestRow = $sheet->getHighestRow();
            $highestCol = $sheet->getHighestColumn();

            // Merge judul utama
            $sheet->mergeCells("A1:{$highestCol}1");

            // Merge baris informasi (tanggal, kelas, mapel)
            $sheet->mergeCells("A2:{$highestCol}2");
            $sheet->mergeCells("A3:{$highestCol}3");
            $sheet->mergeCells("A4:{$highestCol}4");

            // Border untuk semua cell tabel
            $sheet->getStyle("A6:{$highestCol}{$highestRow}")
                ->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

            // Posisi tanda tangan
            $startRow = $highestRow + 3;
            $sheet->setCellValue("B{$startRow}", "Mengetahui,");
            $sheet->setCellValue("B" . ($startRow + 1), "Kepala Sekolah");
            $sheet->setCellValue("F{$startRow}", "Wali Kelas");
            $sheet->setCellValue("F" . ($startRow + 1), "(_______)");
            $sheet->setCellValue("B" . ($startRow + 5), "(_______)");

            // Rata tengah tanda tangan
            $sheet->getStyle("B{$startRow}:F" . ($startRow + 5))
                ->getAlignment()->setHorizontal('center');
        },
    ];
}
}