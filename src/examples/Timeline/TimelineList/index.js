
import PropTypes from "prop-types";


import Card from "@mui/material/Card";


import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";


import { TimelineProvider } from "examples/Timeline/context";

function TimelineList({ title, dark, children }) {
  return (
    <TimelineProvider value={dark}>
      <Card>
        <SoftBox bgColor={dark ? "dark" : "white"} variant="gradient">
          <SoftBox pt={3} px={3}>
            <SoftTypography variant="h6" fontWeight="medium" color={dark ? "white" : "dark"}>
              {title}
            </SoftTypography>
          </SoftBox>
          <SoftBox p={2}>{children}</SoftBox>
        </SoftBox>
      </Card>
    </TimelineProvider>
  );
}


TimelineList.defaultProps = {
  dark: false,
};


TimelineList.propTypes = {
  title: PropTypes.string.isRequired,
  dark: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default TimelineList;
