import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
interface Producto {
    id: number;
    nombre: string;
    precio: number;
}
interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    productos_count?: number; // Generado por conWithCount('productos')
    productos?: Producto[];
}
export default function Dashboard({ categorias }: { categorias: Categoria[] }) {
    // Estados para Modales
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
    // Formulario de Inertia
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
    });
    // Abrir modal de Crear
    const openCreate = () => {
        reset();
        setIsCreateOpen(true);
    };
    // Guardar Nuevo Registro (Create)
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/categorias', {
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
            },
        });
    };
    // Abrir modal de Edición
    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria);
        setData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || '',
        });
    };
    // Guardar Cambios (Update)
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategoria) return;
        put(`/categorias/${editingCategoria.id}`, {
            onSuccess: () => {
                reset();
                setEditingCategoria(null);
            },
        });
    };
    // Eliminar Registro (Delete)
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            router.delete(`/categorias/${id}`);
        }
    };
    const closeModals = () => {
        setIsCreateOpen(false);
        setEditingCategoria(null);
        reset();
    };
    return (
        <div className="p-4">
            <Head title="Categorías" />
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Categorías</h1>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm"
                >
                    Nueva Categoría
                </button>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Categoría</th>
                        <th className="p-3 text-left">Descripción</th>
                        <th className="p-3 text-left">Productos</th>
                        <th className="p-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria) => (
                       <tr key={categoria.id}>
                            <td className="p-4 text-sm">{categoria.id}</td>
                            <td className="p-4 text-sm font-medium">{categoria.nombre}</td>
                            <td className="p-4 text-sm">{categoria.descripcion}</td>
                            <td className="p-4 text-sm">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                    {categoria.productos_count ?? 0} Productos
                                </span>
                            </td>
                            <td className="p-4 text-sm text-right">
                                <button
                                    onClick={() => handleEdit(categoria)}
                                    className="px-3 py-1 bg-amber-500 text-white rounded
hover:bg-amber-600 text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(categoria.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded
hover:bg-red-700 text-sm ml-1"
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
                        <h2 className="text-lg font-bold mb-4">Nueva Categoría</h2>
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
                                <label className="block text-sm font-medium">Descripción</label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="w-full rounded border p-2 text-sm"
                                    rows={3}
                                />
                                {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
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
                                    className="px-4 py-2 bg-amber-500 text-white rounded
text-sm hover:bg-amber-600"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal de Edición */}
            {editingCategoria && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-card text-card-foreground p-6 rounded-xl shadow-xl">
                        <h2 className="text-lg font-bold mb-4">Editar Categoría
                            #{editingCategoria.id}</h2>
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
                                    onClick={() => { setEditingCategoria(null); reset(); }}
                                    className="px-4 py-2 border rounded text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-amber-500 text-white rounded
text-sm hover:bg-amber-600"
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