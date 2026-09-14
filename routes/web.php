<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProductoController;

Route::inertia('/', 'welcome')->name('home');

Route::resource('categorias', CategoriaController::class);
Route::resource('productos', ProductoController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/reporteproductos', [ProductoController::class, 'generarPdf'])
->name('productos.pdf');

require __DIR__.'/settings.php';
