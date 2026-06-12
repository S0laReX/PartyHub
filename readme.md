# EVENTIX — BACKEND (Laravel 12 + JWT) — ARCHIVO 2 de 3

> Cada bloque indica la **ruta del archivo** dentro de `backend/`.
> Copia cada bloque en su archivo correspondiente. Cubre: auth JWT, roles,
> CRUDs (users, roles, categories, djs, events), tickets, compras, QR, PDF,
> favoritos, reviews, notificaciones y dashboards/estadísticas.

---

## 0) Instalación rápida

```bash
composer create-project laravel/laravel backend
cd backend
composer require tymon/jwt-auth
composer require simplesoftwareio/simple-qrcode
composer require barryvdh/laravel-dompdf
composer require cloudinary-labs/cloudinary-laravel   # opcional (subida de imágenes)

php artisan jwt:secret
# Configura .env (ver abajo), importa eventix_database.sql y:
php artisan serve
```

> No es necesario correr `php artisan migrate` si importaste el `.sql`.
> Si prefieres migraciones, en la sección 9 hay un ejemplo equivalente.

---

## 1) `backend/.env` (fragmento relevante)

```env
APP_NAME=Eventix
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eventix
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=GENERADO_CON_php_artisan_jwt:secret
JWT_TTL=1440

CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
GOOGLE_MAPS_KEY=tu_api_key
```

---

## 2) `backend/config/auth.php` (guard JWT)

```php
<?php
return [
    'defaults' => ['guard' => 'api', 'passwords' => 'users'],

    'guards' => [
        'web' => ['driver' => 'session', 'provider' => 'users'],
        'api' => ['driver' => 'jwt', 'provider' => 'users'],
    ],

    'providers' => [
        'users' => ['driver' => 'eloquent', 'model' => App\Models\User::class],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],
    'password_timeout' => 10800,
];
```

---

## 3) MODELS — `backend/app/Models/`

### `User.php`
```php
<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = ['name','email','password','phone','avatar','role_id'];
    protected $hidden   = ['password','remember_token'];
    protected $casts    = ['email_verified_at' => 'datetime','password' => 'hashed'];

    // JWT
    public function getJWTIdentifier() { return $this->getKey(); }
    public function getJWTCustomClaims() { return ['role' => optional($this->role)->slug]; }

    // Relaciones
    public function role()      { return $this->belongsTo(Role::class); }
    public function events()    { return $this->hasMany(Event::class, 'organizer_id'); }
    public function purchases() { return $this->hasMany(Purchase::class); }
    public function favorites() { return $this->hasMany(Favorite::class); }
    public function reviews()   { return $this->hasMany(Review::class); }

    public function hasRole(string $slug): bool { return optional($this->role)->slug === $slug; }
}
```

