<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Đăng ký
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'phone'    => 'nullable|string|max:15',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
            'phone'    => $request->phone,
            'role'     => 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng ký thành công',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    // Đăng nhập
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email hoặc mật khẩu không đúng.'],
            ]);
        }
        // Thêm sau dòng kiểm tra password
        if ($user->banned_at) {
            return response()->json([
                'message' => 'Tài khoản đã bị khóa, vui lòng liên hệ admin',
            ], 403);
        }
        // Xóa token cũ, tạo token mới
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    // Lấy thông tin user đang đăng nhập
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // Đăng xuất
    public function logout(Request $request)
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập hoặc token không hợp lệ',
            ], 401);
        }

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công',
        ]);
    }
}
