<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactMessage::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    public function update(Request $request, $id)
    {
        $msg = ContactMessage::findOrFail($id);

        $request->validate([
            'status'     => 'in:unread,read,replied',
            'admin_note' => 'nullable|string|max:1000',
        ]);

        $msg->update($request->only(['status', 'admin_note']));

        return response()->json([
            'message' => 'Cập nhật thành công',
            'contact' => $msg,
        ]);
    }

    public function destroy($id)
    {
        ContactMessage::findOrFail($id)->delete();
        return response()->json(['message' => 'Đã xóa tin nhắn']);
    }

    public function unreadCount()
    {
        return response()->json([
            'count' => ContactMessage::where('status', 'unread')->count(),
        ]);
    }
}