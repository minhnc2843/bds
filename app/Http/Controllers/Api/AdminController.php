<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\Request;
use App\Events\ListingStatusChanged;
use App\Models\Notification;
class AdminController extends Controller
{
    // =====================
    // DASHBOARD THỐNG KÊ
    // =====================
    public function dashboard()
    {
        return response()->json([
            'total_users'            => User::count(),
            'total_listings'         => Listing::count(),
            'pending_listings'       => Listing::where('status', 'pending')->count(),
            'active_listings'        => Listing::where('status', 'active')->count(),
            'rejected_listings'      => Listing::where('status', 'rejected')->count(),
            'listings_sale'          => Listing::where('type', 'sale')->count(),
            'listings_rent'          => Listing::where('type', 'rent')->count(),
            'new_users_this_month'   => User::whereMonth('created_at', now()->month)->count(),
            'new_listings_this_month'=> Listing::whereMonth('created_at', now()->month)->count(),
        ]);
    }

    // =====================
    // QUẢN LÝ TIN ĐĂNG
    // =====================

    // Lấy tất cả tin (có filter status)
    public function listings(Request $request)
    {
        $query = Listing::with([
            'category',
            'province',
            'primaryImage',
            'user:id,name,email,phone',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('address', 'like', "%{$keyword}%");
            });
        }

        $listings = $query->orderBy('created_at', 'desc')
                          ->paginate($request->get('per_page', 15));

        return response()->json($listings);
    }

    // Duyệt tin
   public function approveListing($id)
{
    $listing = Listing::with('user')->findOrFail($id);
    $listing->update([
        'status'     => 'active',
        'expired_at' => now()->addDays(30),
    ]);

    // Lưu notification vào DB
    Notification::create([
        'user_id' => $listing->user_id,
        'type'    => 'listing_approved',
        'title'   => 'Tin đăng được duyệt ✅',
        'body'    => "Tin \"{$listing->title}\" đã được duyệt và đang hiển thị.",
        'data'    => ['listing_id' => $listing->id],
    ]);

    // Broadcast realtime
    broadcast(new ListingStatusChanged($listing, 'active'))->toOthers();

    return response()->json([
        'message' => 'Duyệt tin thành công',
        'listing' => $listing,
    ]);
}

    // Từ chối tin
    public function rejectListing(Request $request, $id)
{
    $listing = Listing::with('user')->findOrFail($id);
    $listing->update(['status' => 'rejected']);

    Notification::create([
        'user_id' => $listing->user_id,
        'type'    => 'listing_rejected',
        'title'   => 'Tin đăng bị từ chối ❌',
        'body'    => "Tin \"{$listing->title}\" đã bị từ chối. Vui lòng chỉnh sửa lại.",
        'data'    => ['listing_id' => $listing->id],
    ]);

    broadcast(new ListingStatusChanged($listing, 'rejected'))->toOthers();

    return response()->json([
        'message' => 'Đã từ chối tin đăng',
        'listing' => $listing,
    ]);
}

    // Xóa tin (admin)
    public function deleteListing($id)
    {
        $listing = Listing::findOrFail($id);

        foreach ($listing->images as $image) {
            \Storage::disk('public')->delete($image->image_path);
        }

        $listing->delete();

        return response()->json([
            'message' => 'Xóa tin thành công',
        ]);
    }

    // =====================
    // QUẢN LÝ USER
    // =====================

    // Danh sách user
    public function users(Request $request)
    {
        $query = User::withCount('listings');

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('email', 'like', "%{$keyword}%")
                  ->orWhere('phone', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('created_at', 'desc')
                       ->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    // Chi tiết 1 user + tin đăng của họ
    public function showUser($id)
    {
        $user = User::withCount('listings')
            ->findOrFail($id);

        $listings = Listing::with(['category', 'province', 'primaryImage'])
            ->where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'user'     => $user,
            'listings' => $listings,
        ]);
    }

    // Nâng/hạ quyền user
    public function updateUserRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        // Không cho tự thay đổi quyền của chính mình
        if (auth()->id() == $id) {
            return response()->json([
                'message' => 'Không thể thay đổi quyền của chính mình',
            ], 422);
        }

        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => 'Cập nhật quyền thành công',
            'user'    => $user,
        ]);
    }

    // Khóa / mở khóa user (xóa toàn bộ token)
    public function toggleBanUser($id)
    {
        if (auth()->id() == $id) {
            return response()->json([
                'message' => 'Không thể tự khóa chính mình',
            ], 422);
        }

        $user = User::findOrFail($id);

        // Xóa tất cả token → user bị đăng xuất ngay lập tức
        $user->tokens()->delete();

        // Dùng banned_at để đánh dấu
        if ($user->banned_at) {
            $user->update(['banned_at' => null]);
            $message = 'Đã mở khóa tài khoản';
        } else {
            $user->update(['banned_at' => now()]);
            $message = 'Đã khóa tài khoản';
        }

        return response()->json([
            'message' => $message,
            'user'    => $user,
        ]);
    }

    // Xóa user
    public function deleteUser($id)
    {
        if (auth()->id() == $id) {
            return response()->json([
                'message' => 'Không thể tự xóa chính mình',
            ], 422);
        }

        $user = User::findOrFail($id);

        // Xóa ảnh các listing của user
        foreach ($user->listings as $listing) {
            foreach ($listing->images as $image) {
                \Storage::disk('public')->delete($image->image_path);
            }
        }

        $user->delete();

        return response()->json([
            'message' => 'Xóa tài khoản thành công',
        ]);
    }
}