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

const data_lotes = {
  columns: [
    { name: "id", align: "left" },
    { name: "fecha_ingreso", align: "left" },
    { name: "producto_lote", align: "center" },
    { name: "cantidad", align: "center" },
    { name: "numero_lote", align: "center" },
    { name: "acciones", align: "center" },
  ],
};

function Lotes() {
  const { columns } = data_lotes;
  const [lotes, setLotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLote, setSelectedLote] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newLoteDialogOpen, setNewLoteDialogOpen] = useState(false);
  const [editedLote, setEditedLote] = useState({});
  const [newLote, setNewLote] = useState({
    producto_lote: 1,
    cantidad: "0.00",
    numero_lote: 0,
  });
  const handleNewLoteChange = (field, value) => {
    setNewLote((prev) => ({ ...prev, [field]: value }));
  };
  // Declare accessToken globally
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lotesData = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/lotes/").then((response) => response.json());
        setLotes(lotesData);
      } catch (error) {
        console.error("Error al obtener datos de la API de lotes", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (lote) => {
    setSelectedLote(lote);
    setEditedLote({ ...lote });
    setEditDialogOpen(true);
  };

  const handleDelete = (lote) => {
    setSelectedLote(lote);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setNewLoteDialogOpen(true);
  };

  const deleteLote = async () => {
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

      await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/lotes/${selectedLote.id}/`, requestOptions);

      const updatedLotes = lotes.filter((lote) => lote.id !== selectedLote.id);
      setLotes(updatedLotes);

      console.log("Lote deleted successfully!");
    } catch (error) {
      console.error("Error al eliminar el lote", error);
    }

    setDeleteDialogOpen(false);
  };

  const editLote = async () => {
    try {
      if (!editedLote.id) {
        console.error("El ID del lote a editar no está definido.");
        return;
      }

      const editedLoteData = {
        producto_lote: parseInt(editedLote.producto_lote),
        cantidad: editedLote.cantidad,
        numero_lote: parseInt(editedLote.numero_lote),
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedLoteData),
      };

      const response = await fetch(
        `https://diplomadobd-06369030a7e4.herokuapp.com/lotes/${editedLote.id}/`,
        requestOptions
      );

      if (response.ok) {
        // Update the state after editing the lote
        const updatedLotes = await fetchData();
        setLotes(updatedLotes);

        setEditedLote({});
        setEditDialogOpen(false);
      } else if (response.status === 401) {
        console.error("Error de autorización: El token no es válido o ha caducado.");
      } else {
        console.error("Error al editar el lote:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error al editar el lote", error);
    }
  };

  const addNewLote = async () => {
    try {
      const response = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/lotes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newLote),
      });

      if (response.ok) {
        const updatedLotes = await fetchData();
        setLotes(updatedLotes);

        setNewLote({
          producto_lote: 1,
          cantidad: "0.00",
          numero_lote: 0,
        });
        setNewLoteDialogOpen(false);
      } else {
        console.error("Error al agregar el nuevo lote");
      }
    } catch (error) {
      console.error("Error al agregar el nuevo lote", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/lotes/");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener datos de la API de lotes", error);
    }
  };

  const getActionButtons = (lote) => (
    <div>
      <IconButton onClick={() => handleEdit(lote)} color="info">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(lote)} color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const rowsWithActions = lotes.map((lote) => ({
    ...lote,
    acciones: getActionButtons(lote),
  }));

  const filteredLotes = rowsWithActions.filter((lote) => {
    return (
      lote.producto_lote.toString().includes(searchTerm) ||
      lote.numero_lote.toString().includes(searchTerm)
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
              <SoftTypography variant="h6">TABLA DE LOTES</SoftTypography>
              <IconButton onClick={() => setNewLoteDialogOpen(true)} color="primary">
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
              <Table columns={columns} rows={filteredLotes} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar el lote?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteLote} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Lote</DialogTitle>
        <DialogContent>
          {/* Adjust the form fields for editing lotes */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="producto_lote"
              label="Producto Lote"
              value={editedLote.producto_lote}
              onChange={(e) => setEditedLote({ ...editedLote, producto_lote: e.target.value })}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="cantidad"
              label="Cantidad"
              value={editedLote.cantidad}
              onChange={(e) => setEditedLote({ ...editedLote, cantidad: e.target.value })}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="numero_lote"
              label="Numero Lote"
              value={editedLote.numero_lote}
              onChange={(e) => setEditedLote({ ...editedLote, numero_lote: e.target.value })}
              fullWidth
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={editLote} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Include the dialog for creating a new lot */}
      <Dialog open={newLoteDialogOpen} onClose={() => setNewLoteDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Add New Lot</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Fecha Ingreso"
                type="date"
                variant="filled"
                color="secondary"
                value={newLote.fecha_ingreso}
                onChange={(e) => handleNewLoteChange("fecha_ingreso", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Producto Lote"
                variant="filled"
                color="secondary"
                value={newLote.producto_lote}
                onChange={(e) => handleNewLoteChange("producto_lote", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Cantidad"
                variant="filled"
                color="secondary"
                type="number"
                value={newLote.cantidad}
                onChange={(e) => handleNewLoteChange("cantidad", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Número Lote"
                variant="filled"
                color="secondary"
                type="number"
                value={newLote.numero_lote}
                onChange={(e) => handleNewLoteChange("numero_lote", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewLoteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addNewLote} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
    </DashboardLayout>
  );
}

export default Lotes;
