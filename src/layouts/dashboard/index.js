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
  const [leastSoldProduct, setLeastSoldProduct] = useState(null);

  const { chart, items } = reportsBarChartData;
  useEffect(() => {
    // Obtener productos
    axios.get('https://simplificado-48e1a3e2d000.herokuapp.com/productos/')
    .then(response => {
      console.log('Productos recibidos:', response.data);
      setProducts(response.data);
      
      const leastSold = response.data.reduce((minProduct, product) => {
        return product.ventas < minProduct.ventas ? product : minProduct;
      }, response.data[0]);

      setLeastSoldProduct(leastSold);
    })
    .catch(error => {
      console.error('Error al obtener productos:', error);
    });

  // ... existing code ...
}, []);

  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <SoftBox py={3}>
        <SoftBox mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={15}>
            <Productcard />
          </Grid>
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
        
        
      </SoftBox>
      
    </DashboardLayout>
  );
}

export default Dashboard;
