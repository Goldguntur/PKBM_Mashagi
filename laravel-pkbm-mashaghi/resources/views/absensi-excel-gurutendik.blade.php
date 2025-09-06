<h2 style="text-align:center; margin-bottom:20px;">Laporan Absensi Guru & Tendik</h2>

<table  cellspacing="0" cellpadding="5" style="margin-bottom:30px; width:100%;">
    <thead style="background-color: #f2f2f2; font-weight: bold; text-align: center;">
        <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Tanggal</th>
            <th>Hari</th>
            <th>Status</th>
            <th>Jam Masuk</th>
            <th>Jam Pulang</th>
            <th>Keterangan</th>
        </tr>
    </thead>
    <tbody>
        @foreach($rekap as $i => $r)
        <tr>
            <td style="text-align: center;">{{ $i+1 }}</td>
            <td>{{ $r->user->name }}</td>
            <td>{{ \Carbon\Carbon::parse($r->tanggal)->format('d-m-Y') }}</td>
            <td>{{ \Carbon\Carbon::parse($r->tanggal)->translatedFormat('l') }}</td>
            <td style="text-align: center; 
                @if($r->status == 'hadir') background-color:#c6efce; color:#006100;
                @elseif($r->status == 'sakit') background-color:#ffeb9c; color:#9c6500;
                @elseif($r->status == 'izin') background-color:#c9daf8; color:#073763;
                @else background-color:#f4cccc; color:#990000; @endif
            ">
                {{ ucfirst($r->status) }}
            </td>
            <td style="text-align: center;">{{ $r->jam_masuk ?? '-' }}</td>
            <td style="text-align: center;">{{ $r->jam_pulang ?? '-' }}</td>
            <td>{{ $r->keterangan ?? '-' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>


<h3 style="margin-bottom:10px;">Rekapitulasi Kehadiran</h3>
<table  cellspacing="0" cellpadding="5" style="width:60%;">
    <thead style="background-color:#d9d9d9; font-weight:bold; text-align:center;">
        <tr>
            <th>Nama</th>
            <th>Hadir</th>
            <th>Sakit</th>
            <th>Izin</th>
            <th>Alpha</th>
            <th>Total Hari</th>
        </tr>
    </thead>
    <tbody>
        @php
            $grouped = $rekap->groupBy('user_id');
        @endphp
        @foreach($grouped as $items)
            @php
                $user = $items->first()->user;
                $hadir = $items->where('status','hadir')->count();
                $sakit = $items->where('status','sakit')->count();
                $izin  = $items->where('status','izin')->count();
                $alpha = $items->where('status','alpha')->count();
                $total = $hadir + $sakit + $izin + $alpha;
            @endphp
            <tr>
                <td>{{ $user->name }}</td>
                <td style="text-align:center; background-color:#c6efce;">{{ $hadir }}</td>
                <td style="text-align:center; background-color:#ffeb9c;">{{ $sakit }}</td>
                <td style="text-align:center; background-color:#c9daf8;">{{ $izin }}</td>
                <td style="text-align:center; background-color:#f4cccc;">{{ $alpha }}</td>
                <td style="text-align:center;">{{ $total }}</td>
            </tr>
        @endforeach
    </tbody>
</table>