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
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/stock/");
      const data = await response.json();
      setStock(data);
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
              <td>{item.producto_stock}</td>
              <td>{item.lote_stock}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StockTable;
