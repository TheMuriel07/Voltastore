<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Producto extends Model
{
    protected $fillable = ['nombre', 'precio', 'descripcion', 'categoria_id'];

    // Un producto pertenece a una categoría
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }
}
