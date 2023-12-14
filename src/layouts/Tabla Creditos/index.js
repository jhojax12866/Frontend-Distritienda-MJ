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
import { FormControl, Grid } from "@mui/material";

const apiUrl = "https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/";

const data_cartera = {
  columns: [
    { name: "id", align: "center" },
    { name: "fecha_facturacion", align: "center" },
    { name: "fecha_vencimiento", align: "center" },
    { name: "pago", align: "center" },
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
    fecha_vencimiento: "2023-12-27",
    pago: 0,
  });

  const handleNewCarteraChange = (field, value) => {
    setNewCartera((prev) => ({ ...prev, [field]: value }));
  };

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carteraData = await fetch(apiUrl).then((response) => response.json());
        setCartera(carteraData);
      } catch (error) {
        console.error("Error fetching data from cartera API", error);
      }
    };

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

      await fetch(`${apiUrl}/${selectedCartera.id}/`, requestOptions);

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
        fecha_vencimiento: editedCartera.fecha_vencimiento,
        pago: editedCartera.pago,
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
        `${apiUrl}/${editedCartera.id}/`,
        requestOptions
      );

      if (response.ok) {
        const updatedCartera = await fetchData();
        setCartera(updatedCartera);

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

      const response = await fetch(apiUrl, requestOptions);

      if (response.ok) {
        const updatedCartera = await fetchData();
        setCartera(updatedCartera);

        setNewCartera({
          fecha_vencimiento: "2023-12-27",
          pago: 0,
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
      (carteraItem.fecha_vencimiento && carteraItem.fecha_vencimiento.includes(searchTerm)) ||
      ((carteraItem.pago !== undefined) && carteraItem.pago.toString().includes(searchTerm))
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
              <SoftTypography variant="h6">TABLA DE CARTERA</SoftTypography>
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
          ¿Estás seguro de que deseas eliminar el item de cartera?
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

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Item de Cartera</DialogTitle>
        <DialogContent>
          {/* Ajusta los campos del formulario para editar elementos de cartera */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="fecha_vencimiento"
              label="Fecha de Vencimiento"
              type="date"
              variant="filled"
              color="secondary"
              value={editedCartera.fecha_vencimiento}
              onChange={(e) => setEditedCartera({ ...editedCartera, fecha_vencimiento: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="pago"
              label="Pago"
              variant="filled"
              color="secondary"
              type="number"
              value={editedCartera.pago}
              onChange={(e) => setEditedCartera({ ...editedCartera, pago: e.target.value })}
              fullWidth
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={editCartera} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newCarteraDialogOpen} onClose={() => setNewCarteraDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Add New Cartera Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Fecha Facturación"
                type="date"
                variant="filled"
                color="secondary"
                value={newCartera.fecha_facturacion}
                onChange={(e) => handleNewCarteraChange("fecha_facturacion", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Fecha Vencimiento"
                type="date"
                variant="filled"
                color="secondary"
                value={newCartera.fecha_vencimiento}
                onChange={(e) => handleNewCarteraChange("fecha_vencimiento", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Pago"
                variant="filled"
                color="secondary"
                type="number"
                value={newCartera.pago}
                onChange={(e) => handleNewCarteraChange("pago", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCarteraDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addNewCartera} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Cartera;
