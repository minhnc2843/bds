<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|max:100',
            'phone'   => 'nullable|string|max:15',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        ContactMessage::create($request->all());

        return response()->json([
            'message' => 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.',
        ], 201);
    }
}