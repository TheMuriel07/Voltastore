<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Categoria;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = Producto::with('categoria')->get();
        $categorias = Categoria::all();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return redirect()->route('productos.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        Producto::create($validated);

        return redirect()->route('productos.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        $producto->update($validated);

        return redirect()->route('productos.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return redirect()->route('productos.index');
    }

    public function generarPdf()
    {
        // // Traer productos cargando su relación 'categoria' (Eager Loading)
        $productos = Producto::with('categoria')->get();
        // dd($productos);
        // Cálculo de métricas
        $totalProductos = $productos->count();
        $precioPromedio = $productos->avg('precio');
        // Cargar vista Blade enviando datos
        $pdf = Pdf::loadView('pdf.productos', compact('productos', 'totalProductos',
        'precioPromedio'));
        // Descargar PDF
        return $pdf->download('reporte_productos_' . date('Y-m-d') . '.pdf');
    }
}
