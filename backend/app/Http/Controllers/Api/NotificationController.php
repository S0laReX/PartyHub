<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json([
            [
                'id' => 1,
                'title' => 'Compra exitosa',
                'message' => 'Tu entrada fue generada correctamente.',
                'is_read' => false
            ],
            [
                'id' => 2,
                'title' => 'QR validado',
                'message' => 'Tu ticket fue usado en el acceso.',
                'is_read' => true
            ],
        ]);
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Notificación creada correctamente',
            'data' => $request->all()
        ], 201);
    }

    public function show(string $id)
    {
        return response()->json([
            'id' => $id,
            'title' => 'Notificación demo',
            'message' => 'Detalle de la notificación'
        ]);
    }

    public function update(Request $request, string $id)
    {
        return response()->json([
            'message' => 'Notificación actualizada',
            'id' => $id
        ]);
    }

    public function destroy(string $id)
    {
        return response()->json([
            'message' => 'Notificación eliminada',
            'id' => $id
        ]);
    }
}