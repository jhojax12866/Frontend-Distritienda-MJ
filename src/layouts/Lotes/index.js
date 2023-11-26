import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/lotes/");
        const data = await response.json();
        setLotes(data);
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Fetch productos for the selected lot
    const fetchProductos = async () => {
      if (selectedLot) {
        try {
          const response = await fetch(
            `https://diplomadobd-06369030a7e4.herokuapp.com/lotes/${selectedLot.id}/productos/`
          );
          const data = await response.json();
          setProductos(data);
        } catch (error) {
          console.error("Error al obtener datos de la API", error);
        }
      }
    };

    fetchProductos();
  }, [selectedLot]);

  const handleRowClick = (lot) => {
    setSelectedLot(lot);
  };

  const lotesColumns = [
    { name: "id", align: "left" },
    { name: "fecha_ingreso", align: "left" },
    { name: "producto_lote", align: "center" },
    { name: "cantidad", align: "center" },
    { name: "numero_lote", align: "center" },
  ];

  const productosColumns = [
    { name: "id", align: "left" },
    { name: "nombre", align: "left" },
    { name: "descripcion", align: "center" },
    // Add other product columns as needed
  ];

  // Filter productos based on PRODUCTO_LOTE
  const filteredProductos = productos.filter(producto => producto.producto_lote === selectedLot?.producto_lote);

  return (
    <DashboardLayout sx={{ backgroundColor: 'rgba(173, 216, 230, 0.9)' }}>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">LOTES</SoftTypography>
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
              <Table columns={lotesColumns} rows={lotes} onRowClick={handleRowClick} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      {selectedLot && (
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">PRODUCTOS DEL LOTE {selectedLot.producto_lote}</SoftTypography>
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
              {/* Use the product name from the first product in the filteredProductos list */}
              <Table columns={productosColumns} rows={filteredProductos} />
            </SoftBox>
          </Card>
        </SoftBox>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default Lotes;
