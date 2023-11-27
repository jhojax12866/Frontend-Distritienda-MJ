import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import wavesWhite from "assets/images/shapes/waves-white.svg";
import rocketWhite from "assets/images/illustrations/rocket-white.png";

function Pvendido() {
  const [lowestStockProduct, setLowestStockProduct] = useState(null);

  useEffect(() => {
    // Fetch data from the /stock/ endpoint
    fetch("https://diplomadobd-06369030a7e4.herokuapp.com/stock/")
      .then((response) => response.json())
      .then((stockData) => {
        // Fetch data from the /productos/ endpoint
        fetch("https://diplomadobd-06369030a7e4.herokuapp.com/productos/")
          .then((response) => response.json())
          .then((productosData) => {
            // Combine data from stock and productos to find the product with the lowest stock
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
                  };
                }
                return minProduct;
              },
              stockData[0]
            );

            setLowestStockProduct(productWithLowestStock);
          })
          .catch((error) =>
            console.error("Error fetching productos data:", error)
          );
      })
      .catch((error) => console.error("Error fetching stock data:", error));
  }, []);

  return (
    <Card>
      <SoftBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SoftBox display="flex" flexDirection="column" height="100%">
              <SoftBox pt={1} mb={0.5}>
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  PRODUCTO CON MENOS CANTIDAD
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                {lowestStockProduct ? lowestStockProduct.producto_nombre : "Producto sin stock"}
              </SoftTypography>
              <SoftBox mb={1}>
                <SoftTypography variant="body2" color="text">
                  Cantidad: {lowestStockProduct ? lowestStockProduct.cantidad : "N/A"}
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={6}>
                <SoftTypography variant="body2" color="text">
                  Lote: {lowestStockProduct ? lowestStockProduct.lote_stock : "N/A"}
                </SoftTypography>
              </SoftBox>
              <SoftTypography
                component="a"
                href="#"
                variant="button"
                color="text"
                fontWeight="medium"
                sx={{
                  mt: "auto",
                  mr: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "& .material-icons-round": {
                    fontSize: "1.125rem",
                    transform: `translate(2px, -0.5px)`,
                    transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
                  },
                  "&:hover .material-icons-round, &:focus  .material-icons-round": {
                    transform: `translate(6px, -0.5px)`,
                  },
                }}
              >
              
              </SoftTypography>
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
                src={wavesWhite}
                alt="waves"
                display="block"
                position="absolute"
                left={0}
                width="100%"
                height="100%"
              />
              <SoftBox
                component="img"
                src={lowestStockProduct ? lowestStockProduct.producto_imagen : rocketWhite}
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
