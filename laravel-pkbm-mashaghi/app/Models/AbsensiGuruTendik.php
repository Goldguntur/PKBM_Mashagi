<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbsensiGuruTendik extends Model
{
    use HasFactory;

    protected $table = 'absensi_guru_tendik';

    protected $fillable = [
        'user_id',
        'tanggal',
        'jam_masuk',
        'jam_pulang',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}