### `Role.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Role extends Model {
    protected $fillable = ['name','slug'];
    public function users() { return $this->hasMany(User::class); }
}
```

### `Category.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Category extends Model {
    protected $fillable = ['name','slug','icon'];
    public function events() { return $this->hasMany(Event::class); }
}
```

### `Dj.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Dj extends Model {
    protected $fillable = ['name','bio','photo','genre','instagram'];
    public function events() { return $this->belongsToMany(Event::class, 'event_dj'); }
}
```

### `Event.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Event extends Model {
    protected $fillable = [
        'title','slug','description','category_id','organizer_id',
        'location_name','address','latitude','longitude',
        'event_date','start_time','end_time','cover_image','capacity','status'
    ];

    public function category()  { return $this->belongsTo(Category::class); }
    public function organizer() { return $this->belongsTo(User::class, 'organizer_id'); }
    public function djs()       { return $this->belongsToMany(Dj::class, 'event_dj'); }
    public function images()    { return $this->hasMany(EventImage::class); }
    public function tickets()   { return $this->hasMany(Ticket::class); }
    public function reviews()   { return $this->hasMany(Review::class); }
    public function favorites() { return $this->hasMany(Favorite::class); }
}
```

### `EventImage.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class EventImage extends Model {
    protected $fillable = ['event_id','image_url','public_id'];
    public function event() { return $this->belongsTo(Event::class); }
}
```

### `Ticket.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Ticket extends Model {
    protected $fillable = ['event_id','name','price','quantity','quantity_sold'];
    public function event() { return $this->belongsTo(Event::class); }
    public function getAvailableAttribute() { return $this->quantity - $this->quantity_sold; }
}
```

### `Purchase.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Purchase extends Model {
    protected $fillable = ['user_id','code','total','payment_method','status'];
    public function user()    { return $this->belongsTo(User::class); }
    public function details() { return $this->hasMany(PurchaseDetail::class); }
}
```

### `PurchaseDetail.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PurchaseDetail extends Model {
    protected $fillable = ['purchase_id','ticket_id','event_id','quantity','unit_price','subtotal','qr_code','is_used','checked_in_at'];
    protected $casts = ['is_used' => 'boolean','checked_in_at' => 'datetime'];
    public function purchase() { return $this->belongsTo(Purchase::class); }
    public function ticket()   { return $this->belongsTo(Ticket::class); }
    public function event()    { return $this->belongsTo(Event::class); }
}
```

### `Review.php`, `Favorite.php`, `Follower.php`, `Notification.php`
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Review extends Model {
    protected $fillable = ['user_id','event_id','rating','comment'];
    public function user()  { return $this->belongsTo(User::class); }
    public function event() { return $this->belongsTo(Event::class); }
}
```
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Favorite extends Model {
    protected $fillable = ['user_id','event_id'];
    public function event() { return $this->belongsTo(Event::class); }
}
```
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Follower extends Model {
    protected $fillable = ['follower_id','organizer_id'];
}
```
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Notification extends Model {
    protected $fillable = ['user_id','title','message','type','is_read'];
    protected $casts = ['is_read' => 'boolean'];
}
```

---

## 4) MIDDLEWARE — `backend/app/Http/Middleware/RoleMiddleware.php`

```php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth('api')->user();
        if (!$user || !in_array(optional($user->role)->slug, $roles)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        return $next($request);
    }
}
```

Registrar el alias en `backend/bootstrap/app.php`:
```php
->withMiddleware(function (Illuminate\Foundation\Configuration\Middleware $middleware) {
    $middleware->alias([
        'role' => App\Http\Middleware\RoleMiddleware::class,
    ]);
})
```

---

## 5) CONTROLLERS — `backend/app/Http/Controllers/`

### `AuthController.php` (INTEGRANTE 1)
```php
<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);
        if ($v->fails()) return response()->json($v->errors(), 422);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role_id' => 3, // Usuario por defecto
        ]);

        $token = auth('api')->login($user);
        return $this->tokenResponse($token, $user);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Credenciales invalidas'], 401);
        }
        return $this->tokenResponse($token, auth('api')->user());
    }

    public function me() { return response()->json(auth('api')->user()->load('role')); }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Sesion cerrada']);
    }

    public function refresh()
    {
        return $this->tokenResponse(auth('api')->refresh(), auth('api')->user());
    }

    protected function tokenResponse($token, $user)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user->load('role'),
        ]);
    }
}
```

### `RoleController.php`, `CategoryController.php`, `DjController.php`, `UserController.php` (INTEGRANTE 1 — CRUDs)
```php
<?php
namespace App\Http\Controllers;
use App\Models\Role;
use Illuminate\Http\Request;
class RoleController extends Controller
{
    public function index()  { return Role::all(); }
    public function store(Request $r) { return Role::create($r->validate(['name'=>'required','slug'=>'required|unique:roles'])); }
    public function show(Role $role)  { return $role; }
    public function update(Request $r, Role $role) { $role->update($r->only('name','slug')); return $role; }
    public function destroy(Role $role) { $role->delete(); return response()->json(['message'=>'Eliminado']); }
}
```
```php
<?php
namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class CategoryController extends Controller
{
    public function index() { return Category::all(); }
    public function store(Request $r) {
        $data = $r->validate(['name'=>'required','icon'=>'nullable']);
        $data['slug'] = Str::slug($data['name']);
        return Category::create($data);
    }
    public function show(Category $category) { return $category; }
    public function update(Request $r, Category $category) {
        $data = $r->only('name','icon');
        if(isset($data['name'])) $data['slug'] = Str::slug($data['name']);
        $category->update($data); return $category;
    }
    public function destroy(Category $category) { $category->delete(); return response()->json(['message'=>'Eliminado']); }
}
```
```php
<?php
namespace App\Http\Controllers;
use App\Models\Dj;
use Illuminate\Http\Request;
class DjController extends Controller
{
    public function index() { return Dj::all(); }
    public function store(Request $r) {
        return Dj::create($r->validate(['name'=>'required','bio'=>'nullable','photo'=>'nullable','genre'=>'nullable','instagram'=>'nullable']));
    }
    public function show(Dj $dj) { return $dj->load('events'); }
    public function update(Request $r, Dj $dj) { $dj->update($r->only('name','bio','photo','genre','instagram')); return $dj; }
    public function destroy(Dj $dj) { $dj->delete(); return response()->json(['message'=>'Eliminado']); }
}
```
```php
<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class UserController extends Controller
{
    public function index() { return User::with('role')->get(); }
    public function store(Request $r) {
        $data = $r->validate(['name'=>'required','email'=>'required|email|unique:users','password'=>'required|min:6','role_id'=>'required|exists:roles,id']);
        $data['password'] = Hash::make($data['password']);
        return User::create($data)->load('role');
    }
    public function show(User $user) { return $user->load('role'); }
    public function update(Request $r, User $user) {
        $data = $r->only('name','email','phone','role_id','avatar');
        if($r->filled('password')) $data['password'] = Hash::make($r->password);
        $user->update($data); return $user->load('role');
    }
    public function destroy(User $user) { $user->delete(); return response()->json(['message'=>'Eliminado']); }
}
```

### `EventController.php` (Integrante 2/3 — eventos + Cloudinary)
```php
<?php
namespace App\Http\Controllers;
use App\Models\Event;
use App\Models\EventImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class EventController extends Controller
{
    public function index(Request $r)
    {
        $q = Event::with(['category','organizer','djs','tickets'])
                  ->withCount('favorites')
                  ->where('status','published');
        if ($r->filled('search'))      $q->where('title','like','%'.$r->search.'%');
        if ($r->filled('category_id')) $q->where('category_id',$r->category_id);
        return $q->orderBy('event_date')->paginate(12);
    }

    public function show(Event $event)
    {
        return $event->load(['category','organizer','djs','tickets','images',
            'reviews.user'])->loadCount('favorites');
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'title'=>'required','description'=>'nullable','category_id'=>'required|exists:categories,id',
            'location_name'=>'nullable','address'=>'nullable','latitude'=>'nullable','longitude'=>'nullable',
            'event_date'=>'required|date','start_time'=>'nullable','end_time'=>'nullable',
            'cover_image'=>'nullable','capacity'=>'nullable|integer',
        ]);
        $data['slug'] = Str::slug($data['title']).'-'.Str::random(5);
        $data['organizer_id'] = auth('api')->id();
        $event = Event::create($data);
        if ($r->filled('djs')) $event->djs()->sync($r->djs);
        return response()->json($event->load('djs'), 201);
    }

    public function update(Request $r, Event $event)
    {
        $event->update($r->only('title','description','category_id','location_name',
            'address','latitude','longitude','event_date','start_time','end_time',
            'cover_image','capacity','status'));
        if ($r->filled('djs')) $event->djs()->sync($r->djs);
        return $event->load('djs');
    }

    public function destroy(Event $event) { $event->delete(); return response()->json(['message'=>'Eliminado']); }

    // Cloudinary: el front sube la imagen y manda la URL; aqui solo la guardamos.
    public function addImage(Request $r, Event $event)
    {
        $data = $r->validate(['image_url'=>'required|url','public_id'=>'nullable']);
        return EventImage::create(['event_id'=>$event->id] + $data);
    }
}
```

### `FavoriteController.php` y `ReviewController.php` (Integrante 2)
```php
<?php
namespace App\Http\Controllers;
use App\Models\Favorite;
use Illuminate\Http\Request;
class FavoriteController extends Controller
{
    public function index() {
        return Favorite::with('event.category')->where('user_id',auth('api')->id())->get();
    }
    public function toggle(Request $r) {
        $r->validate(['event_id'=>'required|exists:events,id']);
        $fav = Favorite::where('user_id',auth('api')->id())->where('event_id',$r->event_id)->first();
        if ($fav) { $fav->delete(); return response()->json(['favorited'=>false]); }
        Favorite::create(['user_id'=>auth('api')->id(),'event_id'=>$r->event_id]);
        return response()->json(['favorited'=>true]);
    }
}
```
```php
<?php
namespace App\Http\Controllers;
use App\Models\Review;
use Illuminate\Http\Request;
class ReviewController extends Controller
{
    public function store(Request $r) {
        $data = $r->validate(['event_id'=>'required|exists:events,id','rating'=>'required|integer|min:1|max:5','comment'=>'nullable']);
        $data['user_id'] = auth('api')->id();
        return Review::updateOrCreate(
            ['user_id'=>$data['user_id'],'event_id'=>$data['event_id']],
            ['rating'=>$data['rating'],'comment'=>$data['comment'] ?? null]
        )->load('user');
    }
    public function destroy(Review $review) { $review->delete(); return response()->json(['message'=>'Eliminado']); }
}
```

### `TicketController.php` + `PurchaseController.php` (INTEGRANTE 3 — tickets, compras, QR, PDF)
```php
<?php
namespace App\Http\Controllers;
use App\Models\Ticket;
use Illuminate\Http\Request;
class TicketController extends Controller
{
    public function index($eventId) { return Ticket::where('event_id',$eventId)->get(); }
    public function store(Request $r) {
        return Ticket::create($r->validate([
            'event_id'=>'required|exists:events,id','name'=>'required',
            'price'=>'required|numeric','quantity'=>'required|integer',
        ]));
    }
    public function update(Request $r, Ticket $ticket) { $ticket->update($r->only('name','price','quantity')); return $ticket; }
    public function destroy(Ticket $ticket) { $ticket->delete(); return response()->json(['message'=>'Eliminado']); }
}
```
```php
<?php
namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Ticket;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Barryvdh\DomPDF\Facade\Pdf;

