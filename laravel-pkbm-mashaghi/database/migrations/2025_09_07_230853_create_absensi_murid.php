<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absensi_murid', function (Blueprint $table) {
            $table->id();

            // relasi
            $table->foreignId('murid_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('mapel_id')->constrained('mapels')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');

            // data absensi
            $table->date('tanggal');
            $table->time('waktu');
            $table->enum('status', ['hadir', 'izin', 'sakit', 'alpha']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi_murid');
    }
};