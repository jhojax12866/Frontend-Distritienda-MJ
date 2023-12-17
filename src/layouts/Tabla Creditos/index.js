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
import GetAppIcon from "@mui/icons-material/GetApp"; // Add this import
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Chip, FormControl, InputLabel } from "@mui/material";
import { Grid } from "@mui/material";

const data_cartera = {
  columns: [
    { name: "id", align: "center" },
    { name: "factura_v", align: "center" },
    { name: "cliente", align: "center" },
    { name: "telefono", align: "center" },
    { name: "fecha_ingreso", align: "center" },
    { name: "fecha_vencimiento", align: "center" },
    { name: "estado_pago_v", aling: "center"},
    { name: "medio_pago_v", aling: "center"},
    { name: "acciones", align: "center" },
    
  ],
};

function Creditos() {
  const { columns } = data_cartera;
  const [cartera, setCartera] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCartera, setSelectedCartera] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newCarteraDialogOpen, setNewCarteraDialogOpen] = useState(false);
  const [editedCartera, setEditedCartera] = useState({});
  const [newCartera, setNewCartera] = useState({
    factura_v: "",
    fecha_vencimiento: "",
    telefono: "",
  });

  // Declare accessToken globally
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (cartera) => {
    setSelectedCartera(cartera);
    setEditedCartera({ ...cartera });
    setEditDialogOpen(true);
  };

  const handleDelete = (cartera) => {
    setSelectedCartera(cartera);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setNewCarteraDialogOpen(true);
  };

  const handleGetPDF = async (cartera) => {
    try {
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/cartera/${cartera.id}/pdf`, requestOptions);

      if (response.ok) {
        // Create a Blob from the PDF data and trigger a download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cartera_${cartera.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        console.log("PDF downloaded successfully!");
      } else if (response.status === 401) {
        console.error("Authorization error: Token is invalid or expired.");
      } else {
        console.error("Error getting PDF:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error getting PDF", error);
    }
  };

  const deleteCartera = async () => {
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
  
      // Eliminar el registro de cartera
      await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/cartera/${selectedCartera.id}/`, requestOptions);
  
      // Actualizar el estado eliminando el elemento correspondiente
      setCartera(prevCartera => prevCartera.filter(cartera => cartera.id !== selectedCartera.id));
  
      console.log("Cartera deleted successfully!");
    } catch (error) {
      console.error("Error deleting cartera", error);
    }
  
    setDeleteDialogOpen(false);
  };
  

  const editCartera = async () => {
    try {
      if (!editedCartera.id) {
        console.error("Cartera ID is not defined.");
        return;
      }

      const editedCarteraData = {
        factura_v: editedCartera.factura_v,
        fecha_vencimiento: editedCartera.fecha_vencimiento,
        telefono: editedCartera.telefono,
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
        `https://simplificado-48e1a3e2d000.herokuapp.com/cartera/${editedCartera.id}/`,
        requestOptions
      );

      if (response.ok) {
        const updatedCartera = await fetchData();
        setCartera(updatedCartera);

        setEditedCartera({});
        setEditDialogOpen(false);
      } else if (response.status === 401) {
        console.error("Authorization error: Token is invalid or expired.");
      } else {
        console.error("Error editing cartera:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error editing cartera", error);
    }
  };


  const addNewCartera = async () => {
    try {
      // Intenta convertir newCartera.fecha_vencimiento a un objeto Date
      const fechaVencimientoDate = new Date(newCartera.fecha_vencimiento);
  
      if (isNaN(fechaVencimientoDate.getTime())) {
        // La conversión a Date no fue exitosa
        console.error("Invalid date format for fecha_vencimiento");
        return;
      }
  
      const formattedFechaVencimiento = fechaVencimientoDate.toISOString().split('T')[0];
  
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/cartera/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...newCartera, fecha_vencimiento: formattedFechaVencimiento }),
      });
  
      if (!response.ok) {
        console.error("Error adding new cartera:", response.statusText);
        console.log(await response.json());
      } else {
        const updatedCartera = await fetchData();
        setCartera(updatedCartera);
  
        setNewCartera({
          factura_v: "",
          fecha_vencimiento: "",
          telefono: "",
        });
        setNewCarteraDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding new cartera", error);
    }
  };
  
  const fetchClienteData = async (cartera) => {
    try {
      const responseFactura = await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/factura_venta/${cartera.factura_v}/`);
      const dataFactura = await responseFactura.json();

      return {
        ...cartera,
        fecha_ingreso: dataFactura.fecha_ingreso,
        cliente: dataFactura.cliente,
        medio_pago_v: dataFactura.medio_pago_v,
        estado_pago_v: dataFactura.estado_pago_v,
      };
    } catch (error) {
      console.error("Error fetching cliente data", error);
      return cartera; // Devuelve el objeto cartera sin cambios en caso de error
    }
  };
  const fetchData = async () => {
    try {
      const responseCartera = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/cartera/");
      const dataCartera = await responseCartera.json();
  
      if (!dataCartera) {
        console.error("Data from API is null");
        return [];
      }
  
      // Filtrar los datos que tienen un valor en el campo "factura_v"
      const filteredCartera = dataCartera.filter(cartera => cartera.factura_v);
  
      const updatedCartera = await Promise.all(filteredCartera.map(fetchClienteData));
  
      setCartera(updatedCartera);
      return updatedCartera;
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };
  
  

  const getActionButtons = (cartera) => (
    <div>
      
      <IconButton onClick={() => handleEdit(cartera)} color="info">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(cartera)} color="error">
        <DeleteIcon />
      </IconButton>
      
    </div>
  );

  // Verifica si 'cartera' es un array válido antes de mapear
  const rowsWithActions = cartera && cartera.map((cartera) => {
    return {
      ...cartera,
      acciones: getActionButtons(cartera),
    };
  });
  

  const filteredCartera = rowsWithActions.filter((cartera) => {
    return cartera && cartera.factura_v && cartera.factura_v.toString().includes(searchTerm);
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
              <SoftTypography variant="h6">REGISTRO DE CREDITOS</SoftTypography>
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
                Agregar Cartera
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
              <Table columns={columns} rows={filteredCartera} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar el registro de cartera?
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

      {/* Diálogo de edición de cartera */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Editar Cartera</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="factura_v">Factura V</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="factura_v"
                    value={editedCartera.factura_v}
                    onChange={(e) => setEditedCartera({ ...editedCartera, factura_v: e.target.value })}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="fecha_vencimiento">Fecha Vencimiento</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="fecha_vencimiento"
                    value={editedCartera.fecha_vencimiento}
                    onChange={(e) => setEditedCartera({ ...editedCartera, fecha_vencimiento: e.target.value })}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="telefono">Teléfono</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <TextField
                    id="telefono"
                    value={editedCartera.telefono}
                    onChange={(e) => setEditedCartera({ ...editedCartera, telefono: e.target.value })}
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
          <Button onClick={editCartera} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de creación de cartera */}
      <Dialog open={newCarteraDialogOpen} onClose={() => setNewCarteraDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nueva Cartera</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <InputLabel htmlFor="factura_v">Factura V</InputLabel>
                <TextField
                  variant="filled"
                  color="secondary"
                  value={newCartera.factura_v}
                  onChange={(e) => setNewCartera({ ...newCartera, factura_v: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="fecha_vencimiento">Fecha Vencimiento</InputLabel>
                <TextField
                  type="date"
                  variant="filled"
                  color="secondary"
                  value={newCartera.fecha_vencimiento}
                  onChange={(e) => {
                    const localDate = new Date(e.target.value);
                    const adjustedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
                    setNewCartera({ ...newCartera, fecha_vencimiento: adjustedDate });
                  }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="telefono">Teléfono</InputLabel>
                <TextField
                  variant="filled"
                  color="secondary"
                  value={newCartera.telefono}
                  onChange={(e) => setNewCartera({ ...newCartera, telefono: e.target.value })}
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

export default Creditos;
