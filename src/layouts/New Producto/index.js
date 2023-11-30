import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';

const New_Producto = () => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: null,
    cantidad: 0,
    fecha_vencimiento: '',
  });

  useEffect(() => {
    // Obtener categorías al cargar el componente
    axios.get('https://diplomadobd-06369030a7e4.herokuapp.com/categorias')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Error al obtener categorías:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ... (Código para crear el producto, lote y actualizar el stock)

      // Limpiar el formulario después de la creación
      setFormData({
        nombre: '',
        descripcion: '',
        categoria: null,
        cantidad: 0,
        fecha_vencimiento: '',
      });

      console.log('Producto creado exitosamente!');
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  return (
    <DashboardLayout>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción:</label>
              <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">Categoría:</label>
              <select className="form-select" name="categoria" value={formData.categoria} onChange={handleChange}>
                <option value="">Seleccionar</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="cantidad" className="form-label">Cantidad:</label>
              <input type="number" className="form-control" name="cantidad" value={formData.cantidad} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="fecha_vencimiento" className="form-label">Fecha de Vencimiento:</label>
              <input type="date" className="form-control" name="fecha_vencimiento" value={formData.fecha_vencimiento} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary">Crear Producto</button>
          </form>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default New_Producto;
