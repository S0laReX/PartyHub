<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        return response()->json([
            [
                'id' => 1,
                'event_id' => 1,
                'name' => 'Entrada General',
                'description' => 'Acceso general al evento',
                'price' => 50,
                'stock' => 100,
                'sold_quantity' => 0,
                'is_active' => true,
            ],
            [
                'id' => 2,
                'event_id' => 1,
                'name' => 'Entrada VIP',
                'description' => 'Acceso VIP con zona preferencial',
                'price' => 120,
                'stock' => 50,
                'sold_quantity' => 0,
                'is_active' => true,
            ],
        ]);
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Ticket creado correctamente',
            'data' => $request->all()
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'id' => $id,
            'name' => 'Entrada General',
            'price' => 50,
            'stock' => 100,
        ]);
    }

    public function update(Request $request, string $id)
    {
        return response()->json([
            'message' => 'Ticket actualizado correctamente',
            'id' => $id,
            'data' => $request->all()
        ]);
    }

    public function destroy(string $id)
    {
        return response()->json([
            'message' => 'Ticket eliminado correctamente',
            'id' => $id
        ]);
    }
}