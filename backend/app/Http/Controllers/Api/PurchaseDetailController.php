<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class PurchaseDetailController extends Controller
{
    public function index()
    {
        return response()->json([
            [
                'id' => 1,
                'purchase_id' => 1,
                'ticket_id' => 1,
                'qr_uuid' => 'demo-qr-123',
                'status' => 'valid',
                'checked_in_at' => null
            ]
        ]);
    }
}