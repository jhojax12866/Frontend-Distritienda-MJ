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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Visibility } from "@mui/icons-material";
import DashboardNavbar2 from "layouts/Compras/componentes";

const data_facturas = {
  columns: [
    { name: "id", align: "left" },
    { name: "cliente", align: "center" },
    { name: "fecha_ingreso", align: "center" },
    { name: "medio_pago_v", align: "center" },
    { name: "estado_pago_v", align: "center" },
    { name: "total_v", align: "center", label: "Total Venta" },
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
  const [totalFactura, setTotalFactura] = useState(0);
  const [newFactura, setNewFactura] = useState({
    cliente: "",
    fecha_ingreso: "",
    medio_pago_v: "", // Valor inicial
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

    
    if (selectedFactura) {
      setEditedFactura({ ...selectedFactura });
    }
  }, [selectedFactura]);

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
  const [productosFactura, setProductosFactura] = useState([]);


  
  const [verProductosDialogOpen, setVerProductosDialogOpen] = useState(false);
  
  const fetchProductos = async (facturaId) => {
    try {
      const response = await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/detalle_venta/?factura_venta=${facturaId}`);
      if (!response.ok) {
        throw new Error(`Error al obtener productos de la factura: ${response.status} - ${response.statusText}`);
      }
      const productos = await response.json();
      return productos;
    } catch (error) {
      console.error("Error obteniendo productos de la factura:", error);
      throw error;
    }
  };
  
  const handleVerProductos = async (factura) => {
    try {
      const productos = await fetchProductos(factura.id);
  
      const productosConNombre = await Promise.all(
        productos.map(async (producto) => {
          try {
            const productoResponse = await fetch(
              `https://simplificado-48e1a3e2d000.herokuapp.com/productos/${producto.producto_venta}/`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
  
            if (!productoResponse.ok) {
              throw new Error(`Error al obtener detalles del producto: ${productoResponse.status} - ${productoResponse.statusText}`);
            }
  
            const productoDetallado = await productoResponse.json();
  
            return {
              ...producto,
              nombre: productoDetallado.nombre,
              precio: productoDetallado.precio,
              total_producto: producto.cantidad * productoDetallado.precio,
            };
          } catch (error) {
            console.error("Error obteniendo detalles del producto", error);
            return {
              ...producto,
              nombre: "Error obteniendo nombre",
              precio: 0,
              total_producto: 0,
            };
          }
        })
      );
  
      console.log("Productos con Nombre:", productosConNombre);
  
      setProductosFactura(productosConNombre);
      setVerProductosDialogOpen(true);
  
      const totalFactura = productosConNombre.reduce((total, producto) => total + producto.total_producto, 0);
      setTotalFactura(totalFactura);
    } catch (error) {
      console.error("Error obteniendo productos de la factura", error);
    }
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
        // total_v: editedFactura.total_v, // Elimina esta línea
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
      console.log("Nueva Factura:", newFactura);
  
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/factura_venta/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newFactura),
      });
  
      console.log("Respuesta:", response);
  
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
        console.error("Error al agregar nueva factura");
      }
    } catch (error) {
      console.error("Error al agregar nueva factura", error);
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
      <IconButton onClick={() => handleVerProductos(factura)} color="primary">
        <Visibility />
      </IconButton>
    </div>
  );
  
  const rowsWithActions = facturas.map((factura) => {
    const productosDeFactura = productosFactura.filter(producto => producto.factura_venta === factura.id);
    const totalFactura = productosDeFactura.reduce((total, producto) => total + producto.total_producto, 0);
  
    return {
      ...factura,
      total_v: totalFactura.toFixed(2),
      productos: productosDeFactura.map(producto => producto.nombre).join(", "), // Display product names
      acciones: getActionButtons(factura),
    };
  });
  
  const filteredFacturas = rowsWithActions.filter((factura) => {
    return (
      factura.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.total_v.toString().includes(searchTerm)
    );
  });
  
  

  return (
    <DashboardLayout sx={{ backgroundColor: 'rgba(173, 216, 230, 0.9)' }}>
      <DashboardNavbar2 />
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
              <SoftTypography variant="h6">FACTURAS DE VENTAS</SoftTypography>
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
            <InputLabel htmlFor="cliente">Cliente</InputLabel>
            <FormControl fullWidth variant="outlined" margin="normal">
              <TextField
                id="cliente"
                value={editedFactura.cliente}
                onChange={(e) => setEditedFactura({ ...editedFactura, cliente: e.target.value })}
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
  <InputLabel htmlFor="medio_pago_v">Medio de Pago</InputLabel>
  <FormControl fullWidth variant="outlined" margin="normal">
    <Select
      id="medio_pago_v"
      value={editedFactura.medio_pago_v}
      onChange={(e) => setEditedFactura({ ...editedFactura, medio_pago_v: e.target.value })}
      fullWidth
      variant="outlined"
      required
    >
                    <MenuItem value="Efectivo">Efectivo</MenuItem>
                    <MenuItem value="Transferencia BANCOLOMBIA">Transferencia BANCOLOMBIA</MenuItem>
                    <MenuItem value="Transferencia NEQUI">Transferencia NEQUI</MenuItem>
      {/* Agrega más opciones según sea necesario */}
    </Select>
  </FormControl>
</Grid>

        <Grid item xs={12}>
  <InputLabel htmlFor="estado_pago_v">Estado de Pago</InputLabel>
  <FormControl fullWidth variant="outlined" margin="normal">
    <Select
      id="estado_pago_v"
      value={editedFactura.estado_pago_v}
      onChange={(e) => setEditedFactura({ ...editedFactura, estado_pago_v: e.target.value })}
      fullWidth
      variant="outlined"
      required
    >
      <MenuItem value="APROBADO">APROBADO</MenuItem>
      <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
      <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
    </Select>
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
      style={{ color: 'white' }} // Establecer el color blanco
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
          <InputLabel htmlFor="cliente">Cliente</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="cliente"
              value={newFactura.cliente}
              onChange={(e) => setNewFactura({ ...newFactura, cliente: e.target.value })}
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
                <InputLabel htmlFor="medio_pago_v">Medio de Pago</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <Select
                    id="medio_pago_v"
                    value={newFactura.medio_pago_v}
                    onChange={(e) => setNewFactura({ ...newFactura, medio_pago_v: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  >
                    <MenuItem value="Efectivo">Efectivo</MenuItem>
                    <MenuItem value="Transferencia BANCOLOMBIA">Transferencia BANCOLOMBIA</MenuItem>
                    <MenuItem value="Transferencia NEQUI">Transferencia NEQUI</MenuItem>
                    {/* Agrega más opciones según sea necesario */}
                  </Select>
                </FormControl>
              </Grid>

        <Grid item xs={12}>
                <InputLabel htmlFor="estado_pago_v">Estado de Pago</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <Select
                    id="estado_pago_v"
                    value={newFactura.estado_pago_v}
                    onChange={(e) => setNewFactura({ ...newFactura, estado_pago_v: e.target.value })}
                    fullWidth
                    variant="outlined"
                    required
                  >
                    <MenuItem value="APROBADO">APROBADO</MenuItem>
                    <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                    <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                  </Select>
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
      Guardar
    </Button>
  </DialogActions>
</Dialog>


<Dialog open={verProductosDialogOpen} onClose={() => setVerProductosDialogOpen(false)}>
        <DialogTitle>Productos de la Factura</DialogTitle>
        <DialogContent>
          {productosFactura.map((producto) => (
            <div key={producto.id}>
              <p>Producto: {producto.nombre}</p>
              <p>Cantidad: {producto.cantidad}</p>
              <p>Precio: {producto.precio}</p>
              
            </div>
          ))}
          <p>Total Factura: {totalFactura}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerProductosDialogOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>



    </DashboardLayout>
  );
  
}
export default Tabla_Ventas;