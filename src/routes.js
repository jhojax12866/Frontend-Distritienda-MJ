import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";

import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";


import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";

import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";

import Inventario from "layouts/inventario/inventari";
import Tabla_Creditos from "layouts/Tabla Creditos";
import Lotes from "layouts/Lotes";
import { Shop2 } from "@mui/icons-material";
import Compras from "layouts/Compras";
import NuevoProducto from "layouts/New Producto";
import New_Producto from "layouts/New Producto";
import Tabla_Ventas from "layouts/tables";
import { Productos } from "datos_api";
import Detalles from "layouts/Detalles/detalles";
import Stock from "layouts/stock/stock";
import Categorias from "layouts/categorias/categorias";

const routes = [
  { type: "title", title: "menu", key: "account-pages" },
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
    icon: <Shop size="12px" />,
    component: <Inventario />,
    noCollapse: true,
  },
  
  {
    type: "collapse",
    name: "Lotes",
    key: "lotes",
    route: "/Lotes",
    icon: <Shop2 size="12px" />,
    component: <Lotes/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Estante",
    key: "stock",
    route: "/Stock",
    icon: <Shop2 size="12px" />,
    component: <Stock/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Categorias",
    key: "categorias",
    route: "/Categorias",
    icon: <Shop2 size="12px" />,
    component: <Categorias/>,
    noCollapse: true,
  },
  
  {
    type: "collapse",
    name: "Creditos",
    key: "tabla_creditos",
    route: "/Tabla Creditos",
    icon: <Shop size="12px" />,
    component: <Tabla_Creditos/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Compras",
    key: "compras",
    route: "/Compras",
    icon: <Shop size="12px" />,
    component: <Compras/>,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Ventas",
    key: "tables",
    route: "/tables",
    icon: <Shop size="12px" />,
    component: <Tabla_Ventas />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Detalles",
    key: "detalles",
    route: "/detalles",
    icon: <Shop size="12px" />,
    component: <Detalles />,
    noCollapse: true,
  },
  
  
  { type: "title", title: "Accesos", key: "account-pages" },
  
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
  
  

];

export default routes;
