import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";

const StockTable = () => {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener datos de stock
      const stockResponse = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/stock/");
      const stockData = await stockResponse.json();
  
      // Obtener datos de lotes
      const lotesResponse = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/lotes/");
      const lotesData = await lotesResponse.json();
  
      // Obtener datos de productos
      const productosResponse = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/productos/");
      const productosData = await productosResponse.json();
  
      // Combinar datos de stock con información adicional de lotes y productos
      const stockWithDetails = stockData.map((item) => {
        const loteInfo = lotesData.find((lote) => lote.id === item.lote_stock);
        const productoInfo = productosData.find((producto) => producto.id === item.producto_stock);
        return {
          ...item,
          loteInfo,
          productoInfo,
        };
      });
  
      setStock(stockWithDetails);
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };
  
  

  return (
    <div className="table-responsive">
      {/* Estilos CSS */}
      <style>
        {`
          .custom-table {
            margin-top: 20px;
            width: 100%;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border-radius: 10px;
            background: linear-gradient(45deg, #ffffff, #f5f5f5); /* Fondo blanco difuminado */
          }

          .custom-table th,
          .custom-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            background-color: #f5f5f5; /* Fondo ligeramente más oscuro */
            color: #555; /* Texto más claro */
            font-size: 14px; /* Tamaño de la fuente */
          }

          .custom-table th {
            background-color: #ffffff; /* Fondo blanco para las celdas del encabezado */
            color: #000; /* Texto negro para las celdas del encabezado */
            font-weight: bold;
          }

          .custom-table tbody tr {
            transition: background-color 0.3s;
          }

          .custom-table tbody tr:hover {
            background-color: #ffffff; /* Cambia el fondo al pasar el mouse sobre las filas */
          }

          @media (max-width: 768px) {
            .custom-table th, .custom-table td {
              padding: 10px;
              font-size: 12px; /* Tamaño de la fuente en dispositivos móviles */
            }
          }
        `}
      </style>

      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th colSpan="3">STOCK</th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Producto Stock</th>
            <th>Lote Stock</th>
          </tr>
        </thead>
        <tbody>
  {stock.map((item) => (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.productoInfo ? item.productoInfo.nombre : 'Nombre no disponible'}</td>
      <td>{item.loteInfo ? item.loteInfo.numero_lote : 'Lote no disponible'}</td>
    </tr>
  ))}
</tbody>


      </Table>
    </div>
  );
};

export default StockTable;
