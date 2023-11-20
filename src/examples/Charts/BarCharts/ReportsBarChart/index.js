import { useMemo } from "react";


import PropTypes from "prop-types";


import { Bar } from "react-chartjs-2";


import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";


import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";


import BarReportsChartItem from "examples/Charts/BarCharts/ReportsBarChart/ReportsBarChartItem";


import configs from "examples/Charts/BarCharts/ReportsBarChart/configs";

function ReportsBarChart({ color, title, description, chart, items }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

  const renderItems = items.map(({ icon, label, progress }) => (
    <Grid item xs={6} sm={3} key={label}>
      <BarReportsChartItem
        color={color}
        icon={{ color: icon.color, component: icon.component }}
        label={label}
        progress={{ content: progress.content, percentage: progress.percentage }}
      />
    </Grid>
  ));

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox padding="1rem">
        {useMemo(
          () => (
            <SoftBox
              variant="gradient"
              bgColor={color}
              borderRadius="lg"
              py={2}
              pr={0.5}
              mb={3}
              height="12.5rem"
            >
              <Bar data={data} options={options} />
            </SoftBox>
          ),
          [chart, color]
        )}
        <SoftBox px={1}>
          <SoftBox mb={2}>
            <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
              {title}
            </SoftTypography>
            <SoftTypography component="div" variant="button" color="text" fontWeight="regular">
              {description}
            </SoftTypography>
          </SoftBox>
          <SoftBox py={1} px={0.5}>
            <Grid container spacing={2}>
              {renderItems}
            </Grid>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}


ReportsBarChart.defaultProps = {
  color: "dark",
  description: "",
  items: [],
};


ReportsBarChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
};

export default ReportsBarChart;
