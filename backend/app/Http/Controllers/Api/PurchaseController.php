<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PurchaseController extends Controller
{
    public function index()
    {
        return response()->json([
            [
                'id' => 1,
                'user_id' => 1,
                'total' => 100,
                'payment_status' => 'paid',
                'purchase_code' => 'PH-001',
                'details' => [
                    [
                        'id' => 1,
                        'ticket_name' => 'Entrada General',
                        'qr_uuid' => 'demo-qr-123',
                        'status' => 'valid'
                    ]
                ]
            ]
        ]);
    }

    public function store(Request $request)
    {
        $qrUuid = (string) Str::uuid();

        return response()->json([
            'message' => 'Compra realizada correctamente',
            'purchase' => [
                'id' => 1,
                'total' => 100,
                'payment_status' => 'paid',
                'purchase_code' => 'PH-' . rand(1000, 9999),
                'qr_uuid' => $qrUuid,
                'status' => 'valid'
            ]
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'id' => $id,
            'total' => 100,
            'payment_status' => 'paid',
            'purchase_code' => 'PH-001',
        ]);
    }
}