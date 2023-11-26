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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

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

function Tabla_Inventario() {
  const { columns } = data_productos;
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/");
        const data = await response.json();
        setProductos(data);
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
    setEditedProductName(product.nombre);
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
      await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/productos/${selectedProduct.id}/`, {
        method: "PUT", // Puedes cambiar a "PATCH" si lo prefieres
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: editedProductName }),
      });
  
      // Actualizar la lista de productos después de la edición
      const updatedProducts = productos.map((product) =>
        product.id === selectedProduct.id ? { ...product, nombre: editedProductName } : product
      );
      setProductos(updatedProducts);
  
      // Limpiar el estado después de la edición
      setSelectedProduct(null);
      setEditedProductName("");
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error al editar el producto", error);
    }
  };

  const getActionButtons = (product) => (
    <div>
      <IconButton onClick={() => handleEdit(product)} color="primary">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(product)} color="secondary">
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const rowsWithActions = productos.map((product) => ({
    ...product,
    acciones: getActionButtons(product),
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
          {/* Campos de edición */}
          <TextField
            label="Nuevo Nombre"
            value={editedProductName}
            onChange={(e) => setEditedProductName(e.target.value)}
          />
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
    </DashboardLayout>
  );
}

export default Tabla_Inventario;