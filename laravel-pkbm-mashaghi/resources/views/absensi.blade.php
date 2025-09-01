<table>
    <thead>
        <tr>
            <th>Nama</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Jam Masuk</th>
            <th>Jam Pulang</th>
        </tr>
    </thead>
    <tbody>
        @foreach($rekap as $r)
        <tr>
            <td>{{ $r->user->name }}</td>
            <td>{{ $r->tanggal }}</td>
            <td>{{ $r->status }}</td>
            <td>{{ $r->jam_masuk }}</td>
            <td>{{ $r->jam_pulang }}</td>
        </tr>
        @endforeach
    </tbody>
</table>