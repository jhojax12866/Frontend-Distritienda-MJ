import { useMemo } from "react";


import PropTypes from "prop-types";


import { Line } from "react-chartjs-2";


import Card from "@mui/material/Card";


import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";


import configs from "examples/Charts/LineCharts/DefaultLineChart/configs";


import colors from "assets/theme/base/colors";

function DefaultLineChart({ title, description, height, chart }) {
  const chartDatasets = chart.datasets
    ? chart.datasets.map((dataset) => ({
        ...dataset,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 2,
        pointBackgroundColor: colors[dataset.color]
          ? colors[dataset.color || "dark"].main
          : colors.dark.main,
        borderColor: colors[dataset.color]
          ? colors[dataset.color || "dark"].main
          : colors.dark.main,
        maxBarThickness: 6,
      }))
    : [];

  const { data, options } = configs(chart.labels || [], chartDatasets);

  const renderChart = (
    <SoftBox p={2}>
      {title || description ? (
        <SoftBox px={description ? 1 : 0} pt={description ? 1 : 0}>
          {title && (
            <SoftBox mb={1}>
              <SoftTypography variant="h6">{title}</SoftTypography>
            </SoftBox>
          )}
          <SoftBox mb={2}>
            <SoftTypography component="div" variant="button" fontWeight="regular" color="text">
              {description}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      ) : null}
      {useMemo(
        () => (
          <SoftBox height={height}>
            <Line data={data} options={options} />
          </SoftBox>
        ),
        [chart, height]
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}


DefaultLineChart.defaultProps = {
  title: "",
  description: "",
  height: "19.125rem",
};


DefaultLineChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default DefaultLineChart;
