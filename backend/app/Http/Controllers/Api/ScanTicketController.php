<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ScanTicketController extends Controller
{
    public function scan(Request $request)
    {
        $qrUuid = $request->input('qr_uuid');

        if (!$qrUuid) {
            return response()->json([
                'message' => 'Debe enviar un código QR'
            ], 422);
        }

        if ($qrUuid === 'usado') {
            return response()->json([
                'message' => 'Este ticket ya fue utilizado',
                'status' => 'used'
            ], 409);
        }

        if ($qrUuid === 'invalido') {
            return response()->json([
                'message' => 'Ticket inválido',
                'status' => 'invalid'
            ], 404);
        }

        return response()->json([
            'message' => 'Acceso permitido',
            'status' => 'used',
            'qr_uuid' => $qrUuid,
            'checked_in_at' => now()
        ]);
    }
}