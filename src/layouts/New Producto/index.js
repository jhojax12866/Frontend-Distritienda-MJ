import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const New_Producto = ({ onProductoCreado }) => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    cantidad: 0,
    fecha_vencimiento: '',
    estado: '',
  });

  // Estados predefinidos
  const estadosOptions = ['activo', 'inactivo', 'agotado'];
  New_Producto.propTypes = {
    onProductoCreado: PropTypes.func.isRequired,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías
        const categoriasResponse = await fetch('https://diplomadobd-06369030a7e4.herokuapp.com/categorias');
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre:
              </label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción:
              </label>
              <textarea
                className="form-control"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">
                Categoría:
              </label>
              <select
                className="form-select"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="cantidad" className="form-label">
                Cantidad:
              </label>
              <input
                type="number"
                className="form-control"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fecha_vencimiento" className="form-label">
                Fecha de Vencimiento:
              </label>
              <input
                type="date"
                className="form-control"
                name="fecha_vencimiento"
                value={formData.fecha_vencimiento}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="estado" className="form-label">
                Estado:
              </label>
              <select
                className="form-select"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="">Seleccionar</option>
                {estadosOptions.map((estadoOption) => (
                  <option key={estadoOption} value={estadoOption}>
                    {estadoOption}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onProductoCreado(formData)}
            >
              Crear Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default New_Producto;
