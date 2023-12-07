import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const NewProductDialog = ({ open, onClose, onProductCreate }) => {
  const [categorias, setCategorias] = useState([]);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    cantidad: 0,
    precio: '0.00',
    estado: '',
    fecha_vencimiento: '',
    imagen: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasResponse = await fetch('https://diplomadobd-06369030a7e4.herokuapp.com/categorias');
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    // Handle product creation logic here
    onProductCreate(newProduct);
    // Reset the form and close the dialog
    setNewProduct({
      nombre: '',
      descripcion: '',
      categoria: '',
      cantidad: 0,
      precio: '0.00',
      estado: '',
      fecha_vencimiento: '',
      imagen: null,
    });
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, imagen: file });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Agregar Nuevo Producto</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              value={newProduct.nombre}
              onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              value={newProduct.descripcion}
              onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={newProduct.categoria}
                onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
              >
                <MenuItem value="">Seleccionar</MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cantidad"
              type="number"
              fullWidth
              value={newProduct.cantidad}
              onChange={(e) => setNewProduct({ ...newProduct, cantidad: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Precio"
              type="number"
              fullWidth
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Estado"
              fullWidth
              value={newProduct.estado}
              onChange={(e) => setNewProduct({ ...newProduct, estado: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha de Vencimiento"
              type="date"
              fullWidth
              value={newProduct.fecha_vencimiento}
              onChange={(e) => setNewProduct({ ...newProduct, fecha_vencimiento: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                color="default"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Subir Imagen
              </Button>
            </label>
            {newProduct.imagen && <span>{newProduct.imagen.name}</span>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <IconButton onClick={handleCreate} color="primary">
          <AddIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

NewProductDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProductCreate: PropTypes.func.isRequired,
};

export default NewProductDialog;