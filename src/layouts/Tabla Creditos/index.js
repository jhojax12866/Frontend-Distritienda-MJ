import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

const data_creditos = {
  columns: [
    { name: "id", align: "center" },
    { name: "medio_pago", align: "center" },
    { name: "estado_pago", align: "center" },
    { name: "factura_v", align: "center" },
    { name: "factura_c", align: "center" },
  ],
};

function Tabla_Creditos() {
  const { columns } = data_creditos;
  const [creditos, setCreditos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://diplomadobd-06369030a7e4.herokuapp.com/pago/");
        const data = await response.json();
        setCreditos(data);
      } catch (error) {
        console.error("Error al obtener datos de la API de créditos", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">TABLA CREDITOS VALLEJOS</SoftTypography>
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
              <Table columns={columns} rows={creditos} />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tabla_Creditos;
