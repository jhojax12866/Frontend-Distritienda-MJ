import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Chip, FormControl, InputLabel } from "@mui/material";
import { DialogContentText, Grid } from "@mui/material";

const data_facturas = {
  columns: [
    { name: "id", align: "left" },
    { name: "cliente", align: "center" },
    { name: "fecha_ingreso", align: "center" },
    { name: "medio_pago_v", align: "center" },
    { name: "estado_pago_v", align: "center" },
    { name: "total_v", align: "center" },
    { name: "acciones", align: "center" },
  ],
};

function Tabla_Ventas() {
  const { columns } = data_facturas;
  const [facturas, setFacturas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newFacturaDialogOpen, setNewFacturaDialogOpen] = useState(false);
  const [editedFactura, setEditedFactura] = useState({});
  const [newFactura, setNewFactura] = useState({
    cliente: "",
    fecha_ingreso: "",
    medio_pago_v: "",
    estado_pago_v: "",
    total_v: "0.00",
  });

  // Declare accessToken globally
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facturasData = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/factura_venta/")
          .then((response) => response.json());
        setFacturas(facturasData);
      } catch (error) {
        console.error("Error fetching data from API", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (factura) => {
    setSelectedFactura(factura);
    setEditedFactura({ ...factura });
    setEditDialogOpen(true);
  };

  const handleDelete = (factura) => {
    setSelectedFactura(factura);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setNewFacturaDialogOpen(true);
  };

  const deleteFactura = async () => {
    try {
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/factura_venta/${selectedFactura.id}/`, requestOptions);

      const updatedFacturas = facturas.filter((factura) => factura.id !== selectedFactura.id);
      setFacturas(updatedFacturas);

      console.log("Factura deleted successfully!");
    } catch (error) {
      console.error("Error deleting factura", error);
    }

    setDeleteDialogOpen(false);
  };

  const editFactura = async () => {
    try {
      if (!editedFactura.id) {
        console.error("Factura ID is not defined.");
        return;
      }

      const editedFacturaData = {
        cliente: editedFactura.cliente,
        fecha_ingreso: editedFactura.fecha_ingreso,
        medio_pago_v: editedFactura.medio_pago_v,
        estado_pago_v: editedFactura.estado_pago_v,
        total_v: editedFactura.total_v,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedFacturaData),
      };

      const response = await fetch(
        `https://simplificado-48e1a3e2d000.herokuapp.com/factura_venta/${editedFactura.id}/`,
        requestOptions
      );

      if (response.ok) {
        const updatedFacturas = await fetchData();
        setFacturas(updatedFacturas);

        setEditedFactura({});
        setEditDialogOpen(false);
      } else if (response.status === 401) {
        console.error("Authorization error: Token is invalid or expired.");
      } else {
        console.error("Error editing factura:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error editing factura", error);
    }
  };

  const addNewFactura = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/factura_venta/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newFactura),
      });

      if (response.ok) {
        const updatedFacturas = await fetchData();
        setFacturas(updatedFacturas);

        setNewFactura({
          cliente: "",
          fecha_ingreso: "",
          medio_pago_v: "",
          estado_pago_v: "",
          total_v: "0.00",
        });
        setNewFacturaDialogOpen(false);
      } else {
        console.error("Error adding new factura");
      }
    } catch (error) {
      console.error("Error adding new factura", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/factura_venta/");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };

  const getActionButtons = (factura) => (
    <div>
      <IconButton onClick={() => handleEdit(factura)} color="info">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(factura)} color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const rowsWithActions = facturas.map((factura) => {
    return {
      ...factura,
      acciones: getActionButtons(factura),
    };
  });

  const filteredFacturas = rowsWithActions.filter((factura) => {
    return factura.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.total_v.toString().includes(searchTerm);
  });

  return (
    <DashboardLayout sx={{ backgroundColor: 'rgba(173, 216, 230, 0.9)' }}>
      <DashboardNavbar />
      <SoftTypography variant="body1" style={{ paddingLeft: '2px', paddingTop: '0px', fontSize: '19px' }}>
        Search
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
              <SoftTypography variant="h6">FACTURAS TABLE</SoftTypography>
              <Button
                onClick={() => setNewFacturaDialogOpen(true)}
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: '#3498db',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
                startIcon={<AddIcon />}
              >
                Agregar Factura
              </Button>
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
              <Table columns={columns} rows={filteredFacturas} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      {/* Diálogo de edición de factura */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Editar Factura</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              {/* ... (similar modifications as before) */}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={editFactura} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de creación de factura */}
      <Dialog open={newFacturaDialogOpen} onClose={() => setNewFacturaDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nueva Factura</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              {/* ... (similar modifications as before) */}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFacturaDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={addNewFactura} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

    </DashboardLayout>
  );
}

export default Tabla_Ventas;
