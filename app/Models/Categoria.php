<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Categoria extends Model
{
    //
    protected $fillable = ['nombre', 'descripcion'];
    // Una categoría tiene muchos productos
    public function productos(): HasMany
    {
    return $this->hasMany(Producto::class);
    }
}
