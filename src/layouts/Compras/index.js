import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const data_facturas = {
  columns: [
    { name: "id", align: "left" },
    { name: "proveedor", align: "center" },
    { name: "telefono", align: "center" },
    { name: "fecha_ingreso", align: "center" },
    { name: "email", align: "center" },
    { name: "categoriaf", align: "center" },
    { name: "medio_pago_c", align: "center" }, // Nuevo campo
    { name: "estado_pago_c", align: "center" }, // Nuevo campo
    { name: "lote_f", align: "center" }, // Nuevo campo
    { name: "acciones", align: "center" },
  ],
};

function TablaCompras() {
  const { columns } = data_facturas;
  const [facturas, setFacturas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newFacturaDialogOpen, setNewFacturaDialogOpen] = useState(false);
  const [editedFactura, setEditedFactura] = useState({});
  const [newFactura, setNewFactura] = useState({
    proveedor: "",
    telefono: "",
    fecha_ingreso: "",
    email: "",
    categoriaf: "", // Nuevo campo
  });
  


  

  // Declare accessToken globally
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const initialData = await fetchData();
      setFacturas(initialData);
    };
  
    fetchDataAndSetState();
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

      await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/${selectedFactura.id}/`, requestOptions);

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
        proveedor: editedFactura.proveedor,
        telefono: editedFactura.telefono,
        fecha_ingreso: editedFactura.fecha_ingreso,
        email: editedFactura.email,
        medio_pago_c: editedFactura.medio_pago_c,
        estado_pago_c: editedFactura.estado_pago_c,
        lote_f: editedFactura.lote_f,
        categoriaf: editedFactura.categoriaf, // Asegúrate de incluir categoriaf
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
        `https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/${editedFactura.id}/`,
        requestOptions
      );
  
      if (response.ok) {
        const updatedFacturas = await fetchData();
        setFacturas(updatedFacturas);

        setEditedFactura({});
        setEditDialogOpen(false);
      } else {
        console.error("Error editando factura:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error editando factura", error);
    }
  };

  const addNewFactura = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...newFactura,
          categoriaf: newFactura.categoriaf, // Nuevo campo
        }),
      });
  
      if (response.ok) {
        const updatedFacturas = await fetchData();
        setFacturas(updatedFacturas);
  
        setNewFactura({
          proveedor: "",
          telefono: "",
          fecha_ingreso: "",
          email: "",
          categoria: "", // Reset the category after adding a new factura
        });
        setNewFacturaDialogOpen(false);
      } else {
        console.error("Error al agregar nueva factura");
      }
    } catch (error) {
      console.error("Error al agregar nueva factura", error);
    }
  };
  

  const fetchData = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/factura_compra/");
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
    return factura.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout sx={{ backgroundColor: 'rgba(173, 216, 230, 0.9)' }}>
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
              <SoftTypography variant="h6">FACTURAS DE COMPRAS</SoftTypography>
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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar el registro?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteFactura} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>









      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Editar Factura</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="proveedor">Proveedor</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="proveedor"
                    value={editedFactura.proveedor}
                    onChange={(e) => setEditedFactura({ ...editedFactura, proveedor: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="telefono">Teléfono</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="telefono"
                    value={editedFactura.telefono}
                    onChange={(e) => setEditedFactura({ ...editedFactura, telefono: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="fecha_ingreso">Fecha de Ingreso</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="fecha_ingreso"
                    value={editedFactura.fecha_ingreso}
                    onChange={(e) => setEditedFactura({ ...editedFactura, fecha_ingreso: e.target.value })}
                    fullWidth
                    type="date"
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="email">Correo Electrónico</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="email"
                    value={editedFactura.email}
                    onChange={(e) => setEditedFactura({ ...editedFactura, email: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="categoriaf">Categoría F</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="categoriaf"
                    value={newFactura.categoriaf}  // o editedFactura.categoriaf en el caso de editar
                    onChange={(e) => setNewFactura({ ...newFactura, categoriaf: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="medio_pago_c">Medio de Pago</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="medio_pago_c"
                    value={editedFactura.medio_pago_c}
                    onChange={(e) => setEditedFactura({ ...editedFactura, medio_pago_c: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="estado_pago_c">Estado de Pago</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="estado_pago_c"
                    value={editedFactura.estado_pago_c}
                    onChange={(e) => setEditedFactura({ ...editedFactura, estado_pago_c: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="lote_f">Lote</InputLabel>
              <FormControl fullWidth variant="outlined" margin="normal">
                <TextField
                  id="lote_f"
                  value={editedFactura.lote_f}
                  onChange={(e) => setEditedFactura({ ...editedFactura, lote_f: e.target.value })}
                  fullWidth
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={editFactura}
            color="primary"
            variant="contained"
            style={{ color: 'white' }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>






      <Dialog open={newFacturaDialogOpen} onClose={() => setNewFacturaDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nueva Factura</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="proveedor">Proveedor</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="proveedor"
                    value={newFactura.proveedor}
                    onChange={(e) => setNewFactura({ ...newFactura, proveedor: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="telefono">Teléfono</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="telefono"
                    value={newFactura.telefono}
                    onChange={(e) => setNewFactura({ ...newFactura, telefono: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="fecha_ingreso">Fecha de Ingreso</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="fecha_ingreso"
                    value={newFactura.fecha_ingreso}
                    onChange={(e) => setNewFactura({ ...newFactura, fecha_ingreso: e.target.value })}
                    fullWidth
                    type="date"
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="email">Correo Electrónico</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="email"
                    value={newFactura.email}
                    onChange={(e) => setNewFactura({ ...newFactura, email: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="categoriaf">Categoría F</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="categoriaf"
                    value={editedFactura.categoriaf}
                    onChange={(e) => setEditedFactura({ ...editedFactura, categoriaf: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="medio_pago_c">Medio de Pago</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="medio_pago_c"
                    value={newFactura.medio_pago_c}
                    onChange={(e) => setNewFactura({ ...newFactura, medio_pago_c: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="estado_pago_c">Estado de Pago</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="estado_pago_c"
                    value={newFactura.estado_pago_c}
                    onChange={(e) => setNewFactura({ ...newFactura, estado_pago_c: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="lote_f">Lote</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="lote_f"
                    value={newFactura.lote_f}
                    onChange={(e) => setNewFactura({ ...newFactura, lote_f: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  />
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>





        <DialogActions>
          <Button onClick={() => setNewFacturaDialogOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={addNewFactura}
            color="primary"
            variant="contained"
            style={{ color: 'white' }}
          >
            Agregar
          </Button>
        </DialogActions>



      </Dialog>
    </DashboardLayout>
  );
}

export default TablaCompras;

