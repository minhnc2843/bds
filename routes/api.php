<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\Admin\SiteSettingController;
use App\Http\Controllers\Api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\PromotionController;

Route::get('/site/config', [SiteController::class, 'config']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{id}', [ListingController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/provinces', [ProvinceController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    Route::post('/listings', [ListingController::class, 'store']);
    Route::put('/listings/{id}', [ListingController::class, 'update']);
    Route::delete('/listings/{id}', [ListingController::class, 'destroy']);
    Route::get('/my-listings', [ListingController::class, 'myListings']);
    Route::delete('/listings/{id}/images/{imageId}', [ListingController::class, 'deleteImage']);

    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::patch('/{id}/read', [NotificationController::class, 'markRead']);
        Route::patch('/read-all', [NotificationController::class, 'markAllRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
    });
});

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
    });
});

Route::middleware(['auth:sanctum', 'is_admin'])
    ->prefix('admin')->group(function () {

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
