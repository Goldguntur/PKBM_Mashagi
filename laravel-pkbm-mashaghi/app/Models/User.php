<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory, SoftDeletes;

    protected $fillable = [
        'username',
        'name',
        'email',
        'no_wa',
        'nisn',
        'nik',
        'kelas_id',
        'mapel_ids',
        'tanggal_lahir',
        'password',
        'role',
        'deleted_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'mapel_ids' => 'array',
    ];

     public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

   public function mapels()
{
    return $this->belongsToMany(Mapel::class, 'guru_mapel', 'guru_id', 'mapel_id');
}
}