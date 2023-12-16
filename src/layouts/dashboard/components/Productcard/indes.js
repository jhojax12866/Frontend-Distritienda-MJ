import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Productcard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/productos/").then((res) => res.json());
        setProducts(productosResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
          <Card>
            <SoftBox display="flex">
              <SoftBox p={2} flexBasis="70%">
                <SoftTypography variant="h6" gutterBottom>
                  {product.nombre}
                </SoftTypography>
                <SoftBox mb={1}>
                  <SoftTypography variant="body2" color="text">
                    Precio: {product.precio}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
              <SoftBox flexBasis="30%">
                <SoftBox
                  component="img"
                  src={product.imagen}
                  alt={product.nombre}
                  width="100%"
                  style={{ borderRadius: "4px" /* Adjust the border radius as needed */ }}
                />
              </SoftBox>
            </SoftBox>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Productcard;
