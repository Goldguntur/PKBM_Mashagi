<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriMutasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'mutasi_id',
        'user_id',
        'aksi',
        'keterangan'
    ];

    public function mutasi()
    {
        return $this->belongsTo(Mutasi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}