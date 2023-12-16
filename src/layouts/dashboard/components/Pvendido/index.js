import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Pvendido() {
  const [leastSoldProduct, setLeastSoldProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/productos/").then((res) => res.json());

        const leastSoldProduct = productosResponse.reduce((minProduct, currentProduct) => {
          if (currentProduct.cantidad < minProduct.cantidad) {
            return {
              ...currentProduct,
            };
          }
          return minProduct;
        }, productosResponse[0]);

        setLeastSoldProduct(leastSoldProduct);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLeastSoldProduct(null);
        setLoading(false);
      }
    };

    fetchData();
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
                  Cantidad: {leastSoldProduct ? leastSoldProduct.cantidad : "N/A"}
                </SoftTypography>
              </SoftBox>
              <SoftBox mb={1}>
                <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                  Producto: {leastSoldProduct ? leastSoldProduct.nombre : "N/A"}
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
              
              borderRadius="lg"
              variant="gradient"
            >
              <SoftBox
                component="img"
                src={leastSoldProduct ? leastSoldProduct.imagen : ""}
                alt="producto"
                width="100%"
                pt={3}
                style={{ background: "transparent" }}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default Pvendido;
