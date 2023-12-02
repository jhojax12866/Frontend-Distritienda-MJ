import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";


import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";


import typography from "assets/theme/base/typography";


import Projects from "layouts/dashboard/components/Projects";


import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import Pvendido from "./components/Pvendido";
import Productcard from "./components/Productcard/indes";



function Dashboard() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  useEffect(() => {
    // Obtener productos
    axios.get('https://diplomadobd-06369030a7e4.herokuapp.com/productos/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });

    // información de stock
    axios.get('https://diplomadobd-06369030a7e4.herokuapp.com/stock/')
      .then(response => {
        // Filtrar productos 
        const productsWithStock = response.data.filter(product => product.cantidad > 0);
        setStock(productsWithStock);
      })
      .catch(error => {
        console.error('Error al obtener información de stock:', error);
      });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
          
            {products.map(product => (
              
              <Grid key={product.id} item xs={12} sm={6} xl={3}>
                <Productcard
                  title={product.nombre} // Cambia esta línea
                  count={product.precio}
                  subcount={`Categoría: ${product.categoria}`}
                  percentage={{ color: "success", text: "+55%" }}
                  icon={{ color: "info", component: "paid" }}
                  image={product.imagen}
/>
              </Grid>
              
            ))}

          </Grid>
        </SoftBox>
        
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <Pvendido />
            </Grid>
            <Grid item xs={12} lg={5}>
              
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <ReportsBarChart
                title="active users"
                description={
                  <>
                    (<strong>+23%</strong>) than last week
                  </>
                }
                chart={chart}
                items={items}
              />
            </Grid>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="Sales Overview"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                      <Icon className="font-bold">arrow_upward</Icon>
                    </SoftBox>
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      4% more{" "}
                      <SoftTypography variant="button" color="text" fontWeight="regular">
                        in 2021
                      </SoftTypography>
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={gradientLineChartData}
              />
            </Grid>
          </Grid>
        </SoftBox>
        
      </SoftBox>
      
    </DashboardLayout>
  );
}

export default Dashboard;
