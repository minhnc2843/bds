<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        return response()->json(
            Banner::orderBy('order')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'subtitle'    => 'nullable|string|max:500',
            'image'       => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'button_text' => 'nullable|string|max:50',
            'button_link' => 'nullable|string|max:255',
            'order'       => 'nullable|integer',
        ]);

        $path = $request->file('image')
            ->store('banners', 'public');

        $banner = Banner::create([
            'title'       => $request->title,
            'subtitle'    => $request->subtitle,
            'image_path'  => $path,
            'button_text' => $request->button_text,
            'button_link' => $request->button_link,
            'order'       => $request->order ?? 0,
            'is_active'   => true,
        ]);

        return response()->json([
            'message' => 'Tạo banner thành công',
            'banner'  => $banner,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $request->validate([
            'title'       => 'required|string|max:255',
            'subtitle'    => 'nullable|string|max:500',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'button_text' => 'nullable|string|max:50',
            'button_link' => 'nullable|string|max:255',
            'order'       => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            \Storage::disk('public')->delete($banner->image_path);
            $banner->image_path = $request->file('image')
                ->store('banners', 'public');
        }

        $banner->update([
            'title'       => $request->title,
            'subtitle'    => $request->subtitle,
            'image_path'  => $banner->image_path,
            'button_text' => $request->button_text,
            'button_link' => $request->button_link,
            'order'       => $request->order ?? $banner->order,
            'is_active'   => $request->is_active ?? $banner->is_active,
        ]);

        return response()->json([
            'message' => 'Cập nhật banner thành công',
            'banner'  => $banner,
        ]);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        \Storage::disk('public')->delete($banner->image_path);
        $banner->delete();

        return response()->json(['message' => 'Đã xóa banner']);
    }

    // Sắp xếp thứ tự banner
    public function reorder(Request $request)
    {
        $request->validate([
            'orders'         => 'required|array',
            'orders.*.id'    => 'required|exists:banners,id',
            'orders.*.order' => 'required|integer',
        ]);

        foreach ($request->orders as $item) {
            Banner::where('id', $item['id'])
                ->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Đã cập nhật thứ tự']);
    }
}