import { useEffect, useState } from "react";


import { useLocation } from "react-router-dom";


import PropTypes from "prop-types";


import SoftBox from "components/SoftBox";


import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Sidenav from "examples/Sidenav";

import { useSoftUIController, setMiniSidenav, setLayout, setTransparentSidenav } from "context";


import routes from "routes";


import {
  baseLayout,
  baseLayoutBackground,
  baseLayoutContent,
} from "layouts/virtual-reality/components/BaseLayout/styles";


import brand from "assets/images/logo-ct.png";

function BaseLayout({ children }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  
  useEffect(() => {
    setLayout(dispatch, "vr");
    setTransparentSidenav(dispatch, false);
  }, [pathname]);

  return (
    <SoftBox sx={baseLayout}>
      <SoftBox mt={3} mx={3}>
        <DashboardNavbar />
      </SoftBox>
      <SoftBox sx={baseLayoutBackground}>
        <SoftBox display={{ xs: "block", lg: "none" }}>
          <Sidenav
            brand={brand}
            brandName="Soft UI Dashboard PRO"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </SoftBox>
        <SoftBox sx={baseLayoutContent}>
          <SoftBox display={{ xs: "none", lg: "block" }}>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="Soft UI Dashboard PRO"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
          </SoftBox>
          <DashboardLayout>{children}</DashboardLayout>
        </SoftBox>
      </SoftBox>
      <SoftBox pb={2} pt={0.25}>
        <Footer />
      </SoftBox>
    </SoftBox>
  );
}

// Typechecking props for the BaseLayout
BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BaseLayout;
