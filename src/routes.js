import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";


import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";
import Tabla_Inventario from "layouts/Tabla Inventario";
import Inventario from "layouts/inventario/inventari";
import Tabla_Creditos from "layouts/Tabla Creditos";

const routes = [
  {
    type: "collapse",
    name: "Inicio",
    key: "Inicio",
    route: "/Inicio",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  
  {
    type: "collapse",
    name: "Inventario",
    key: "inventario",
    route: "/inventario",
    icon: <CustomerSupport size="12px" />,
    component: <Inventario />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tabla Inventario",
    key: "tabla_inventario",
    route: "/Tabla Inventario",
    icon: <Office size="12px" />,
    component: <Tabla_Inventario />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tabla Creditos",
    key: "tabla_creditos",
    route: "/Tabla Creditos",
    icon: <Office size="12px" />,
    component: <Tabla_Creditos/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    route: "/tables",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <Billing />,
    noCollapse: true,
  },
  
  
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  

];

export default routes;
