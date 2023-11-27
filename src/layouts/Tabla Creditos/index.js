import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

function Tabla_Creditos() {
  const [creditos, setCreditos] = useState([]);
  const [facturasVenta, setFacturasVenta] = useState([]);
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePago = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/pago/");
        const dataPago = await responsePago.json();
        setCreditos(dataPago);

        const responseFacturaVenta = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/factura_venta/");
        const dataFacturaVenta = await responseFacturaVenta.json();
        setFacturasVenta(dataFacturaVenta);

        const responsePersonas = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/personas/");
        const dataPersonas = await responsePersonas.json();
        setPersonas(dataPersonas);
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };

    fetchData();
  }, []);

  // Función para obtener el nombre de una persona por su ID
  const getNombrePersonaById = (personaId) => {
    const persona = personas.find((p) => p.id === personaId);
    return persona ? `${persona.nombre} ${persona.apellido}` : "N/A";
  };

  // Modificar la estructura de datos para incluir solo FACTURA_V en la tabla y facturas diferentes de null
  const tablaData = creditos.map((credito) => {
    const facturaVenta = facturasVenta.find((factura) => factura.id === credito.factura_v);

    // Verificar si la factura de venta es diferente de null
    if (facturaVenta) {
      return {
        id: credito.id,
        medio_pago: credito.medio_pago,
        estado_pago: credito.estado_pago,
        factura_v: facturaVenta.total_v,
        cliente_nombre: getNombrePersonaById(facturaVenta.cliente_f),
      };
    }

    // Si la factura de venta es null, devolver null para no incluirla en la tabla
    return null;
  }).filter(Boolean); // Filtrar elementos nulos

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">TABLA CREDITOS VALLEJOS</SoftTypography>
            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table
                columns={[
                  { name: "cliente_nombre", align: "center" },
                 
                  { name: "medio_pago", align: "center" },
                  { name: "estado_pago", align: "center" },
                  { name: "factura_v", align: "center" },
                  
                ]}
                rows={tablaData}
              />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tabla_Creditos;
