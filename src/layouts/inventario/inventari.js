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

const data_productos = {
  columns: [
    { name: "nombre", align: "left" },
    { name: "descripcion", align: "left" },
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
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
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
        const [productosData, categoriasData] = await Promise.all([
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/").then((response) => response.json()),
          fetch("https://diplomadobd-06369030a7e4.herokuapp.com/categorias/").then((response) => response.json()),
        ]);

        setProductos(productosData);
        setCategorias(categoriasData);
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
    setEditedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const deleteProduct = async () => {
    try {
      await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/productos/${selectedProduct.id}/`, {
        method: "DELETE",
      });

      // Actualizar la lista de productos después de la eliminación
      const updatedProducts = productos.filter((product) => product.id !== selectedProduct.id);
      setProductos(updatedProducts);
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }

    setDeleteDialogOpen(false);
  };

  const editProduct = async () => {
    try {
      await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/productos/${editedProduct.id}/`, {
        method: "PUT", // Puedes cambiar a "PATCH" si lo prefieres
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
      });
  
      // Actualizar la lista de productos después de la edición
      const updatedProducts = productos.map((product) =>
        product.id === editedProduct.id ? editedProduct : product
      );
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
          estado: "activo",
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
  
  const rowsWithActions = productos.map((product) => ({
    ...product,
    acciones: getActionButtons(product),
    precio: `$${formatCurrency(product.precio)}`,
    fecha_vencimiento: formatDate(product.fecha_vencimiento),
    estado: (
      <Chip
        label={product.estado}
        color={product.estado === 'activo' ? 'primary' : 'default'}
        style={{
          backgroundColor: product.estado === 'activo' ? '#4CAF50' : 'inherit',
          color: product.estado === 'activo' ? '#fff' : 'inherit',
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
  }));
  

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
      <Footer />

      {/* Diálogo de confirmación para eliminar */}
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

      {/* Diálogo para editar */}
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
          {/* Agregar más campos según sea necesario */}
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

      {/* Agrega más campos según sea necesario */}
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