class PurchaseController extends Controller
{
    // Crear compra con multiples items: [{ticket_id, quantity}, ...]
    public function store(Request $r)
    {
        $r->validate([
            'items' => 'required|array|min:1',
            'items.*.ticket_id' => 'required|exists:tickets,id',
            'items.*.quantity'  => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($r) {
            $purchase = Purchase::create([
                'user_id' => auth('api')->id(),
                'code' => 'EVX-'.strtoupper(Str::random(8)),
                'total' => 0,
                'status' => 'paid',
                'payment_method' => $r->payment_method ?? 'card',
            ]);

            $total = 0;
            foreach ($r->items as $item) {
                $ticket = Ticket::lockForUpdate()->findOrFail($item['ticket_id']);
                if ($ticket->available < $item['quantity']) {
                    abort(422, "No hay entradas suficientes para {$ticket->name}");
                }
                $subtotal = $ticket->price * $item['quantity'];
                $total += $subtotal;

                PurchaseDetail::create([
                    'purchase_id' => $purchase->id,
                    'ticket_id' => $ticket->id,
                    'event_id' => $ticket->event_id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $ticket->price,
                    'subtotal' => $subtotal,
                    'qr_code' => 'QR-'.Str::uuid(),
                ]);
                $ticket->increment('quantity_sold', $item['quantity']);
            }
            $purchase->update(['total' => $total]);

            Notification::create([
                'user_id' => auth('api')->id(),
                'title' => 'Compra confirmada',
                'message' => "Tu compra {$purchase->code} fue exitosa.",
                'type' => 'success',
            ]);

            return response()->json($purchase->load('details.event','details.ticket'), 201);
        });
    }

    public function myPurchases() {
        return Purchase::with('details.event','details.ticket')
            ->where('user_id', auth('api')->id())->latest()->get();
    }

    // QR como SVG (string) para un detalle de compra
    public function qr($detailId) {
        $detail = PurchaseDetail::findOrFail($detailId);
        $svg = QrCode::format('svg')->size(300)->generate($detail->qr_code);
        return response($svg)->header('Content-Type','image/svg+xml');
    }

    // Validacion / Check-in (rol Acceso)
    public function checkIn(Request $r) {
        $r->validate(['qr_code'=>'required']);
        $detail = PurchaseDetail::with('event')->where('qr_code',$r->qr_code)->first();
        if (!$detail) return response()->json(['valid'=>false,'message'=>'QR no encontrado'],404);
        if ($detail->is_used) return response()->json(['valid'=>false,'message'=>'QR ya utilizado','event'=>$detail->event->title],409);

        $detail->update(['is_used'=>true,'checked_in_at'=>now()]);
        return response()->json(['valid'=>true,'message'=>'Acceso permitido','event'=>$detail->event->title]);
    }

    // PDF de la entrada
    public function ticketPdf($purchaseId) {
        $purchase = Purchase::with('details.event','details.ticket','user')->findOrFail($purchaseId);
        $pdf = Pdf::loadView('pdf.ticket', compact('purchase'));
        return $pdf->download("entrada-{$purchase->code}.pdf");
    }

    // PDF reporte de ventas (admin/organizador)
    public function reportPdf() {
        $purchases = Purchase::with('details.event','user')->where('status','paid')->latest()->get();
        $total = $purchases->sum('total');
        $pdf = Pdf::loadView('pdf.report', compact('purchases','total'));
        return $pdf->download('reporte-ventas.pdf');
    }
}
```

### `NotificationController.php` y `DashboardController.php` (INTEGRANTE 3 — dashboards/estadísticas)
```php
<?php
namespace App\Http\Controllers;
use App\Models\Notification;
use Illuminate\Http\Request;
class NotificationController extends Controller
{
    public function index() {
        return Notification::where('user_id',auth('api')->id())->latest()->get();
    }
    public function markRead(Notification $notification) {
        $notification->update(['is_read'=>true]); return $notification;
    }
}
```
```php
<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // Resumen admin
    public function adminStats()
    {
        return response()->json([
            'users'  => User::count(),
            'events' => Event::count(),
            'sales'  => Purchase::where('status','paid')->sum('total'),
            'tickets_sold' => PurchaseDetail::sum('quantity'),
        ]);
    }

