<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index()
    {
        return response()->json(Page::latest()->get());
    }

    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $request->validate([
            'title'           => 'required|string|max:255',
            'content'         => 'required|string',
            'seo_title'       => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'is_active'       => 'nullable|boolean',
        ]);

        $page->update($request->only([
            'title', 'content', 'seo_title',
            'seo_description', 'is_active',
        ]));

        return response()->json([
            'message' => 'Cập nhật trang thành công',
            'page'    => $page,
        ]);
    }
}