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
import { FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";

const data_stock = {
  columns: [
    { name: "id", align: "left" },
    { name: "producto_stock", align: "center" },
    { name: "lote_stock", align: "center" },
    { name: "acciones", align: "center" },
  ],
};

function Stock() {
  const { columns } = data_stock;
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStockDialogOpen, setNewStockDialogOpen] = useState(false);
  const [editedStock, setEditedStock] = useState({});
  const [newStock, setNewStock] = useState({
    producto_stock: null,
    lote_stock: 1,
  });

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
    fetchProducts();
    fetchLotes();
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setEditedStock({ ...stock });
    setEditDialogOpen(true);
  };

  const handleDelete = (stock) => {
    setSelectedStock(stock);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setNewStockDialogOpen(true);
  };

  const deleteStock = async () => {
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

      await fetch(`https://simplificado-48e1a3e2d000.herokuapp.com/stock/${selectedStock.id}/`, requestOptions);

      const updatedStock = await fetchData();
      setStock(updatedStock);

      console.log("Stock deleted successfully!");
    } catch (error) {
      console.error("Error deleting stock", error);
    }

    setDeleteDialogOpen(false);
  };

  const editStock = async () => {
    try {
      if (!editedStock.id) {
        console.error("Stock ID is not defined.");
        return;
      }

      const editedStockData = {
        producto_stock: parseInt(editedStock.producto_stock),
        lote_stock: parseInt(editedStock.lote_stock),
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editedStockData),
      };

      const response = await fetch(
        `https://simplificado-48e1a3e2d000.herokuapp.com/stock/${editedStock.id}/`,
        requestOptions
      );

      if (response.ok) {
        const updatedStock = await fetchData();
        setStock(updatedStock);

        setEditedStock({});
        setEditDialogOpen(false);
      } else if (response.status === 401) {
        console.error("Authorization error: Token is invalid or expired.");
      } else {
        console.error("Error editing stock:", response.statusText);
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error editing stock", error);
    }
  };

  const addNewStock = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/stock/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newStock),
      });

      if (response.ok) {
        const updatedStock = await fetchData();
        setStock(updatedStock);

        setNewStock({
          producto_stock: null,
          lote_stock: 1,
        });
        setNewStockDialogOpen(false);
      } else {
        console.error("Error adding new stock");
      }
    } catch (error) {
      console.error("Error adding new stock", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/productos/");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching product data from API", error);
    }
  };

  const fetchLotes = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/lotes/");
      const data = await response.json();
      setLotes(data);
    } catch (error) {
      console.error("Error fetching lotes data from API", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/stock/");
      const data = await response.json();
      setStock(data);
      return data;
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };

  const getActionButtons = (stock) => (
    <div>
      <IconButton onClick={() => handleEdit(stock)} color="info">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(stock)} color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const rowsWithActions = stock && stock.map((stock) => {
    const productoNombre = products.find(product => product.id === stock.producto_stock)?.nombre || stock.producto_stock;
    const loteNumero = lotes.find(lote => lote.id === stock.lote_stock)?.numero_lote || stock.lote_stock;

    return {
      ...stock,
      producto_stock: productoNombre,
      lote_stock: loteNumero,
      acciones: getActionButtons(stock),
    };
  });

  const filteredStock = rowsWithActions.filter((stock) => {
    return stock.lote_stock.toString().includes(searchTerm);
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
              <SoftTypography variant="h6">STOCK TABLE</SoftTypography>
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
              <Table columns={columns} rows={filteredStock} />
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
          <Button onClick={deleteStock} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Editar Stock</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="producto_stock">Producto Stock</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <Select
                    id="producto_stock"
                    value={editedStock.producto_stock}
                    onChange={(e) => setEditedStock({ ...editedStock, producto_stock: e.target.value })}
                    fullWidth
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="lote_stock">Lote Stock</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <Select
                    id="lote_stock"
                    value={editedStock.lote_stock}
                    onChange={(e) => setEditedStock({ ...editedStock, lote_stock: e.target.value })}
                    fullWidth
                  >
                    {lotes.map((lote) => (
                      <MenuItem key={lote.id} value={lote.id}>
                        {lote.numero_lote}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={editStock} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newStockDialogOpen} onClose={() => setNewStockDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle style={{ backgroundColor: '#3498db', color: '#fff' }}>Agregar Nuevo Stock</DialogTitle>
        <DialogContent>
          <form>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <InputLabel htmlFor="producto_stock">Producto Stock</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <Select
                    id="producto_stock"
                    value={newStock.producto_stock}
                    onChange={(e) => setNewStock({ ...newStock, producto_stock: e.target.value })}
                    fullWidth
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="lote_stock">Lote Stock</InputLabel>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <Select
                    id="lote_stock"
                    value={newStock.lote_stock}
                    onChange={(e) => setNewStock({ ...newStock, lote_stock: e.target.value })}
                    fullWidth
                  >
                    {lotes.map((lote) => (
                      <MenuItem key={lote.id} value={lote.id}>
                        {lote.numero_lote}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewStockDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={addNewStock} color="primary">
            Guardar
          </Button>
          </DialogActions>
        </Dialog>
      </DashboardLayout>
    );
  }
  
  export default Stock;
  