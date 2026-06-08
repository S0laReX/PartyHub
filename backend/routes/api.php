<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\PurchaseDetailController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ScanTicketController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PdfController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API PartyHub funcionando correctamente'
    ]);
});

Route::apiResource('tickets', TicketController::class);

Route::post('/purchases', [PurchaseController::class, 'store']);
Route::get('/purchases', [PurchaseController::class, 'index']);
Route::get('/purchases/{id}', [PurchaseController::class, 'show']);

Route::get('/purchase-details', [PurchaseDetailController::class, 'index']);

Route::post('/scan-ticket', [ScanTicketController::class, 'scan']);

Route::apiResource('notifications', NotificationController::class);

Route::get('/dashboard/admin', [DashboardController::class, 'admin']);
Route::get('/dashboard/organizer', [DashboardController::class, 'organizer']);
Route::get('/dashboard/access', [DashboardController::class, 'access']);

Route::get('/stats/ranking-events', [DashboardController::class, 'rankingEvents']);
Route::get('/stats/trending-events', [DashboardController::class, 'trendingEvents']);
Route::get('/stats/total-sales', [DashboardController::class, 'totalSales']);

Route::get('/pdf/ticket/{id}', [PdfController::class, 'ticket']);
Route::get('/pdf/report', [PdfController::class, 'report']);