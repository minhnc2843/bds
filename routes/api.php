<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\Admin\SiteSettingController;
use App\Http\Controllers\Api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\PromotionController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\Admin\PostController as AdminPostController;
use App\Http\Controllers\Api\Admin\PageController as AdminPageController;
use App\Http\Controllers\Api\Admin\ContactMessageController as AdminContactController;
Route::get('/site/config', [SiteController::class, 'config']);
Route::get('/posts',              [PostController::class, 'index']);
Route::get('/posts/categories',   [PostController::class, 'categories']);
Route::get('/posts/{slug}',       [PostController::class, 'show']);
Route::get('/pages/{slug}',       [PageController::class, 'show']);
Route::post('/contact',           [ContactMessageController::class, 'store']);
Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {

    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // Quản lý tin đăng
    Route::get('/listings',                [AdminController::class, 'listings']);
    Route::patch('/listings/{id}/approve', [AdminController::class, 'approveListing']);
    Route::patch('/listings/{id}/reject',  [AdminController::class, 'rejectListing']);
    Route::delete('/listings/{id}',        [AdminController::class, 'deleteListing']);

    // Quản lý user
    Route::get('/users',                      [AdminController::class, 'users']);
    Route::get('/users/{id}',                 [AdminController::class, 'showUser']);
    Route::patch('/users/{id}/role',          [AdminController::class, 'updateUserRole']);
    Route::patch('/users/{id}/toggle-ban',    [AdminController::class, 'toggleBanUser']);
    Route::delete('/users/{id}',              [AdminController::class, 'deleteUser']);
    Route::put('/profile',          [ProfileController::class, 'update']);
Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
Route::post('/profile/avatar',  [ProfileController::class, 'updateAvatar']);
Route::prefix('notifications')->group(function () {
    Route::get('/',              [NotificationController::class, 'index']);
    Route::patch('/{id}/read',   [NotificationController::class, 'markRead']);
    Route::patch('/read-all',    [NotificationController::class, 'markAllRead']);
    Route::delete('/{id}',       [NotificationController::class, 'destroy']);


    Route::get('/posts',            [AdminPostController::class, 'index']);
    Route::post('/posts',           [AdminPostController::class, 'store']);
    Route::post('/posts/{id}',      [AdminPostController::class, 'update']);
    Route::delete('/posts/{id}',    [AdminPostController::class, 'destroy']);

    // Pages
    Route::get('/pages',            [AdminPageController::class, 'index']);
    Route::put('/pages/{id}',       [AdminPageController::class, 'update']);

    // Contact messages
    Route::get('/contacts',         [AdminContactController::class, 'index']);
    Route::get('/contacts/unread-count', [AdminContactController::class, 'unreadCount']);
    Route::patch('/contacts/{id}',  [AdminContactController::class, 'update']);
    Route::delete('/contacts/{id}', [AdminContactController::class, 'destroy']);
});
// Site settings
    Route::get('/settings',              [SiteSettingController::class, 'index']);
    Route::put('/settings',              [SiteSettingController::class, 'update']);
    Route::post('/settings/upload-image',[SiteSettingController::class, 'uploadImage']);

    // Banners
    Route::get('/banners',               [BannerController::class, 'index']);
    Route::post('/banners',              [BannerController::class, 'store']);
    Route::post('/banners/{id}',         [BannerController::class, 'update']);
    Route::delete('/banners/{id}',       [BannerController::class, 'destroy']);
    Route::post('/banners/reorder',      [BannerController::class, 'reorder']);

    // Promotions
    Route::get('/promotions',            [PromotionController::class, 'index']);
    Route::post('/promotions',           [PromotionController::class, 'store']);
    Route::post('/promotions/{id}',      [PromotionController::class, 'update']);
    Route::delete('/promotions/{id}',    [PromotionController::class, 'destroy']);
});
