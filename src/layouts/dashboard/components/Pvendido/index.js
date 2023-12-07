import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Pvendido() {
  const [lowestStockProduct, setLowestStockProduct] = useState(null);

  useEffect(() => {
    fetch("https://diplomadobd-06369030a7e4.herokuapp.com/stock/")
      .then((response) => response.json())
      .then((stockData) => {
        console.log('Stock Data:', stockData);
  
        fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/")
          .then((response) => response.json())
          .then((productosData) => {
            console.log('Productos Data:', productosData);
  
            const productWithLowestStock = stockData.reduce(
              (minProduct, currentProduct) => {
                const productInfo = productosData.find(
                  (producto) => producto.id === currentProduct.producto_stock
                );
  
                if (
                  productInfo &&
                  currentProduct.cantidad < minProduct.cantidad
                ) {
                  return {
                    ...currentProduct,
                    producto_nombre: productInfo.nombre,
                    producto_imagen: productInfo.imagen,
                    producto_lote: currentProduct.lote_stock,
                    producto_cantidad: currentProduct.cantidad,
                  };
                }
                return minProduct;
              },
              stockData[0]
            );
  
            console.log('Product with lowest stock:', productWithLowestStock);
            setLowestStockProduct(productWithLowestStock);
          })
          .catch((error) => {
            console.error("Error fetching productos data:", error);
            setLowestStockProduct(null); // Manejo de error: establecer lowestStockProduct en null
          });
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
        setLowestStockProduct(null); // Manejo de error: establecer lowestStockProduct en null
      });
  }, []);

  return (
    <Card>
      <SoftBox p={2}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <SoftBox display="flex" flexDirection="column" height="100%">
              <SoftBox pt={1} mb={0.5}>
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  PRODUCTO CON MENOS CANTIDAD
                </SoftTypography>
    
              </SoftBox>
              <SoftBox mb={1}>
                <SoftTypography variant="body2" color="text">
                  Cantidad: {lowestStockProduct ? lowestStockProduct.cantidad : "N/A"}
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={1}>
                <SoftTypography variant="body2" color="text">
                  Lote: {lowestStockProduct ? lowestStockProduct.lote_stock : "N/A"}
                </SoftTypography>
                <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                  producto: {lowestStockProduct ? lowestStockProduct.producto_nombre : "N/A"}
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </Grid>
          <Grid item xs={12} lg={5} sx={{ position: "relative", ml: "auto" }}>
            <SoftBox
              height="100%"
              display="grid"
              justifyContent="center"
              alignItems="center"
              bgColor="info"
              borderRadius="lg"
              variant="gradient"
            >
             
                <SoftBox
                  component="img"
                  src={lowestStockProduct ? lowestStockProduct.producto_imagen : ""}
                  alt="producto"
                  width="100%"
                  pt={3}
                />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default Pvendido;