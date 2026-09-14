import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string | null;
    categoria_id: number;
    categoria: Categoria;
}

export default function ProductosIndex({
    productos,
    categorias,
}: {
    productos: Producto[];
    categorias: Categoria[];
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        precio: '',
        descripcion: '',
        categoria_id: '',
    });

    const openCreate = () => {
        reset();
        setIsCreateOpen(true);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/productos', {
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleEdit = (producto: Producto) => {
        setEditingProducto(producto);
        setData({
            nombre: producto.nombre,
            precio: String(producto.precio),
            descripcion: producto.descripcion || '',
            categoria_id: String(producto.categoria_id),
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProducto) return;
        put(`/productos/${editingProducto.id}`, {
            onSuccess: () => {
                reset();
                setEditingProducto(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            router.delete(`/productos/${id}`);
        }
    };

    const closeModals = () => {
        setIsCreateOpen(false);
        setEditingProducto(null);
        reset();
    };

    return (
        <div className="p-4">
            <Head title="Productos" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Productos</h1>
                <a
                    href="/reporteproductos"
                    target="_blank"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm
font-medium flex items-center gap-2"
                >
                    Generar PDF Productos
                </a>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                >
                    Nuevo Producto
                </button>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Nombre</th>
                        <th className="p-3 text-left">Precio</th>
                        <th className="p-3 text-left">Categoría</th>
                        <th className="p-3 text-left">Descripción</th>
                        <th className="p-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td className="p-4 text-sm">{producto.id}</td>
                            <td className="p-4 text-sm font-medium">{producto.nombre}</td>
                            <td className="p-4 text-sm">${Number(producto.precio).toFixed(2)}</td>
                            <td className="p-4 text-sm">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                    {producto.categoria?.nombre}
                                </span>
                            </td>
                            <td className="p-4 text-sm">{producto.descripcion || '-'}</td>
                            <td className="p-4 text-sm text-right">
                                <button
                                    onClick={() => handleEdit(producto)}
                                    className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(producto.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm ml-1"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Crear */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-card text-card-foreground p-6 rounded-xl shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Nuevo Producto</h2>
                        <form onSubmit={handleCreate} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium">Nombre</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
                                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Precio</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
                                {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Categoría</label>
                                <select
                                    value={data.categoria_id}
                                    onChange={(e) => setData('categoria_id', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoria_id && <p className="text-red-500 text-xs mt-1">{errors.categoria_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Descripción</label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-4 py-2 border rounded text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {editingProducto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-card text-card-foreground p-6 rounded-xl shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Editar Producto #{editingProducto.id}</h2>
                        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium">Nombre</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
                                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Precio</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                />
                                {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Categoría</label>
                                <select
                                    value={data.categoria_id}
                                    onChange={(e) => setData('categoria_id', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoria_id && <p className="text-red-500 text-xs mt-1">{errors.categoria_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Descripción</label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-4 py-2 border rounded text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
