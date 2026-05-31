<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListingController;
// Auth routes (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});
Route::get('/listings',        [ListingController::class, 'index']);
Route::get('/listings/{id}',   [ListingController::class, 'show']);
// Auth routes (cần đăng nhập)
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::get('/me',     [AuthController::class, 'me']);
    Route::post('/logout',[AuthController::class, 'logout']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/listings',                          [ListingController::class, 'store']);
    Route::put('/listings/{id}',                      [ListingController::class, 'update']);
    Route::delete('/listings/{id}',                   [ListingController::class, 'destroy']);
    Route::get('/my-listings',                        [ListingController::class, 'myListings']);
    Route::delete('/listings/{id}/images/{imageId}',  [ListingController::class, 'deleteImage']);
});