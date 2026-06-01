<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['category', 'author:id,name'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('keyword')) {
            $query->where('title', 'like', "%{$request->keyword}%");
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'            => 'required|string|max:255',
            'content'          => 'required|string',
            'excerpt'          => 'nullable|string|max:500',
            'post_category_id' => 'nullable|exists:post_categories,id',
            'thumbnail'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'status'           => 'in:draft,published',
            'is_featured'      => 'nullable|boolean',
            'tags'             => 'nullable|string',
            'seo_title'        => 'nullable|string|max:255',
            'seo_description'  => 'nullable|string|max:500',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')
                ->store('posts', 'public');
        }

        $tagsArray = $request->filled('tags')
            ? array_map('trim', explode(',', $request->tags))
            : null;

        $post = Post::create([
            'user_id'          => auth()->id(),
            'post_category_id' => $request->post_category_id,
            'title'            => $request->title,
            'slug'             => Str::slug($request->title) . '-' . time(),
            'excerpt'          => $request->excerpt,
            'content'          => $request->content,
            'thumbnail'        => $thumbnailPath,
            'status'           => $request->status ?? 'draft',
            'is_featured'      => $request->boolean('is_featured'),
            'tags'             => $tagsArray,
            'seo_title'        => $request->seo_title,
            'seo_description'  => $request->seo_description,
            'published_at'     => $request->status === 'published'
                ? now() : null,
        ]);

        return response()->json([
            'message' => 'Tạo bài viết thành công',
            'post'    => $post,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $request->validate([
            'title'            => 'required|string|max:255',
            'content'          => 'required|string',
            'excerpt'          => 'nullable|string|max:500',
            'post_category_id' => 'nullable|exists:post_categories,id',
            'thumbnail'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'status'           => 'in:draft,published',
            'is_featured'      => 'nullable|boolean',
            'tags'             => 'nullable|string',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($post->thumbnail) {
                \Storage::disk('public')->delete($post->thumbnail);
            }
            $post->thumbnail = $request->file('thumbnail')
                ->store('posts', 'public');
        }

        $tagsArray = $request->filled('tags')
            ? array_map('trim', explode(',', $request->tags))
            : $post->tags;

        // Set published_at khi chuyển sang published lần đầu
        $publishedAt = $post->published_at;
        if ($request->status === 'published' && !$publishedAt) {
            $publishedAt = now();
        }

        $post->update([
            'post_category_id' => $request->post_category_id,
            'title'            => $request->title,
            'excerpt'          => $request->excerpt,
            'content'          => $request->content,
            'thumbnail'        => $post->thumbnail,
            'status'           => $request->status,
            'is_featured'      => $request->boolean('is_featured'),
            'tags'             => $tagsArray,
            'seo_title'        => $request->seo_title,
            'seo_description'  => $request->seo_description,
            'published_at'     => $publishedAt,
        ]);

        return response()->json([
            'message' => 'Cập nhật bài viết thành công',
            'post'    => $post,
        ]);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if ($post->thumbnail) {
            \Storage::disk('public')->delete($post->thumbnail);
        }
        $post->delete();

        return response()->json(['message' => 'Đã xóa bài viết']);
    }
}