<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absensi_guru_tendik', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // guru / tendik
            $table->date('tanggal');               // tanggal absensi
            $table->time('jam_masuk')->nullable(); // jam hadir
            $table->time('jam_pulang')->nullable();// jam pulang
            $table->enum('status', ['hadir', 'izin', 'sakit', 'alpha'])->default('hadir');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi_guru_tendik');
    }
};