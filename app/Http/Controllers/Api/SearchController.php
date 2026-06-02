<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Listing;
use App\Models\Province;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    // =====================
    // TÌM KIẾM CHÍNH
    // Full-text + filter kết hợp
    // =====================
    public function search(Request $request)
    {
        $keyword  = $request->get('keyword', '');
        $page     = (int) $request->get('page', 1);
        $perPage  = (int) $request->get('per_page', 12);
        $sortBy   = $request->get('sort_by', 'created_at');
        $sortOrder= $request->get('sort_order', 'desc');

        // Build filter string cho Meilisearch
        $filters = $this->buildFilters($request);

        // Build sort
        $sort = $this->buildSort($sortBy, $sortOrder);

        if (!empty($keyword)) {
            // Dùng Meilisearch full-text search
            $results = Listing::search($keyword, function ($engine, $query, $options) use ($filters, $sort, $page, $perPage) {
                $options['filter'] = $filters ?: null;
                $options['sort']   = $sort;
                $options['limit']  = $perPage;
                $options['offset'] = ($page - 1) * $perPage;
                $options['facets'] = [
                    'type', 'province_id',
                    'category_id', 'bedrooms',
                ];
                return $engine->search($query, $options);
            })->paginate($perPage, 'page', $page);

            // Load relationships cho kết quả
            $results->load(['category', 'province', 'primaryImage']);

        } else {
            // Không có keyword → dùng Eloquent với filter
            $query = Listing::with(['category', 'province', 'primaryImage'])
                ->where('status', 'active');

            $this->applyEloquentFilters($query, $request);
            $this->applyEloquentSort($query, $sortBy, $sortOrder);

            $results = $query->paginate($perPage, ['*'], 'page', $page);
        }

        return response()->json($results);
    }

    // =====================
    // GỢI Ý TÌM KIẾM (Autocomplete)
    // =====================
    public function suggest(Request $request)
    {
        $request->validate([
            'keyword' => 'required|string|min:2|max:100',
        ]);

        $keyword = $request->keyword;

        // Gợi ý từ tiêu đề listings
        $listings = Listing::search($keyword)
            ->where('status', 'active')
            ->take(5)
            ->get(['id', 'title', 'address', 'province_id']);

        // Gợi ý từ địa chỉ/quận (Eloquent)
        $addresses = Listing::where('status', 'active')
            ->where(fn($q) =>
                $q->where('district', 'like', "%{$keyword}%")
                  ->orWhere('address', 'like', "%{$keyword}%")
            )
            ->distinct('district')
            ->limit(3)
            ->pluck('district')
            ->filter()
            ->values();

        return response()->json([
            'listings'  => $listings,
            'addresses' => $addresses,
        ]);
    }

    // =====================
    // TÌM KIẾM NÂNG CAO
    // Trả về facets (bộ lọc thông minh)
    // =====================
    public function advanced(Request $request)
    {
        $keyword = $request->get('keyword', '');
        $filters = $this->buildFilters($request);

        $rawResults = Listing::search($keyword ?: '*', function ($engine, $query, $options) use ($filters) {
            $options['filter'] = $filters ?: null;
            $options['facets'] = [
                'type', 'province_id',
                'category_id', 'bedrooms',
            ];
            $options['limit']  = 0; // Chỉ cần facets, không cần kết quả
            return $engine->search($query, $options);
        })->raw();

        // Lấy thống kê facets
        $facets = $rawResults['facetDistribution'] ?? [];

        // Map province_id → tên tỉnh
        $provinceIds = array_keys($facets['province_id'] ?? []);
        $provinces   = Province::whereIn('id', $provinceIds)
            ->pluck('name', 'id');

        // Map category_id → tên danh mục
        $categoryIds = array_keys($facets['category_id'] ?? []);
        $categories  = Category::whereIn('id', $categoryIds)
            ->pluck('name', 'id');

        return response()->json([
            'facets' => [
                'types'      => $facets['type'] ?? [],
                'provinces'  => collect($facets['province_id'] ?? [])
                    ->mapWithKeys(fn($count, $id) => [
                        $id => [
                            'name'  => $provinces[$id] ?? "Tỉnh {$id}",
                            'count' => $count,
                        ]
                    ]),
                'categories' => collect($facets['category_id'] ?? [])
                    ->mapWithKeys(fn($count, $id) => [
                        $id => [
                            'name'  => $categories[$id] ?? "Danh mục {$id}",
                            'count' => $count,
                        ]
                    ]),
                'bedrooms'   => $facets['bedrooms'] ?? [],
            ],
        ]);
    }

    // =====================
    // BẤT ĐỘNG SẢN TƯƠNG TỰ
    // =====================
    public function similar(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);

        $similar = Listing::with(['category', 'province', 'primaryImage'])
            ->where('status', 'active')
            ->where('id', '!=', $id)
            ->where(fn($q) =>
                $q->where('province_id', $listing->province_id)
                  ->orWhere('category_id', $listing->category_id)
            )
            ->whereBetween('price', [
                $listing->price * 0.7,
                $listing->price * 1.3,
            ])
            ->orderByRaw('ABS(price - ?) ASC', [$listing->price])
            ->limit(6)
            ->get();

        return response()->json($similar);
    }

    // =====================
    // PRIVATE HELPERS
    // =====================
    private function buildFilters(Request $request): string
    {
        $filters = ['status = "active"'];

        if ($request->filled('type')) {
            $filters[] = "type = \"{$request->type}\"";
        }
        if ($request->filled('province_id')) {
            $filters[] = "province_id = {$request->province_id}";
        }
        if ($request->filled('category_id')) {
            $filters[] = "category_id = {$request->category_id}";
        }
        if ($request->filled('price_min')) {
            $filters[] = "price >= {$request->price_min}";
        }
        if ($request->filled('price_max')) {
            $filters[] = "price <= {$request->price_max}";
        }
        if ($request->filled('area_min')) {
            $filters[] = "area >= {$request->area_min}";
        }
        if ($request->filled('area_max')) {
            $filters[] = "area <= {$request->area_max}";
        }
        if ($request->filled('bedrooms')) {
            $filters[] = "bedrooms = {$request->bedrooms}";
        }
        if ($request->filled('bathrooms')) {
            $filters[] = "bathrooms >= {$request->bathrooms}";
        }

        return implode(' AND ', $filters);
    }

    private function buildSort(string $sortBy, string $sortOrder): array
    {
        $allowed = ['price', 'area', 'created_at'];
        if (!in_array($sortBy, $allowed)) {
            $sortBy = 'created_at';
        }
        return ["{$sortBy}:{$sortOrder}"];
    }

    private function applyEloquentFilters($query, Request $request): void
    {
        if ($request->filled('type'))        $query->where('type', $request->type);
        if ($request->filled('province_id')) $query->where('province_id', $request->province_id);
        if ($request->filled('category_id')) $query->where('category_id', $request->category_id);
        if ($request->filled('price_min'))   $query->where('price', '>=', $request->price_min);
        if ($request->filled('price_max'))   $query->where('price', '<=', $request->price_max);
        if ($request->filled('area_min'))    $query->where('area', '>=', $request->area_min);
        if ($request->filled('area_max'))    $query->where('area', '<=', $request->area_max);
        if ($request->filled('bedrooms'))    $query->where('bedrooms', $request->bedrooms);
        if ($request->filled('bathrooms'))   $query->where('bathrooms', '>=', $request->bathrooms);
        if ($request->filled('keyword')) {
            $kw = $request->keyword;
            $query->where(fn($q) =>
                $q->where('title', 'like', "%{$kw}%")
                  ->orWhere('address', 'like', "%{$kw}%")
                  ->orWhere('description', 'like', "%{$kw}%")
            );
        }
    }

    private function applyEloquentSort($query, string $sortBy, string $sortOrder): void
    {
        $allowed = ['price', 'area', 'created_at'];
        $sortBy  = in_array($sortBy, $allowed) ? $sortBy : 'created_at';
        $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
    }
}