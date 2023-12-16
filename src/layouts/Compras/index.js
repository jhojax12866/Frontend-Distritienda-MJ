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
import { FormControl, InputLabel } from "@mui/material";
import { DialogContentText, Grid } from "@mui/material";

const data_cartera = {
  columns: [
    { name: "id", align: "center" },
    { name: "proveedor", align: "center"},
    { name: "telefono", aling: "center"},
    { name: "fecha_ingreso", align: "center" },
    { name: "medio_pago_c", align: "center" },
    { name: "estado_pago_c", align: "center" },
    { name: "acciones", align: "center" },
  ],
};

function Cartera() {
  const { columns } = data_cartera;
  const [cartera, setCartera] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCartera, setSelectedCartera] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newCarteraDialogOpen, setNewCarteraDialogOpen] = useState(false);
  const [editedCartera, setEditedCartera] = useState({});
  const [newCartera, setNewCartera] = useState({
    fecha_ingreso: "2023-12-27",
    medio_pago_c: "",
    estado_pago_c: "",
  });

  const handleNewCarteraChange = (field, value) => {
    setNewCartera((prev) => ({ ...prev, [field]: value }));
  };

  const accessToken = localStorage.getItem("accessToken");

  const fetchData = async () => {
    try {
      const facturaCompraData = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/").then((response) => response.json());
      setCartera(facturaCompraData);
    } catch (error) {
      console.error("Error fetching data from factura_compra API", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (carteraItem) => {
    setSelectedCartera(carteraItem);
    setEditedCartera({ ...carteraItem });
    setEditDialogOpen(true);
  };

  const handleDelete = (carteraItem) => {
    setSelectedCartera(carteraItem);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setNewCarteraDialogOpen(true);
  };

  const deleteCartera = async () => {
    try {
      if (!accessToken) {
        console.error("No se encontró el token de acceso");
        return;
      }

      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/${selectedCartera.id}/`, requestOptions);

      const updatedCartera = cartera.filter((item) => item.id !== selectedCartera.id);
      setCartera(updatedCartera);

      console.log("Cartera item deleted successfully!");
    } catch (error) {
      console.error("Error deleting cartera item", error);
    }

    setDeleteDialogOpen(false);
  };

  const editCartera = async () => {
    try {
      if (!editedCartera.id) {
        console.error("ID del item de cartera a editar no está definido.");
        return;
      }

      const editedCarteraData = {
        fecha_ingreso: editedCartera.fecha_ingreso,
        medio_pago_c: editedCartera.medio_pago_c,
        estado_pago_c: editedCartera.estado_pago_c,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedCarteraData),
      };

      const response = await fetch(
        `https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/${editedCartera.id}/`,
        requestOptions
      );

      if (response.ok) {
        await fetchData();
        setEditedCartera({});
        setEditDialogOpen(false);
      } else {
        console.error("Error al editar el item de cartera:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error al editar el item de cartera", error);
    }
  };

  const addNewCartera = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newCartera),
      };

      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/", requestOptions);

      if (response.ok) {
        await fetchData();
        setNewCartera({
          fecha_ingreso: "2023-12-27",
          medio_pago_c: "",
          estado_pago_c: "",
        });
        setNewCarteraDialogOpen(false);
      } else {
        console.error("Error al agregar el nuevo item de cartera");
      }
    } catch (error) {
      console.error("Error al agregar el nuevo item de cartera", error);
    }
  };

  const getActionButtons = (carteraItem) => (
    <div>
      <IconButton onClick={() => handleEdit(carteraItem)} color="info">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(carteraItem)} color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const rowsWithActions = cartera.map((carteraItem) => ({
    ...carteraItem,
    acciones: getActionButtons(carteraItem),
  }));

  const filteredCartera = rowsWithActions.filter((carteraItem) => {
    return (
      carteraItem.fecha_ingreso.includes(searchTerm) ||
      carteraItem.medio_pago_c.includes(searchTerm) ||
      carteraItem.estado_pago_c.includes(searchTerm) ||
      carteraItem.total_v.toString().includes(searchTerm)
    );
  });

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
              <SoftTypography variant="h6">TABLA DE PROOVEDORES</SoftTypography>
              <IconButton onClick={() => setNewCarteraDialogOpen(true)} color="primary">
                <AddIcon />
              </IconButton>
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
              <Table columns={columns} rows={filteredCartera} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar este registro?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteCartera} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newCarteraDialogOpen} onClose={() => setNewCarteraDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nueva Factura</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputLabel htmlFor="fecha_ingreso">Fecha de Ingreso</InputLabel>
                <TextField
                  id="fecha_ingreso"
                  type="date"
                  variant="filled"
                  color="secondary"
                  value={newCartera.fecha_ingreso}
                  onChange={(e) => handleNewCarteraChange("fecha_ingreso", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="medio_pago_c">Medio de Pago</InputLabel>
                <TextField
                  id="medio_pago_c"
                  variant="filled"
                  color="secondary"
                  value={newCartera.medio_pago_c}
                  onChange={(e) => handleNewCarteraChange("medio_pago_c", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="estado_pago_c">Estado de Pago</InputLabel>
                <TextField
                  id="estado_pago_c"
                  variant="filled"
                  color="secondary"
                  value={newCartera.estado_pago_c}
                  onChange={(e) => handleNewCarteraChange("estado_pago_c", e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCarteraDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={addNewCartera} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Cartera;
