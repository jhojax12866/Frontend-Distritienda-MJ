import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";

const LotesTable = () => {
  const [lotes, setLotes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/lotes/");
      const data = await response.json();
      setLotes(data);
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
          }

          .custom-table th,
          .custom-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            background-color: #fff; /* Fondo blanco para las celdas del cuerpo */
            color: #000; /* Texto negro para las celdas del cuerpo */
          }

          .custom-table th {
            background-color: #fff; /* Fondo blanco para las celdas del encabezado */
            color: #000; /* Texto negro para las celdas del encabezado */
            font-weight: bold;
          }

          .custom-table tbody tr {
            transition: background-color 0.3s;
          }

          .custom-table tbody tr:hover {
            background-color: #fff; /* Cambia el fondo al pasar el mouse sobre las filas */
          }

          @media (max-width: 768px) {
            .custom-table th, .custom-table td {
              padding: 10px;
            }
          }
        `}
      </style>

      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha de Ingreso</th>
            <th>Número de Lote</th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((lote) => (
            <tr key={lote.id}>
              <td>{lote.id}</td>
              <td>{lote.fecha_ingreso}</td>
              <td>{lote.numero_lote}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default LotesTable;

