<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_mapel',
        'nama_mapel',
        'deskripsi',
    ];

    public function guru()
    {
        return $this->belongsToMany(User::class, 'guru_mapel', 'mapel_id', 'guru_id');
    }

    public function kelas()
    {
        return $this->belongsToMany(Kelas::class, 'kelas_mapel', 'mapel_id', 'kelas_id');
    }
}