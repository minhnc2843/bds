<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListingRequest;
use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    // =====================
    // GET /listings — Danh sách (public, có filter)
    // =====================
    public function index(Request $request)
    {
        $query = Listing::with(['category', 'province', 'primaryImage'])
            ->where('status', 'active');

        // Filter theo loại: sale | rent
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter theo tỉnh/thành
        if ($request->filled('province_id')) {
            $query->where('province_id', $request->province_id);
        }

        // Filter theo danh mục
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter theo giá
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        // Filter theo diện tích
        if ($request->filled('area_min')) {
            $query->where('area', '>=', $request->area_min);
        }

        // Filter theo số phòng ngủ
        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', $request->bedrooms);
        }

        // Tìm kiếm theo từ khóa
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('address', 'like', "%{$keyword}%")
                  ->orWhere('district', 'like', "%{$keyword}%");
            });
        }

        // Sắp xếp
        $sortBy    = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['created_at', 'price', 'area'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $listings = $query->paginate($request->get('per_page', 12));

        return response()->json($listings);
    }

    // =====================
    // GET /listings/{id} — Chi tiết
    // =====================
    public function show($id)
    {
        $listing = Listing::with([
            'category',
            'province',
            'images',
            'user:id,name,phone,avatar',
        ])->where('status', 'active')->findOrFail($id);

        return response()->json($listing);
    }

    // =====================
    // POST /listings — Tạo tin mới (cần đăng nhập)
    // =====================
    public function store(ListingRequest $request)
    {
        $data = $request->validated();

        // Gán user đang đăng nhập
        $data['user_id']    = auth()->id();
        $data['status']     = 'pending'; // chờ admin duyệt
        $data['expired_at'] = now()->addDays(30);

        // Loại bỏ images khỏi data listing
        unset($data['images']);

        $listing = Listing::create($data);

        // Xử lý upload ảnh
        if ($request->hasFile('images')) {
            $this->uploadImages($listing, $request->file('images'));
        }

        return response()->json([
            'message' => 'Đăng tin thành công, chờ admin duyệt',
            'listing' => $listing->load('images'),
        ], 201);
    }

    // =====================
    // PUT /listings/{id} — Cập nhật (chủ tin)
    // =====================
    public function update(ListingRequest $request, $id)
    {
        $listing = Listing::where('user_id', auth()->id())
            ->findOrFail($id);

        $data = $request->validated();
        unset($data['images']);

        $listing->update($data);

        // Upload ảnh mới nếu có
        if ($request->hasFile('images')) {
            $this->uploadImages($listing, $request->file('images'));
        }

        return response()->json([
            'message' => 'Cập nhật thành công',
            'listing' => $listing->load('images'),
        ]);
    }

    // =====================
    // DELETE /listings/{id} — Xóa (chủ tin)
    // =====================
    public function destroy($id)
    {
        $listing = Listing::where('user_id', auth()->id())
            ->findOrFail($id);

        // Xóa ảnh trên storage
        foreach ($listing->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $listing->delete();

        return response()->json([
            'message' => 'Xóa tin thành công',
        ]);
    }

    // =====================
    // GET /my-listings — Tin của tôi
    // =====================
    public function myListings(Request $request)
    {
        $listings = Listing::with(['category', 'province', 'primaryImage'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($listings);
    }

    // =====================
    // DELETE /listings/{id}/images/{imageId} — Xóa 1 ảnh
    // =====================
    public function deleteImage($id, $imageId)
    {
        $listing = Listing::where('user_id', auth()->id())
            ->findOrFail($id);

        $image = ListingImage::where('listing_id', $listing->id)
            ->findOrFail($imageId);

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Xóa ảnh thành công']);
    }

    // =====================
    // Helper: Upload ảnh
    // =====================
    private function uploadImages(Listing $listing, array $images)
    {
        $isFirst = $listing->images()->count() === 0;

        foreach ($images as $index => $file) {
            $path = $file->store('listings/' . $listing->id, 'public');

            ListingImage::create([
                'listing_id' => $listing->id,
                'image_path' => $path,
                'is_primary' => $isFirst && $index === 0,
            ]);
        }
    }
}