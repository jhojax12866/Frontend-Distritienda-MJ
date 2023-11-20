import { forwardRef, createContext, useContext, useMemo } from "react";


import PropTypes from "prop-types";


import SoftBox from "components/SoftBox";


import SoftPaginationItemRoot from "components/SoftPagination/SoftPaginationItemRoot";


const Context = createContext(null);

const SoftPagination = forwardRef(
  ({ item, variant, color, size, active, children, ...rest }, ref) => {
    const context = item ? useContext(Context) : null;
    const paginationSize = context ? context.size : null;
    const value = useMemo(() => ({ variant, color, size }), [variant, color, size]);

    return (
      <Context.Provider value={value}>
        {item ? (
          <SoftPaginationItemRoot
            {...rest}
            ref={ref}
            variant={active ? context.variant : "outlined"}
            color={active ? context.color : "secondary"}
            iconOnly
            circular
            ownerState={{ variant, active, paginationSize }}
          >
            {children}
          </SoftPaginationItemRoot>
        ) : (
          <SoftBox
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ listStyle: "none" }}
          >
            {children}
          </SoftBox>
        )}
      </Context.Provider>
    );
  }
);


SoftPagination.defaultProps = {
  item: false,
  variant: "gradient",
  color: "info",
  size: "medium",
  active: false,
};


SoftPagination.propTypes = {
  item: PropTypes.bool,
  variant: PropTypes.oneOf(["gradient", "contained"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default SoftPagination;
