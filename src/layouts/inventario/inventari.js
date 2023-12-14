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
import MenuItem from "@mui/material/MenuItem";

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
    { name: "imagen", align: "center" },
    { name: "acciones", align: "center" },
  ],
};

function Inventario() {
  const { columns } = data_productos;
  const [stock, setStock] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [productos, setProductos] = useState([]);
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
    categoria: "",
    precio: "",
    estado: "",
    fecha_vencimiento: "",
  });

  // Declare accessToken globally
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData, lotesData, stockData, estadosData] = await Promise.all([
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/").then((response) => response.json()),
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/categorias/").then((response) => response.json()),
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/lotes/").then((response) => response.json()),
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/stock/").then((response) => response.json()),
        ]);
  
        setProductos(productosData);
        setEstados(estadosData);
        setCategorias(categoriasData);
        setLotes(lotesData);
        setStock(stockData);
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };
  
    fetchData();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setNewProduct({ ...newProduct, imagen: file });
    }
  };
  
  

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditedProduct({ ...product });
    setEditDialogOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setNewProductDialogOpen(true);
  };

  const deleteProduct = async () => {
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

      await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/productos/${selectedProduct.id}/`, requestOptions);

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
      const formData = new FormData();
      formData.append("imagen", editedProduct.imagen);
      console.log("Edited Product Data:", editedProduct);
      if (!editedProduct.id) {
        console.error("El ID del producto a editar no está definido.");
        return;
      }
  
      const editedProductData = {
        codigo: parseInt(editedProduct.codigo),
        nombre: editedProduct.nombre,
        descripcion: editedProduct.descripcion,
        cantidad: parseInt(editedProduct.cantidad),
        categoria: parseInt(editedProduct.categoria), // Parse the categoria to an integer
        precio: editedProduct.precio,
        estado: editedProduct.estado,
        fecha_vencimiento: editedProduct.fecha_vencimiento,
      };
  
      const requestOptions = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedProductData),
      };
  
      const response = await fetch(
        `https://diplomadobd-06369030a7e4.herokuapp.com/productos/${editedProduct.id}/`,
        requestOptions
      );
  
      if (response.ok) {
        // Update the state after editing the product
        const updatedProducts = await fetchData();
        setProductos(updatedProducts);
  
        setEditedProduct({});
        setEditDialogOpen(false);
      } else if (response.status === 401) {
        console.error("Error de autorización: El token no es válido o ha caducado.");
      } else {
        console.error("Error al editar el producto:", response.statusText);
        console.log(await response.json());
      }
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
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const updatedProducts = await fetchData();
        setProductos(updatedProducts);

        setNewProduct({
          codigo: 0,
          nombre: "",
          descripcion: "",
          categoria: "",
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
        return 'warning';
      case 'agotado':
        return 'error';
      case 'ACTIVO':
        return 'primary';
      case 'INACTIVO':
        return 'warning';
      case 'AGOTADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getChipBackgroundColor = (estado) => {
    switch (estado) {
      case 'activo':
        return '#4CAF50';
      case 'inactivo':
        return '#FFEB3B';
      case 'agotado':
        return '#FFF0001';
      case 'ACTIVO':
        return '#4CAF50';
      case 'INACTIVO':
        return '#FFEB3B';
      case 'AGOTADO':
        return '#FFF0001';
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
        return '#FFF';
      case 'ACTIVO':
        return '#FFF';
      case 'INACTIVO':
        return '#FFF';
      case 'AGOTADO':
        return '#FFF0001';
      default:
        return 'inherit';
    }
  };

  const rowsWithActions = productos.map((product) => {
    const productStock = stock.find((item) => item.producto_stock === product.id);
    const totalQuantity = productStock ? productStock.cantidad : 0;

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
    imagen: (
      <img
        src={product.imagen}
        alt={product.nombre}
        style={{ maxWidth: '50px', maxHeight: '50px' }}
      />
    ),
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

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle style={{  backgroundColor: '#3498db', color: '#fff' }}>Editar Producto</DialogTitle>
  <DialogContent>
    <form>
      <Grid container spacing={1}>
        <Grid item xs={12}>
        <InputLabel htmlFor="nombre">Nombre</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="nombre"
              value={editedProduct.nombre}
              onChange={(e) => setEditedProduct({ ...editedProduct, nombre: e.target.value })}
              fullWidth
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
        <InputLabel htmlFor="descripcion">Descripción</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="descripcion"
              value={editedProduct.descripcion}
              onChange={(e) => setEditedProduct({ ...editedProduct, descripcion: e.target.value })}
              fullWidth
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
        <InputLabel htmlFor="cantidad">Cantidad</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="cantidad"
              value={editedProduct.cantidad}
              onChange={(e) => setEditedProduct({ ...editedProduct, cantidad: e.target.value })}
              fullWidth
              type="number"
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
        <InputLabel htmlFor="categoria">Categoría</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">

            <TextField
              select
              id="categoria"
              value={editedProduct.categoria}
              onChange={(e) => setEditedProduct({ ...editedProduct, categoria: e.target.value })}
              fullWidth
              variant="outlined"
              required
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
        <InputLabel htmlFor="precio">Precio</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="precio"
              value={editedProduct.precio}
              onChange={(e) => setEditedProduct({ ...editedProduct, precio: e.target.value })}
              fullWidth
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <InputLabel htmlFor="estado">Estado</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="estado"
              select
              value={editedProduct.estado} 
              onChange={(e) => setEditedProduct({ ...editedProduct, estado: e.target.value })}
              fullWidth
              variant="outlined"
              required
            >
              {["activo", "inactivo", "agotado"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="fecha_vencimiento">Fecha de Vencimiento</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="fecha_vencimiento"
              value={editedProduct.fecha_vencimiento}
              onChange={(e) => setEditedProduct({ ...editedProduct, fecha_vencimiento: e.target.value })}
              fullWidth
              type="date"
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
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
    <Button onClick={editProduct} color="primary" variant="contained">
      Guardar
    </Button>
  </DialogActions>
</Dialog>


     {/* Diálogo de crear producto */}
<Dialog open={newProductDialogOpen} onClose={() => setNewProductDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nuevo Producto</DialogTitle>
  <DialogContent>
    <form>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <InputLabel htmlFor="nombre">Nombre</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="nombre"
              value={newProduct.nombre}
              onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
              fullWidth
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="descripcion">Descripción</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="descripcion"
              value={newProduct.descripcion}
              onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
              fullWidth
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <InputLabel htmlFor="cantidad">Cantidad</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="cantidad"
              value={newProduct.cantidad}
              onChange={(e) => setNewProduct({ ...newProduct, cantidad: e.target.value })}
              fullWidth
              type="number"
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <InputLabel htmlFor="categoria">Categoría</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              select
              id="categoria"
              value={newProduct.categoria}
              onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
              fullWidth
              variant="outlined"
              required
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <InputLabel htmlFor="precio">Precio</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="precio"
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
              fullWidth
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <InputLabel htmlFor="estado">Estado</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="estado"
              select
              value={newProduct.estado}
              onChange={(e) => setNewProduct({ ...newProduct, estado: e.target.value })}
              fullWidth
              variant="outlined"
              required
            >
              {["activo", "inactivo", "agotado"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <InputLabel htmlFor="fecha_vencimiento">Fecha de Vencimiento</InputLabel>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="fecha_vencimiento"
              value={newProduct.fecha_vencimiento}
              onChange={(e) => setNewProduct({ ...newProduct, fecha_vencimiento: e.target.value })}
              fullWidth
              type="date"
              variant="outlined"
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
            />
          </FormControl>
        </Grid>
      </Grid>
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setNewProductDialogOpen(false)} color="secondary">
      Cancelar
    </Button>
    <Button onClick={addNewProduct} color="primary" variant="contained">
      Guardar
    </Button>
  </DialogActions>
</Dialog>

    </DashboardLayout>
  );
}

export default Inventario;