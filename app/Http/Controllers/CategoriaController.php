<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categoria;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Cargamos las categorías junto con el número de productos y la lista de productos
        $categorias = Categoria::withCount('productos')
            ->with('productos')
            ->get();
        return Inertia::render('Categorias/Index', [
            'categorias' => $categorias
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
   public function create()
    {
        return redirect()->route('categorias.index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        Categoria::create($validated);

        return redirect()->route('categorias.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $categoria = Categoria::findOrFail($id);
        $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        ]);
        $categoria->update($validated);
        return redirect()->route('categorias.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();
        return redirect()->route('categorias.index');
    }
}
