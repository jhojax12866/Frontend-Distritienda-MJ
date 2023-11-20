

import { useMemo } from "react";


import PropTypes from "prop-types";


import { Radar } from "react-chartjs-2";


import Card from "@mui/material/Card";


import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";


import configs from "examples/Charts/RadarChart/configs";


import colors from "assets/theme/base/colors";


import rgba from "assets/theme/functions/rgba";

function RadarChart({ title, description, chart }) {
  const chartDatasets = chart.datasets
    ? chart.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: colors[dataset.color]
          ? rgba(colors[dataset.color || "dark"].main, 0.2)
          : rgba(colors.dark.main, 0.2),
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
          <SoftBox p={6}>
            <Radar data={data} options={options} />
          </SoftBox>
        ),
        [chart]
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}


RadarChart.defaultProps = {
  title: "",
  description: "",
};


RadarChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  chart: PropTypes.objectOf(PropTypes.array).isRequired,
};

export default RadarChart;
