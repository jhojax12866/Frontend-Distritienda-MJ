import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import { TextField } from "@mui/material";

function Tabla_Creditos() {
  const [creditos, setCreditos] = useState([]);
  const [facturasVenta, setFacturasVenta] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [carteraData, setCarteraData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

        const responseCartera = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/cartera/");
        const dataCartera = await responseCartera.json();
        setCarteraData(dataCartera);
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };

    fetchData();
  }, []);

  const getNombrePersonaById = (personaId) => {
    const persona = personas.find((p) => p.id === personaId);
    return persona ? `${persona.nombre} ${persona.apellido}` : "N/A";
  };

  const tablaData = creditos
    .filter((credito) => credito.estado_pago.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((credito) => {
      const facturaVenta = facturasVenta.find((factura) => factura.id === credito.factura_v);
      const carteraInfo = carteraData.find((cartera) => cartera.pago === credito.id);

      if (facturaVenta && carteraInfo) {
        return {
          cliente_nombre: getNombrePersonaById(facturaVenta.cliente_f),
          medio_pago: credito.medio_pago,
          estado_pago: credito.estado_pago,
          total: facturaVenta.total_v,
          fecha_facturacion: carteraInfo.fecha_facturacion,
          fecha_vencimiento: carteraInfo.fecha_vencimiento,
          id_venta: facturaVenta.id_venta,
        };
      }
      return null;
    })
    .filter(Boolean);

  const filterBySearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftTypography variant="body1" style={{ paddingLeft: '2px', paddingTop: '0px', fontSize: '19px' }}>
        Buscar
      </SoftTypography>
      <TextField
        label=""
        variant="filled"
        color="secondary"
        value={searchTerm}
        onChange={filterBySearchTerm}
        fullWidth
        InputLabelProps={{ shrink: false }}
        InputProps={{
          style: {
            fontSize: '14px',
            backgroundColor: 'rgba(173, 216, 230, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">CREDITOS</SoftTypography>
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
                  { name: "id_venta", align: "center" },
                  { name: "total", align: "center" },
                  { name: "medio_pago", align: "center" },
                  { name: "estado_pago", align: "center" },
                  { name: "fecha_facturacion", align: "center" },
                  { name: "fecha_vencimiento", align: "center" }, 
                ]}
                rows={tablaData}
              />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      
    </DashboardLayout>
  );
}

export default Tabla_Creditos;
