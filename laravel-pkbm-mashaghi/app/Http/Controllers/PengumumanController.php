<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use App\Models\UserNotification;
use Illuminate\Http\Request;

class PengumumanController extends Controller
{
    public function index(Request $request)
    {

        Pengumuman::where('created_at', '<', now()->subDays(14))->delete();

        $global = Pengumuman::orderBy('created_at', 'desc')->get();

        $personal = collect([]);

        if ($request->user()) {
            $userId = $request->user()->id;
            $personal = UserNotification::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        $pengumuman = $global->merge($personal)->sortByDesc('created_at')->values();

        $unreadCount = $pengumuman->where('is_read', false)->count();

        if ($request->has('reset') && $request->reset == 1) {
            Pengumuman::where('is_read', false)->update(['is_read' => true]);

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

    public function show($id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        return response()->json($pengumuman);
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

    public function resetBadge()
    {
        Pengumuman::where('is_read', false)->update(['is_read' => true]);
        $unreadCount = Pengumuman::where('is_read', false)->count();

        return response()->json([
            'message' => 'Badge reset',
            'unread_count' => $unreadCount
        ]);
    }
     
    public function destroy($id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->delete();

        return response()->json([
            'message' => 'Pengumuman berhasil dihapus'
        ]);
    }

}