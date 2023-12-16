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
import { Grid } from "@mui/material";
import StockTable from "layouts/inventario/tablas/stock";

const data_detalle_venta = {
  columns: [
    { name: "id", align: "left" },
    { name: "factura_venta", align: "center" },
    { name: "producto_venta", align: "center" },
    { name: "cantidad", align: "center" },
    { name: "acciones", align: "center" },
  ],
};

function Detalles() {
  const { columns } = data_detalle_venta;
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDetalleVenta, setSelectedDetalleVenta] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newDetalleVentaDialogOpen, setNewDetalleVentaDialogOpen] = useState(false);
  const [editedDetalleVenta, setEditedDetalleVenta] = useState({});
  const [newDetalleVenta, setNewDetalleVenta] = useState({
    factura_venta: "",
    producto_venta: "",
    cantidad: "",
  });

  // Declare accessToken globally
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (detalleVenta) => {
    setSelectedDetalleVenta(detalleVenta);
    setEditedDetalleVenta({ ...detalleVenta });
    setEditDialogOpen(true);
  };

  const handleDelete = (detalleVenta) => {
    setSelectedDetalleVenta(detalleVenta);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setNewDetalleVentaDialogOpen(true);
  };

  const deleteDetalleVenta = async () => {
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

      await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/detalle_venta/${selectedDetalleVenta.id}/`, requestOptions);

      const updatedDetalleVenta = await fetchData();
      setDetalleVenta(updatedDetalleVenta);

      console.log("DetalleVenta deleted successfully!");
    } catch (error) {
      console.error("Error deleting detalleVenta", error);
    }

    setDeleteDialogOpen(false);
  };

  const editDetalleVenta = async () => {
    try {
      if (!editedDetalleVenta.id) {
        console.error("DetalleVenta ID is not defined.");
        return;
      }

      const editedDetalleVentaData = {
        factura_venta: editedDetalleVenta.factura_venta,
        producto_venta: editedDetalleVenta.producto_venta,
        cantidad: editedDetalleVenta.cantidad,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedDetalleVentaData),
      };

      const response = await fetch(
        `https://simplificado-48e1a3e2d000.herokuapp.com/detalle_venta/${editedDetalleVenta.id}/`,
        requestOptions
      );

      if (response.ok) {
        const updatedDetalleVenta = await fetchData();
        setDetalleVenta(updatedDetalleVenta);

        setEditedDetalleVenta({});
        setEditDialogOpen(false);
      } else if (response.status === 401) {
        console.error("Authorization error: Token is invalid or expired.");
      } else {
        console.error("Error editing detalleVenta:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error editing detalleVenta", error);
    }
  };

  const addNewDetalleVenta = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/detalle_venta/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newDetalleVenta),
      });

      if (response.ok) {
        const updatedDetalleVenta = await fetchData();
        setDetalleVenta(updatedDetalleVenta);

        setNewDetalleVenta({
          factura_venta: "",
          producto_venta: "",
          cantidad: "",
        });
        setNewDetalleVentaDialogOpen(false);
      } else {
        console.error("Error adding new detalleVenta");
      }
    } catch (error) {
      console.error("Error adding new detalleVenta", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/detalle_venta/");
      const data = await response.json();
      setDetalleVenta(data);
      return data; // Devuelve los datos para su uso posterior
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };

  const getActionButtons = (detalleVenta) => (
    <div>
      <IconButton onClick={() => handleEdit(detalleVenta)} color="info">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(detalleVenta)} color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  );

  // Verifica si 'detalleVenta' es un array válido antes de mapear
  const rowsWithActions = detalleVenta && detalleVenta.map((detalleVenta) => {
    return {
      ...detalleVenta,
      acciones: getActionButtons(detalleVenta),
    };
  });

  const filteredDetalleVenta = rowsWithActions.filter((detalleVenta) => {
    return detalleVenta.factura_venta.toString().includes(searchTerm);
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
              <SoftTypography variant="h6">DETALLES VENTAS</SoftTypography>
              <Button
                onClick={handleCreate}
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: '#3498db',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
                startIcon={<AddIcon />}
              >
                Agregar Detalle Venta
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
              <Table columns={columns} rows={filteredDetalleVenta} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar el detalle de venta?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteDetalleVenta} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edición de detalle de venta */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Editar Detalle Venta</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="factura_venta">Factura Venta</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="factura_venta"
                    value={editedDetalleVenta.factura_venta}
                    onChange={(e) => setEditedDetalleVenta({ ...editedDetalleVenta, factura_venta: e.target.value })}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="producto_venta">Producto Venta</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="producto_venta"
                    value={editedDetalleVenta.producto_venta}
                    onChange={(e) => setEditedDetalleVenta({ ...editedDetalleVenta, producto_venta: e.target.value })}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="cantidad">Cantidad</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="cantidad"
                    value={editedDetalleVenta.cantidad}
                    onChange={(e) => setEditedDetalleVenta({ ...editedDetalleVenta, cantidad: e.target.value })}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={editDetalleVenta} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de creación de detalle de venta */}
      <Dialog open={newDetalleVentaDialogOpen} onClose={() => setNewDetalleVentaDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nuevo Detalle Venta</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <InputLabel htmlFor="factura_venta">Factura Venta</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="factura_venta"
                    value={newDetalleVenta.factura_venta}
                    onChange={(e) => setNewDetalleVenta({ ...newDetalleVenta, factura_venta: e.target.value })}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="producto_venta">Producto Venta</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="producto_venta"
                    value={newDetalleVenta.producto_venta}
                    onChange={(e) => setNewDetalleVenta({ ...newDetalleVenta, producto_venta: e.target.value })}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="cantidad">Cantidad</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="cantidad"
                    value={newDetalleVenta.cantidad}
                    onChange={(e) => setNewDetalleVenta({ ...newDetalleVenta, cantidad: e.target.value })}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewDetalleVentaDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={addNewDetalleVenta} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <StockTable />
    </DashboardLayout>
  );
}

export default Detalles;
