<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // Danh sách bài viết
    public function index(Request $request)
    {
        $query = Post::with(['category', 'author:id,name,avatar'])
            ->published();

        if ($request->filled('category_slug')) {
            $query->whereHas('category', fn($q) =>
                $q->where('slug', $request->category_slug)
            );
        }

        if ($request->filled('keyword')) {
            $kw = $request->keyword;
            $query->where(fn($q) =>
                $q->where('title', 'like', "%{$kw}%")
                  ->orWhere('excerpt', 'like', "%{$kw}%")
            );
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $posts = $query->orderBy('published_at', 'desc')
            ->paginate($request->get('per_page', 9));

        return response()->json($posts);
    }

    // Chi tiết bài viết
    public function show($slug)
    {
        $post = Post::with(['category', 'author:id,name,avatar'])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $post->incrementView();

        // Bài viết liên quan
        $related = Post::published()
            ->where('id', '!=', $post->id)
            ->where('post_category_id', $post->post_category_id)
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'thumbnail',
                   'excerpt', 'published_at']);

        return response()->json([
            'post'    => $post,
            'related' => $related,
        ]);
    }

    // Danh sách categories
    public function categories()
    {
        $categories = PostCategory::where('is_active', true)
            ->withCount(['posts' => fn($q) => $q->published()])
            ->orderBy('order')
            ->get();

        return response()->json($categories);
    }
}