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
import { FormControl, InputLabel, Grid } from "@mui/material";

const data_categorias = {
  columns: [
    { name: "id", align: "left" },
    { name: "descripcion", align: "center" },
    { name: "acciones", align: "center" },
  ],
};

function Categorias() {
  const { columns } = data_categorias;
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newCategoriaDialogOpen, setNewCategoriaDialogOpen] = useState(false);
  const [editedCategoria, setEditedCategoria] = useState({});
  const [newCategoria, setNewCategoria] = useState({
    descripcion: "",
  });

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setEditedCategoria({ ...categoria });
    setEditDialogOpen(true);
  };

  const handleDelete = (categoria) => {
    setSelectedCategoria(categoria);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setNewCategoriaDialogOpen(true);
  };

  const deleteCategoria = async () => {
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

      await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/categorias/${selectedCategoria.id}/`, requestOptions);

      const updatedCategorias = await fetchData();
      setCategorias(updatedCategorias);

      console.log("Categoria deleted successfully!");
    } catch (error) {
      console.error("Error deleting categoria", error);
    }

    setDeleteDialogOpen(false);
  };

  const editCategoria = async () => {
    try {
      if (!editedCategoria.id) {
        console.error("Categoria ID is not defined.");
        return;
      }

      const editedCategoriaData = {
        descripcion: editedCategoria.descripcion,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedCategoriaData),
      };

      const response = await fetch(
        `https://simplificado-48e1a3e2d000.herokuapp.com/categorias/${editedCategoria.id}/`,
        requestOptions
      );

      if (response.ok) {
        const updatedCategorias = await fetchData();
        setCategorias(updatedCategorias);

        setEditedCategoria({});
        setEditDialogOpen(false);
      } else if (response.status === 401) {
        console.error("Authorization error: Token is invalid or expired.");
      } else {
        console.error("Error editing categoria:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error editing categoria", error);
    }
  };

  const addNewCategoria = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/categorias/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newCategoria),
      });

      if (response.ok) {
        const updatedCategorias = await fetchData();
        setCategorias(updatedCategorias);

        setNewCategoria({
          descripcion: "",
        });
        setNewCategoriaDialogOpen(false);
      } else {
        console.error("Error adding new categoria");
      }
    } catch (error) {
      console.error("Error adding new categoria", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/categorias/");
      const data = await response.json();
      setCategorias(data);
      return data;
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };

  const getActionButtons = (categoria) => (
    <div>
      <IconButton onClick={() => handleEdit(categoria)} color="info">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(categoria)} color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const rowsWithActions = categorias && categorias.map((categoria) => {
    return {
      ...categoria,
      acciones: getActionButtons(categoria),
    };
  });

  const filteredCategorias = rowsWithActions.filter((categoria) => {
    return categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
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
              <SoftTypography variant="h6">CATEGORIAS TABLE</SoftTypography>
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
                Agregar Categoría
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
              <Table columns={columns} rows={filteredCategorias} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar la categoría?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteCategoria} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Editar Categoría</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="descripcion">Descripción</InputLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  id="descripcion"
                  label="Descripción"
                  value={editedCategoria.descripcion}
                  onChange={(e) => setEditedCategoria({ ...editedCategoria, descripcion: e.target.value })}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={editCategoria} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newCategoriaDialogOpen} onClose={() => setNewCategoriaDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nueva Categoría</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="descripcion">Descripción</InputLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  id="descripcion"
                  label="Descripción"
                  value={newCategoria.descripcion}
                  onChange={(e) => setNewCategoria({ ...newCategoria, descripcion: e.target.value })}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCategoriaDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={addNewCategoria} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}

export default Categorias;
