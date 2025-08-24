<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mutasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'kelas_asal_id',
        'kelas_tujuan_id',
        'mapel_asal_id',
        'mapel_tujuan_id',
        'jenis',
        'status',
        'alasan'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelasAsal()
    {
        return $this->belongsTo(Kelas::class, 'kelas_asal_id');
    }

    public function kelasTujuan()
    {
        return $this->belongsTo(Kelas::class, 'kelas_tujuan_id');
    }

    public function histori()
    {
        return $this->hasMany(HistoriMutasi::class);
    }
}