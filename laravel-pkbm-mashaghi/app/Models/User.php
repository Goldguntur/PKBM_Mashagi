<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $fillable = [
        'username',
        'name',
        'email',
        'no_wa',
        'nisn',
        'nik',
        'kelas',
        'tanggal_lahir',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}