<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use App\Models\UserNotification;
use Illuminate\Http\Request;

class PengumumanController extends Controller
{
    // Ambil semua pengumuman + jumlah unread
    public function index(Request $request)
    {
        // Ambil semua pengumuman global
        $global = Pengumuman::orderBy('created_at', 'desc')->get();

        // Inisialisasi array personal notif
        $personal = collect([]);

        // Kalau user login → ambil notif personal
        if ($request->user()) {
            $userId = $request->user()->id;
            $personal = UserNotification::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        // Gabungkan global + personal
        $pengumuman = $global->merge($personal)->sortByDesc('created_at')->values();

        // Hitung unread
        $unreadCount = $pengumuman->where('is_read', false)->count();

        // Kalau ada query reset → tandai semua dibaca
        if ($request->has('reset') && $request->reset == 1) {
            // Reset global
            Pengumuman::where('is_read', false)->update(['is_read' => true]);

            // Reset personal
            if ($request->user()) {
                UserNotification::where('user_id', $request->user()->id)
                    ->where('is_read', false)
                    ->update(['is_read' => true]);
            }

            $unreadCount = 0;
        }

        return response()->json([
            'data' => $pengumuman->values(),
            'unread_count' => $unreadCount
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal' => 'required|date',
        ]);

        // default is_read = false
        $pengumuman = Pengumuman::create(array_merge($validated, [
            'is_read' => false
        ]));

        $unreadCount = Pengumuman::where('is_read', false)->count();

        return response()->json([
            'message' => 'Pengumuman berhasil dibuat',
            'data' => $pengumuman,
            'unread_count' => $unreadCount
        ], 201);
    }

    // Reset badge (tandai semua dibaca)
    public function resetBadge()
    {
        Pengumuman::where('is_read', false)->update(['is_read' => true]);
        $unreadCount = Pengumuman::where('is_read', false)->count();

        return response()->json([
            'message' => 'Badge reset',
            'unread_count' => $unreadCount
        ]);
    }
}