    // Resumen del organizador autenticado
    public function organizerStats()
    {
        $id = auth('api')->id();
        $eventIds = Event::where('organizer_id',$id)->pluck('id');
        $sales = PurchaseDetail::whereIn('event_id',$eventIds)->sum('subtotal');
        return response()->json([
            'my_events' => $eventIds->count(),
            'tickets_sold' => PurchaseDetail::whereIn('event_id',$eventIds)->sum('quantity'),
            'sales' => $sales,
        ]);
    }

    // Ranking de eventos por entradas vendidas
    public function rankingEvents()
    {
        return PurchaseDetail::select('event_id', DB::raw('SUM(quantity) as sold'))
            ->with('event:id,title,cover_image')
            ->groupBy('event_id')->orderByDesc('sold')->limit(10)->get();
    }

    // Trending: eventos con mas favoritos
    public function trendingEvents()
    {
        return Event::withCount('favorites')->orderByDesc('favorites_count')->limit(10)->get();
    }
}
```

---

## 6) RUTAS — `backend/routes/api.php`

```php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{AuthController, UserController, RoleController,
    CategoryController, DjController, EventController, FavoriteController,
    ReviewController, TicketController, PurchaseController, NotificationController,
    DashboardController};

// ---- Auth (INTEGRANTE 1) ----
Route::post('register', [AuthController::class,'register']);
Route::post('login',    [AuthController::class,'login']);

