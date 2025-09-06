<?php

namespace App\Exports;

use App\Models\AbsensiGuruTendik;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AbsensiExport implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithStyles
{
    protected $mode;
    protected $tanggal;
    protected $bulan;
    protected $tahun;

    public function __construct($mode, $tanggal = null, $bulan = null, $tahun = null)
    {
        $this->mode    = $mode;
        $this->tanggal = $tanggal;
        $this->bulan   = $bulan ?? now()->month;
        $this->tahun   = $tahun ?? now()->year;
    }

    public function collection()
    {
        if ($this->mode === 'harian') {
            return AbsensiGuruTendik::with('user')
                ->whereDate('tanggal', $this->tanggal)
                ->get();
        }

        return AbsensiGuruTendik::with('user')
            ->whereYear('tanggal', $this->tahun)
            ->whereMonth('tanggal', $this->bulan)
            ->get()
            ->groupBy('user_id');
    }

    public function headings(): array
    {
        if ($this->mode === 'harian') {
            return [
                ['Absensi Harian - ' . Carbon::parse($this->tanggal)->locale('id')->translatedFormat('d F Y')],
                ['Nama', 'Hari', 'Tanggal', 'Status', 'Jam Masuk', 'Jam Pulang'],
            ];
        }

        $start = Carbon::create($this->tahun, $this->bulan, 1)->locale('id');
        $end   = $start->copy()->endOfMonth();
        $days  = range(1, $end->day);

        return [
            ['Absensi Bulanan - ' . $start->translatedFormat('F Y')],
            array_merge(['Nama'], $days, ['Jumlah Hadir', 'Sakit', 'Izin', 'Alpha']),
        ];
    }

    public function map($item): array
    {
        if ($this->mode === 'harian') {
            return [
                $item->user->name ?? '-',
                Carbon::parse($item->tanggal)->translatedFormat('l'),
                Carbon::parse($item->tanggal)->translatedFormat('d-m-Y'),
                ucfirst($item->status ?? '-'),
                $item->jam_masuk ?? '-',
                $item->jam_pulang ?? '-',
            ];
        }

        $end  = Carbon::create($this->tahun, $this->bulan, 1)->endOfMonth();
        $days = range(1, $end->day);

        $row = [$item->first()->user->name ?? '-'];

        foreach ($days as $day) {
            $absen = $item->where('tanggal', Carbon::create($this->tahun, $this->bulan, $day)->toDateString())->first();
            $status = $absen->status ?? '';
            $row[] = $status ? strtoupper(substr($status, 0, 1)) : '';
        }

        $row[] = $item->where('status', 'hadir')->count();
        $row[] = $item->where('status', 'sakit')->count();
        $row[] = $item->where('status', 'izin')->count();
        $row[] = $item->where('status', 'alpha')->count();

        return $row;
    }

    public function title(): string
    {
        return $this->mode === 'harian' ? 'Harian' : 'Bulanan';
    }

 public function styles(Worksheet $sheet)
{
    $highestCol = $sheet->getHighestColumn();
    $highestRow = $sheet->getHighestRow();

    $sheet->mergeCells("A1:{$highestCol}1");
    $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
    $sheet->getStyle('A1')->getAlignment()->setHorizontal('center')->setVertical('center');

    $sheet->getStyle("A2:{$highestCol}2")->getFont()->setBold(true);
    $sheet->getStyle("A2:{$highestCol}2")->getFill()
        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
        ->getStartColor()->setARGB('FFEFEFEF');

    $sheet->getStyle("A3:{$highestCol}{$highestRow}")
        ->getAlignment()->setHorizontal('center')->setVertical('center');

    $sheet->getStyle("A2:{$highestCol}{$highestRow}")
        ->getBorders()->getAllBorders()
        ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

    return [];
}
}