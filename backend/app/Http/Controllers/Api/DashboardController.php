<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function admin()
    {
        return response()->json([
            'users' => 120,
            'events' => 18,
            'sales' => 340,
            'earnings' => 18500,
            'tickets_sold' => 340
        ]);
    }

    public function organizer()
    {
        return response()->json([
            'my_events' => 5,
            'sales' => 120,
            'earnings' => 7500,
            'tickets_sold' => 120,
            'attendees' => 95
        ]);
    }

    public function access()
    {
        return response()->json([
            'checked_in' => 80,
            'pending' => 40,
            'invalid_attempts' => 3
        ]);
    }

    public function rankingEvents()
    {
        return response()->json([
            ['event' => 'Fiesta Neon', 'sales' => 150],
            ['event' => 'Noche Electrónica', 'sales' => 120],
            ['event' => 'Urban Fest', 'sales' => 90],
        ]);
    }

    public function trendingEvents()
    {
        return response()->json([
            ['event' => 'Fiesta Neon', 'views' => 2500],
            ['event' => 'Urban Fest', 'views' => 1800],
            ['event' => 'Party Sunset', 'views' => 1300],
        ]);
    }

    public function totalSales()
    {
        return response()->json([
            'total_sales' => 340,
            'total_earnings' => 18500
        ]);
    }
}