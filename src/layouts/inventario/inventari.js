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
import select from "assets/theme/components/form/select";

const data_productos = {
  columns: [
    { name: "id", align: "left" },
    { name: "nombre", align: "left" },
    { name: "descripcion", align: "left" },
    { name: "cantidad", align: "center" }, 
    { name: "categoria", align: "center" },
    { name: "precio", align: "center" },
    { name: "estado", align: "center" },
    { name: "fecha_vencimiento", align: "center" },
    //{ name: "imagen", align: "center" },
    { name: "acciones", align: "center" },
  ],
};



function Inventario() {
  const { columns } = data_productos;
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [newProduct, setNewProduct] = useState({
    codigo: 0,
    nombre: "",
    descripcion: "",
    categoria: 1,
    precio: "0.00",
    estado: "activo",
    fecha_vencimiento: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData, lotesData] = await Promise.all([
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/").then((response) => response.json()),
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/categorias/").then((response) => response.json()),
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/lotes/").then((response) => response.json()),
        ]);

        setProductos(productosData);
        setCategorias(categoriasData);
        setLotes(lotesData);
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

   const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditedProduct({ ...product }); // Copiar el producto para evitar modificar el original directamente
    setEditDialogOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const deleteProduct = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("No se encontró el token de acceso");
        return;
      }

      console.log("Deleting product...");
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/productos/${selectedProduct.id}/`, requestOptions);

      // Actualizar la lista de productos después de la eliminación
      const updatedProducts = productos.filter((product) => product.id !== selectedProduct.id);
      setProductos(updatedProducts);

      console.log("Product deleted successfully!");
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }

    setDeleteDialogOpen(false);
  };

  const editProduct = async () => {
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxNTY1MzI3LCJpYXQiOjE3MDE1NjUwMjcsImp0aSI6ImJkNzM1YTdlYWRkMzQyZjVhZjFhMmM1YWU2NmQwNGYxIiwidXNlcl9pZCI6M30.UbUadmd3QLkgb_ev8E9_x7i4l1NothArzBAw1Cfkqkw`,  // Replace YOUR_ACCESS_TOKEN with the actual token
        },
        body: JSON.stringify(editedProduct),
      };
  
      await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/productos/${editedProduct.id}/`, requestOptions);
  
      // Actualizar la lista de productos después de la edición
      const updatedProducts = await fetchData();
      setProductos(updatedProducts);
  
      // Limpiar el estado después de la edición
      setEditedProduct({});
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error al editar el producto", error);
    }
  };

  const addNewProduct = async () => {
    try {
      const response = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        // Actualizar la lista de productos después de la creación
        const updatedProducts = await fetchData();
        setProductos(updatedProducts);

        // Limpiar el estado después de la creación
        setNewProduct({
          codigo: 0,
          nombre: "",
          descripcion: "",
          categoria: 1,
          precio: "0.00",
          estado: "",
          fecha_vencimiento: "",
        });
        setNewProductDialogOpen(false);
      } else {
        console.error("Error al agregar el nuevo producto");
      }
    } catch (error) {
      console.error("Error al agregar el nuevo producto", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener datos de la API", error);
    }
  };

  const getActionButtons = (product) => (
    <div>
      <IconButton onClick={() => handleEdit(product)} color="info">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(product)} color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
  };
  const getChipColor = (estado) => {
    switch (estado) {
      case 'activo':
        return 'primary';
      case 'inactivo':
        return 'warning'; // Amarillo
      case 'agotado':
        return 'error'; // Rojo
      case 'ACTIVO':
        return 'primary';
      case 'INACTIVO':
        return 'warning'; // Amarillo
      case 'AGOTADO':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getChipBackgroundColor = (estado) => {
    switch (estado) {
      case 'activo':
        return '#4CAF50'; // Verde
      case 'inactivo':
        return '#FFEB3B'; // Amarillo
      case 'agotado':
        return '#FFF0001'; // Rojo
      case 'ACTIVO':
        return '#4CAF50'; // Verde
      case 'INACTIVO':
        return '#FFEB3B'; // Amarillo
      case 'AGOTADO':
        return '#FFF0001'
      default:
        return 'inherit';
    }
  };
  const getChipTextColor = (estado) => {
    switch (estado) {
      case 'activo':
        return '#FFF';
      case 'inactivo':
        return '#FFF';
        case 'agotado':
        return '#FFF' ;
      case 'ACTIVO':
        return '#FFF'; 
      case 'INACTIVO':
        return '#FFF'; // Amarillo
      case 'AGOTADO':
        return '#FFF0001'
      default:
        return 'inherit';
    }
  };
  const rowsWithActions = productos.map((product) => {
    const productLotes = lotes.filter((lote) => lote.producto_lote === product.id);
    const totalQuantity = productLotes.reduce((acc, lote) => acc + parseFloat(lote.cantidad), 0);
  
    return {
      ...product,
      acciones: getActionButtons(product),
      precio: `$${formatCurrency(product.precio)}`,
      fecha_vencimiento: formatDate(product.fecha_vencimiento),
      estado: (
        <Chip
          label={product.estado}
          color={getChipColor(product.estado)}
          style={{
            backgroundColor: getChipBackgroundColor(product.estado),
            color: getChipTextColor(product.estado),
          }}
        />
      ),
      /*imagen: (
        <img
          src={product.imagen}
          alt={product.nombre}
          style={{ maxWidth: '50px', maxHeight: '50px' }}
        />
      ),*/
      categoria: categorias.find((categoria) => categoria.id === product.categoria)?.descripcion || '',
      cantidad: Math.round(totalQuantity), 
    };
  });
  
  

  const filteredProducts = rowsWithActions.filter((product) => {
    return (
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
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
              <SoftTypography variant="h6">TABLA DE PRODUCTOS</SoftTypography>
              <IconButton onClick={() => setNewProductDialogOpen(true)} color="primary">
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
              <Table columns={columns} rows={filteredProducts} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      

      {/* confirmar borrar */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar el producto?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteProduct} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialogo de edicion */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              id="nombre"
              value={editedProduct.nombre}
              onChange={(e) => setEditedProduct({ ...editedProduct, nombre: e.target.value })}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="descripcion"
              value={editedProduct.descripcion}
              onChange={(e) => setEditedProduct({ ...editedProduct, descripcion: e.target.value })}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="categoria"
              value={editedProduct.categoria}
              onChange={(e) => setEditedProduct({ ...editedProduct, categoria: e.target.value })}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="precio"
              value={editedProduct.precio}
              onChange={(e) => setEditedProduct({ ...editedProduct, precio: e.target.value })}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              id="estado"
              value={editedProduct.estado}
              onChange={(e) => setEditedProduct({ ...editedProduct, estado: e.target.value })}
              fullWidth
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={editProduct} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialogo de crear producto */}
      <Dialog open={newProductDialogOpen} onClose={() => setNewProductDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="nombre">Nombre</InputLabel>
                <TextField
                  id="nombre"
                  value={newProduct.nombre}
                  onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="descripcion">Descripción</InputLabel>
                <TextField
                  id="descripcion"
                  value={newProduct.descripcion}
                  onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="categoria">Categoría</InputLabel>
                <TextField
                  id="categoria"
                  value={newProduct.categoria}
                  onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                  fullWidth
                />
              </FormControl>
            </Grid>

            {/* Add more fields as needed */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewProductDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={addNewProduct} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Inventario;
