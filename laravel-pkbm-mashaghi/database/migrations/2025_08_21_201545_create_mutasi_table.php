<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('mutasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('kelas_asal_id')->nullable()->constrained('kelas');
            $table->foreignId('kelas_tujuan_id')->nullable()->constrained('kelas');
            $table->foreignId('mapel_asal_id')->nullable()->constrained('mapels');
            $table->foreignId('mapel_tujuan_id')->nullable()->constrained('mapels');
            $table->enum('jenis', [
                'murid_pindah_kelas', 'murid_naik_kelas', 'murid_lulus', 'murid_keluar',
                'guru_pindah_mapel', 'guru_keluar',
                'tendik_keluar'
            ]);
            $table->enum('status', ['pending', 'disetujui', 'ditolak'])->default('pending');
            $table->text('alasan')->nullable();
            $table->timestamps();
        });

        Schema::create('histori_mutasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mutasi_id')->constrained('mutasis')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('aksi'); // pindah kelas, naik kelas, keluar, dll
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('histori_mutasis');
        Schema::dropIfExists('mutasis');
    }
};
