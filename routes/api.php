<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;

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
});