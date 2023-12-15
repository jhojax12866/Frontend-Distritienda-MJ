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

const data_lotes = {
  columns: [
    { name: "id", align: "left" },
    { name: "fecha_ingreso", align: "center" },
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
    fecha_ingreso: "", // Agrega campo de fecha
    numero_lote: 1,
  });

  // Declare accessToken globally
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
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

      await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/lotes/${selectedLote.id}/`, requestOptions);

      const updatedLotes = await fetchData();
      setLotes(updatedLotes);

      console.log("Lote deleted successfully!");
    } catch (error) {
      console.error("Error deleting lot", error);
    }

    setDeleteDialogOpen(false);
  };

  const editLote = async () => {
    try {
      if (!editedLote.id) {
        console.error("Lote ID is not defined.");
        return;
      }

      const editedLoteData = {
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
        `https://simplificado-48e1a3e2d000.herokuapp.com/lotes/${editedLote.id}/`,
        requestOptions
      );

      if (response.ok) {
        const updatedLotes = await fetchData();
        setLotes(updatedLotes);

        setEditedLote({});
        setEditDialogOpen(false);
      } else if (response.status === 401) {
        console.error("Authorization error: Token is invalid or expired.");
      } else {
        console.error("Error editing lot:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error editing lot", error);
    }
  };

  const addNewLote = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/lotes/", {
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
          fecha_ingreso: "", // Reinicia el campo de fecha
          numero_lote: 1,
        });
        setNewLoteDialogOpen(false);
      } else {
        console.error("Error adding new lot");
      }
    } catch (error) {
      console.error("Error adding new lot", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/lotes/");
      const data = await response.json();
      setLotes(data);
      return data; // Devuelve los datos para su uso posterior
    } catch (error) {
      console.error("Error fetching data from API", error);
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

  // Verifica si 'lotes' es un array válido antes de mapear
  const rowsWithActions = lotes && lotes.map((lote) => {
    return {
      ...lote,
      acciones: getActionButtons(lote),
    };
  });

  const filteredLotes = rowsWithActions.filter((lote) => {
    return lote.numero_lote.toString().includes(searchTerm);
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
              <SoftTypography variant="h6">LOTS TABLE</SoftTypography>
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
                Agregar Producto
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
              <Table columns={columns} rows={filteredLotes} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      {/* Diálogo de edición de lote */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Editar Lote</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="numero_lote">Numero Lote</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="numero_lote"
                    value={editedLote.numero_lote}
                    onChange={(e) => setEditedLote({ ...editedLote, numero_lote: e.target.value })}
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
          <Button onClick={editLote} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de creación de lote */}
      <Dialog open={newLoteDialogOpen} onClose={() => setNewLoteDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nuevo Lote</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <InputLabel htmlFor="fecha_ingreso">Fecha Ingreso</InputLabel>
                <TextField
                  type="date"
                  variant="filled"
                  color="secondary"
                  value={newLote.fecha_ingreso}
                  onChange={(e) => setNewLote({ ...newLote, fecha_ingreso: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="numero_lote">Numero Lote</InputLabel>
                <TextField
                  variant="filled"
                  color="secondary"
                  value={newLote.numero_lote}
                  onChange={(e) => setNewLote({ ...newLote, numero_lote: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewLoteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={addNewLote} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Lotes;
