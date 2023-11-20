import { forwardRef } from "react";


import PropTypes from "prop-types";


import SoftAvatarRoot from "components/SoftAvatar/SoftAvatarRoot";

const SoftAvatar = forwardRef(({ bgColor, size, shadow, ...rest }, ref) => (
  <SoftAvatarRoot ref={ref} ownerState={{ shadow, bgColor, size }} {...rest} />
));


SoftAvatar.defaultProps = {
  bgColor: "transparent",
  size: "md",
  shadow: "none",
};


SoftAvatar.propTypes = {
  bgColor: PropTypes.oneOf([
    "transparent",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"]),
  shadow: PropTypes.oneOf(["none", "xs", "sm", "md", "lg", "xl", "xxl", "inset"]),
};

export default SoftAvatar;