// ---- Publico ----
Route::get('events',        [EventController::class,'index']);
Route::get('events/{event}',[EventController::class,'show']);
Route::get('categories',    [CategoryController::class,'index']);
Route::get('djs',           [DjController::class,'index']);
Route::get('events/{event}/tickets', [TicketController::class,'index']);

// ---- Protegido (JWT) ----
Route::middleware('auth:api')->group(function () {
    Route::get('me',      [AuthController::class,'me']);
    Route::post('logout', [AuthController::class,'logout']);
    Route::post('refresh',[AuthController::class,'refresh']);

    // Usuario final
    Route::get('favorites',        [FavoriteController::class,'index']);
    Route::post('favorites/toggle',[FavoriteController::class,'toggle']);
    Route::post('reviews',         [ReviewController::class,'store']);
    Route::post('purchases',       [PurchaseController::class,'store']);
    Route::get('my-purchases',     [PurchaseController::class,'myPurchases']);
    Route::get('purchase-detail/{id}/qr', [PurchaseController::class,'qr']);
    Route::get('purchases/{id}/pdf',      [PurchaseController::class,'ticketPdf']);
    Route::get('notifications',    [NotificationController::class,'index']);
    Route::post('notifications/{notification}/read',[NotificationController::class,'markRead']);

    // Acceso (control de puerta)
    Route::middleware('role:acceso,administrador')->post('check-in',[PurchaseController::class,'checkIn']);

    // Organizador / Admin
    Route::middleware('role:organizador,administrador')->group(function () {
        Route::apiResource('events', EventController::class)->except(['index','show']);
        Route::post('events/{event}/images',[EventController::class,'addImage']);
        Route::apiResource('tickets', TicketController::class)->except(['index']);
        Route::get('dashboard/organizer',[DashboardController::class,'organizerStats']);
        Route::get('report/pdf',[PurchaseController::class,'reportPdf']);
    });

    // Solo Admin
    Route::middleware('role:administrador')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('categories', CategoryController::class)->except(['index']);
        Route::apiResource('djs', DjController::class)->except(['index']);
        Route::get('dashboard/admin', [DashboardController::class,'adminStats']);
    });

    // Estadisticas (admin + organizador)
    Route::middleware('role:administrador,organizador')->group(function(){
        Route::get('stats/ranking',  [DashboardController::class,'rankingEvents']);
        Route::get('stats/trending', [DashboardController::class,'trendingEvents']);
    });
});
```

---

## 7) VISTAS PDF — `backend/resources/views/pdf/`

### `ticket.blade.php`
```blade
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:DejaVu Sans;} .box{border:2px solid #6d28d9;padding:16px;margin-bottom:12px;border-radius:8px}
h1{color:#6d28d9} .code{font-size:18px;font-weight:bold}</style></head><body>
<h1>EVENTIX — Entrada</h1>
<p>Compra: <span class="code">{{ $purchase->code }}</span></p>
<p>Cliente: {{ $purchase->user->name }}</p>
@foreach($purchase->details as $d)
  <div class="box">
    <strong>{{ $d->event->title }}</strong><br>
    Tipo: {{ $d->ticket->name }} — Cantidad: {{ $d->quantity }}<br>
    Subtotal: Bs {{ number_format($d->subtotal,2) }}<br>
    Codigo QR: {{ $d->qr_code }}
  </div>
@endforeach
<h3>Total: Bs {{ number_format($purchase->total,2) }}</h3>
</body></html>
```

### `report.blade.php`
```blade
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:DejaVu Sans} table{width:100%;border-collapse:collapse}
th,td{border:1px solid #ddd;padding:6px;font-size:12px} th{background:#6d28d9;color:#fff}</style></head><body>
<h1>Reporte de Ventas — EVENTIX</h1>
<table><thead><tr><th>Codigo</th><th>Cliente</th><th>Total</th><th>Fecha</th></tr></thead><tbody>
@foreach($purchases as $p)
  <tr><td>{{ $p->code }}</td><td>{{ $p->user->name }}</td><td>Bs {{ number_format($p->total,2) }}</td><td>{{ $p->created_at }}</td></tr>
@endforeach
</tbody></table>
<h3>Total general: Bs {{ number_format($total,2) }}</h3>
</body></html>
```

---

## 8) CORS — `backend/config/cors.php`
```php
<?php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'], // Vite
    'allowed_headers' => ['*'],
    'supports_credentials' => false,
];
```

---

## 9) (Opcional) Migración equivalente de ejemplo
> Si prefieres `php artisan migrate` en lugar del `.sql`, crea migraciones espejo
> de las tablas del Archivo 1. Ejemplo `events`:
```php
Schema::create('events', function (Blueprint $t) {
    $t->id();
    $t->string('title'); $t->string('slug')->unique(); $t->text('description')->nullable();
    $t->foreignId('category_id')->constrained();
    $t->foreignId('organizer_id')->constrained('users');
    $t->string('location_name')->nullable(); $t->string('address')->nullable();
    $t->decimal('latitude',10,7)->nullable(); $t->decimal('longitude',10,7)->nullable();
    $t->date('event_date'); $t->time('start_time')->nullable(); $t->time('end_time')->nullable();
    $t->string('cover_image')->nullable(); $t->unsignedInteger('capacity')->default(0);
    $t->enum('status',['draft','published','cancelled','finished'])->default('published');
    $t->timestamps();
});
```

---

### Resumen de endpoints (para documentar)
| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/register | Registro |
| POST | /api/login | Login (JWT) |
| GET  | /api/me | Usuario actual |
| POST | /api/logout | Cerrar sesión |
| GET  | /api/events | Lista de eventos |
| GET  | /api/events/{id} | Detalle |
| POST | /api/purchases | Comprar tickets |
| GET  | /api/purchase-detail/{id}/qr | QR (SVG) |
| GET  | /api/purchases/{id}/pdf | Entrada PDF |
| POST | /api/check-in | Validar QR |
| GET  | /api/dashboard/admin | Stats admin |
| GET  | /api/stats/ranking | Ranking eventos |

**FIN DEL ARCHIVO 2 (BACKEND)**
