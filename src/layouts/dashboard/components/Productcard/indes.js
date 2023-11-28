import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Productcard({ title, count, percentage, direction, image }) {
  const bgColor = "white";
  const iconComponent = <Icon fontSize="small">your_icon_here</Icon>;

  const percentageColor = percentage.color || "success";
  const percentageText = String(percentage.text || "");

  return (
    <Card>
      <SoftBox bgColor={bgColor} variant="gradient">
        <SoftBox p={2}>
          <Grid container alignItems="center">
            {direction === "left" && (
              <Grid item>
                <SoftBox
                  variant="gradient"
                  bgColor={bgColor === "white" ? "info" : "white"}
                  color={bgColor === "white" ? "white" : "dark"}
                  width="3rem"
                  height="3rem"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                  {iconComponent}
                </SoftBox>
              </Grid>
            )}
            <Grid item xs={8}>
              <SoftBox ml={direction === "left" ? 2 : 0} lineHeight={1}>
                <SoftTypography
                  variant="button"
                  color={bgColor === "white" ? "text" : "white"}
                  opacity={bgColor === "white" ? 1 : 0.7}
                  textTransform="capitalize"
                  fontWeight="medium"
                >
                  {title}
                </SoftTypography>
                <SoftTypography
                  variant="h5"
                  fontWeight="bold"
                  color={bgColor === "white" ? "dark" : "white"}
                >
                  {count}{" "}
                  <SoftTypography variant="button" color={percentageColor} fontWeight="bold">
                    {percentageText}
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
            </Grid>
            {direction === "right" && (
              <Grid item xs={4}>
                <SoftBox
                  variant="gradient"
                  bgColor={bgColor === "white" ? "info" : "white"}
                  color={bgColor === "white" ? "white" : "dark"}
                  width="3rem"
                  height="3rem"
                  marginLeft="auto"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                  {iconComponent}
                </SoftBox>
              </Grid>
            )}
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

Productcard.defaultProps = {
  title: "",
  count: 0,
  percentage: "",
  direction: "right",
};

Productcard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  direction: PropTypes.oneOf(["right", "left"]),
  image: PropTypes.string.isRequired, // Agregamos esta línea para la imagen
};

export default Productcard;