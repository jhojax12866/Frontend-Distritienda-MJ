import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved14.jpg";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState(""); // State to store the access token
  const navigate = useNavigate();

  // Check for stored token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = async () => {
    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/apiauth/login/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        const { access } = userData;

        setAccessToken(access);
        localStorage.setItem("accessToken", access); // Store in localStorage

        console.log("Inicio de sesión exitoso", userData);
        navigate("/Inicio");
      } else {
        console.error("Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud", error);
    }
  };

  const handleKeyPress = (event) => {
    // Verificar si la tecla presionada es Enter
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <CoverLayout
      title="BIENVENIDO NUEVAMENTE"
      description="Sistema de gestión de inventario, ventas, compras y créditos"
      image={curved9}
    >
      <SoftBox component="form" role="form">
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Email
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="email"
            placeholder="Email"
            onChange={(e) => setUsername(e.target.value)}
          />
        </SoftBox>
        <SoftBox mb={2}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress} // Añadir el controlador de eventos para Enter
          />
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton
            variant="gradient"
            color="info"
            fullWidth
            onClick={handleSignIn}
          >
            Inicia Sesión
          </SoftButton>
        </SoftBox>
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Aún no estás registrado?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Regístrate
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}export default SignIn;