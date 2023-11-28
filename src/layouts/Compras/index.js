import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import { TextField } from "@mui/material";

function Tabla_FacturasCompra() {
  const [facturasCompra, setFacturasCompra] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalleCompraData, setDetalleCompraData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFacturaCompra = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/factura_compra/");
        const dataFacturaCompra = await responseFacturaCompra.json();
        console.log("Facturas de Compra:", dataFacturaCompra); 
        setFacturasCompra(dataFacturaCompra);
  
        const responseProveedores = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/personas/");
        const dataProveedores = await responseProveedores.json();
        console.log("Proveedores:", dataProveedores); 
        setProveedores(dataProveedores);
  
        const responseProductos = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/");
        const dataProductos = await responseProductos.json();
        console.log("Productos:", dataProductos); 
        setProductos(dataProductos);
  
     
        const responseDetalleCompra = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/detalle_compra/");
        const dataDetalleCompra = await responseDetalleCompra.json();
        console.log("Detalle de Compra:", dataDetalleCompra); 
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
  .filter((factura) => factura.estado_pago && factura.estado_pago.toLowerCase().includes(searchTerm.toLowerCase()))
  .map((factura) => {
    const proveedorNombre = getNombreProveedorById(factura.proveedor);
    const detalleCompraInfo = detalleCompraData.find((detalle) => detalle.factura_compra === factura.id);

    if (proveedorNombre && detalleCompraInfo) {
      const producto = productos.find((prod) => prod.id === detalleCompraInfo.producto);
      const cantidadProducto = detalleCompraInfo.cantidad;
      const precioUnitario = detalleCompraInfo.precio_unitario;
      const fechaFacturacion = factura.fecha_facturacion;
      const totalFactura = cantidadProducto * precioUnitario;

      return {
        proveedor: proveedorNombre,
        producto: producto ? producto.nombre : "N/A",
        cantidad_producto: cantidadProducto,
        precio_unitario: precioUnitario,
        fecha_facturacion: fechaFacturacion,
        total_factura: totalFactura,
      };
    }

    
    return null;
  })
  .filter(Boolean); 


  const filterBySearchTerm = (event) => {
    setSearchTerm(event.target.value);
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
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">TABLA FACTURAS DE COMPRA</SoftTypography>
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
                  { name: "producto", align: "center" },
                  { name: "cantidad_producto", align: "center" },
                  { name: "precio_unitario", align: "center" },
                  { name: "fecha_facturacion", align: "center" },
                  { name: "total_factura", align: "center" },
                ]}
                rows={tablaData}
              />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tabla_FacturasCompra;
