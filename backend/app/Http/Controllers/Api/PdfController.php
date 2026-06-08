<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class PdfController extends Controller
{
    public function ticket(string $id)
    {
        return response()->json([
            'message' => 'Aquí se generará el PDF de la entrada',
            'ticket_id' => $id
        ]);
    }

    public function report()
    {
        return response()->json([
            'message' => 'Aquí se generará el PDF del reporte',
            'total_sales' => 340,
            'total_earnings' => 18500
        ]);
    }
}