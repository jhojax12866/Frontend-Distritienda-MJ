import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";

function SignUp() {
  const [agreement, setAgreement] = useState(true);
  const [error, setError] = useState(null);
  //TOKEN
  const accessToken = localStorage.getItem("accessToken");

  const handleSignUp = async () => {
    // Get form data from the input fields
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const first_name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    // Create formData object
    const formData = {
      username: username,
      email: email,
      first_name: first_name,
      password: password,
    };

    try {
      const response = await fetch("https://simplificado-48e1a3e2d000.herokuapp.com/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Usuario registrado exitosamente!");
      } else {
        const errorData = await response.json();
        console.error("Error al registrar usuario:", errorData);
        setError("Error al registrar usuario. Verifica los datos e intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      setError("Error de red. Intenta de nuevo más tarde.");
    }
  };

  useEffect(() => {
    // ... any other code you want to run on component mount ...
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  const handleSetAgreement = () => setAgreement(!agreement);

  return (
    <BasicLayout title="BIENVENIDO" description="REGISTRATE AQUI" image={curved6}>
      <Card>
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <SoftInput id="username" placeholder="Name" />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput id="email" type="email" placeholder="Email" />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput id="name" placeholder="First Name" />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput id="password" type="password" placeholder="Password" />
            </SoftBox>
            <SoftBox display="flex" alignItems="center">
              <Checkbox checked={agreement} onChange={handleSetAgreement} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={handleSetAgreement}
                sx={{ cursor: "pointer", userSelect: "none" }}
              >
                &nbsp;&nbsp;Estoy de acuerdo con los&nbsp;
              </SoftTypography>
              <SoftTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                textGradient
              >
                términos y condiciones.
              </SoftTypography>
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth onClick={handleSignUp}>
                Registrate
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Ya tienes registrada una cuenta?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Inicia sesión aquí
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
