import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import { TextField } from "@mui/material";

function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    // Fetch nombre del producto para cada lote
    const fetchNombreProducto = async () => {
      try {
        const lotesWithProductNames = await Promise.all(
          lotes.map(async (lote) => {
            const response = await fetch(
              `https://diplomadobd-06369030a7e4.herokuapp.com/productos/${lote.producto_lote}/`
            );
            const productData = await response.json();
            return {
              ...lote,
              nombreProducto: productData.nombre,
            };
          })
        );
        setLotes(lotesWithProductNames);
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };

    fetchNombreProducto();
  }, [lotes]);

  const handleRowClick = (lot) => {
    setSelectedLot(lot);
  };

  const lotesColumns = [
    { name: "numero_lote", align: "center" },
    { name: "nombreProducto", align: "center", label: "Nombre del Producto" },
    { name: "cantidad", align: "center" },
    { name: "fecha_ingreso", align: "left" },
  ];

  // Función para filtrar lotes por término de búsqueda
  const filterLotes = (loteId) => {
    return lotes.filter((lote) => {
      const numeroLote = lote.numero_lote ? lote.numero_lote.toString() : '';
      return numeroLote.includes(searchTerm.toLowerCase());
    });
  };

  // Manejar cambios en el término de búsqueda
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar lotes según el término de búsqueda
  const filteredLotes = filterLotes();

  return (
    <DashboardLayout sx={{ backgroundColor: 'rgba(173, 216, 230, 0.9)' }}>
      <DashboardNavbar />
      <SoftTypography variant="body1" style={{ paddingLeft: '2px', paddingTop: '0px', fontSize: '19px' }}>
        Buscar
      </SoftTypography>
      <TextField
        label=""
        variant="filled"
        color="secondary"
        value={searchTerm}
        onChange={handleSearchTermChange}
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
              <Table columns={lotesColumns} rows={filteredLotes} onRowClick={handleRowClick} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      {selectedLot && (
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">PRODUCTOS DEL LOTE {selectedLot.numero_lote}</SoftTypography>
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
              <Table columns={productosColumns} rows={productos} />
            </SoftBox>
          </Card>
        </SoftBox>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default Lotes;
