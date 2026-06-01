<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index()
    {
        return response()->json(
            Promotion::orderBy('order')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'badge_text'  => 'nullable|string|max:20',
            'badge_color' => 'nullable|string|max:20',
            'link'        => 'nullable|string|max:255',
            'started_at'  => 'nullable|date',
            'ended_at'    => 'nullable|date|after_or_equal:started_at',
        ]);

        $path = $request->hasFile('image')
            ? $request->file('image')->store('promotions', 'public')
            : null;

        $promo = Promotion::create([
            ...$request->except('image'),
            'image_path' => $path,
            'is_active'  => true,
        ]);

        return response()->json([
            'message'   => 'Tạo khuyến mãi thành công',
            'promotion' => $promo,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $promo = Promotion::findOrFail($id);

        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'badge_text'  => 'nullable|string|max:20',
            'badge_color' => 'nullable|string|max:20',
            'link'        => 'nullable|string|max:255',
            'is_active'   => 'nullable|boolean',
            'started_at'  => 'nullable|date',
            'ended_at'    => 'nullable|date',
        ]);

        if ($request->hasFile('image')) {
            if ($promo->image_path) {
                \Storage::disk('public')->delete($promo->image_path);
            }
            $promo->image_path = $request->file('image')
                ->store('promotions', 'public');
        }

        $promo->update([
            ...$request->except('image'),
            'image_path' => $promo->image_path,
        ]);

        return response()->json([
            'message'   => 'Cập nhật thành công',
            'promotion' => $promo,
        ]);
    }

    public function destroy($id)
    {
        $promo = Promotion::findOrFail($id);
        if ($promo->image_path) {
            \Storage::disk('public')->delete($promo->image_path);
        }
        $promo->delete();

        return response()->json(['message' => 'Đã xóa khuyến mãi']);
    }
}