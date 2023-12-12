import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { TextField } from "@mui/material";
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
import { FormControl } from "@mui/material";

function Tabla_FacturasCompra() {
  const [facturasCompra, setFacturasCompra] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [detalleCompraData, setDetalleCompraData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [deleteFacturaDialogOpen, setDeleteFacturaDialogOpen] = useState(false);
  const [editFacturaDialogOpen, setEditFacturaDialogOpen] = useState(false);
  const [newFacturaDialogOpen, setNewFacturaDialogOpen] = useState(false);
  const [editedFactura, setEditedFactura] = useState({});
  const [newFactura, setNewFactura] = useState({
    // Agrega los campos necesarios para la nueva factura
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFacturaCompra = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/factura_compra/");
        const dataFacturaCompra = await responseFacturaCompra.json();
        setFacturasCompra(dataFacturaCompra);

        const responseProveedores = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/personas/");
        const dataProveedores = await responseProveedores.json();
        setProveedores(dataProveedores);

        const responseDetalleCompra = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/detalle_compra/");
        const dataDetalleCompra = await responseDetalleCompra.json();
        setDetalleCompraData(dataDetalleCompra);
      } catch (error) {
        console.error("Error al obtener datos de la API", error);
      }
    };

    fetchData();
  }, []);

  const getNombreProveedorById = (proveedorId) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId);
    return proveedor ? `${proveedor.nombre} ${proveedor.apellido}` : "N/A";
  };

  const tablaData = facturasCompra
    .filter((factura) => {
      const proveedorNombre = getNombreProveedorById(factura.proveedor_f);
      return proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .map((factura) => {
      const proveedorNombre = getNombreProveedorById(factura.proveedor_f);
      const detalleCompraInfo = detalleCompraData.find((detalle) => detalle.factura_compra === factura.id);

      if (proveedorNombre && detalleCompraInfo) {
        const cantidadProducto = detalleCompraInfo.cantidad;
        const precioUnitario = parseFloat(detalleCompraInfo.precio_unitario);
        const fechaFacturacion = new Date(factura.fecha_ingreso).toLocaleDateString();
        const totalFactura = cantidadProducto * precioUnitario;

        return {
          proveedor: proveedorNombre,
          cantidad_producto: cantidadProducto,
          precio_unitario: precioUnitario.toFixed(2),
          fecha_facturacion: fechaFacturacion,
          total_factura: totalFactura.toFixed(2),
        };
      }

      return null;
    })
    .filter(Boolean);

  const filterBySearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditFactura = (factura) => {
    setSelectedFactura(factura);
    setEditedFactura({ ...factura });
    setEditFacturaDialogOpen(true);
  };

  const handleDeleteFactura = (factura) => {
    setSelectedFactura(factura);
    setDeleteFacturaDialogOpen(true);
  };

  const editFactura = async () => {
    try {
      // Implementa la lógica para editar la factura utilizando editedFactura y la API correspondiente
      const response = await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/cartera/${selectedFactura.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedFactura),
      });
  
      if (response.ok) {
        // Actualiza el estado o realiza otras acciones necesarias después de la edición
        console.log("Factura editada correctamente");
        setEditFacturaDialogOpen(false);
        // Puedes recargar los datos para reflejar los cambios
        fetchData();
      } else {
        console.error("Error al editar la factura");
      }
    } catch (error) {
      console.error("Error en la solicitud de edición", error);
    }
  };
  
  const deleteFactura = async () => {
    try {
      // Implementa la lógica para eliminar la factura utilizando selectedFactura.id y la API correspondiente
      const response = await fetch(`https://diplomadobd-06369030a7e4.herokuapp.com/cartera//${selectedFactura.id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Actualiza el estado o realiza otras acciones necesarias después de la eliminación
        console.log("Factura eliminada correctamente");
        setDeleteFacturaDialogOpen(false);
        // Puedes recargar los datos para reflejar los cambios
        fetchData();
      } else {
        console.error("Error al eliminar la factura");
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación", error);
    }
  };
  
  const addNewFactura = async () => {
    try {
      // Implementa la lógica para agregar una nueva factura utilizando newFactura y la API correspondiente
      const response = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/cartera/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFactura),
      });
  
      if (response.ok) {
        // Actualiza el estado o realiza otras acciones necesarias después de la adición
        console.log("Nueva factura agregada correctamente");
        setNewFacturaDialogOpen(false);
        // Puedes recargar los datos para reflejar los cambios
        fetchData();
      } else {
        console.error("Error al agregar la nueva factura");
      }
    } catch (error) {
      console.error("Error en la solicitud de nueva factura", error);
    }
  };
  

  return (
    <DashboardLayout>
       <DashboardNavbar />
      <SoftTypography variant="body1" style={{ paddingLeft: '2px', paddingTop: '0px', fontSize: '19px' }}>
        Buscar
      </SoftTypography>
      <TextField
        label=""
        variant="filled"
        color="secondary"
        value={searchTerm}
        onChange={filterBySearchTerm}
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
      <SoftBox mb={3}>
        
        <Card>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <SoftTypography variant="h6">TABLA FACTURAS DE COMPRA</SoftTypography>
            <IconButton onClick={() => setNewFacturaDialogOpen(true)} color="primary">
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
            <Table
              columns={[
                { name: "proveedor", align: "center" },
                { name: "cantidad_producto", align: "center" },
                { name: "precio_unitario", align: "center" },
                { name: "fecha_facturacion", align: "center" },
                { name: "total_factura", align: "center" },
                { name: "acciones", align: "center" }, // Agrega columna para acciones
              ]}
              rows={tablaData.map((factura) => ({
                ...factura,
                acciones: (
                  <div>
                    <IconButton onClick={() => handleEditFactura(factura)} color="info">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteFactura(factura)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ),
              }))}
            />
          </SoftBox>
        </Card>
      </SoftBox>

      <Dialog open={deleteFacturaDialogOpen} onClose={() => setDeleteFacturaDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar la factura?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteFacturaDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteFactura} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editFacturaDialogOpen} onClose={() => setEditFacturaDialogOpen(false)}>
        {/* Agregar contenido del diálogo de edición similar al de lotes */}
      </Dialog>

      <Dialog open={newFacturaDialogOpen} onClose={() => setNewFacturaDialogOpen(false)}>
        {/* Agregar contenido del diálogo de nueva factura similar al de lotes */}
      </Dialog>
    </DashboardLayout>
  );
}

export default Tabla_FacturasCompra;
