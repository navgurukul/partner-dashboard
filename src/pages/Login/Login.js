import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import GoogleIcon from "./assets/GoogleIcon";
import GoogleSvg from "./assets/Google.svg";
import login from "./assets/login.svg";
import { Typography, Container, Grid, Stack, Box, Button } from "@mui/material";
import { breakpoints } from "../../theme/constant";
// import useMediaQuery from "@mui/material/useMediaQuery";
import useStyles from "./styles";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

function Login() {
  // const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState(false);
  const classes = useStyles();
  // const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");

  function onSignIn(googleUser) {
    // let profile = googleUser.getBasicProfile();
    let { id_token: idToken } = googleUser.getAuthResponse();
    // console.log("profile.getId()", profile.getId());
    console.log("idToken", idToken);
    sendGoogleUserData(idToken);
  }

  const sendGoogleUserData = (token) => {
    return axios({
      url: `${process.env.REACT_APP_MERAKI_URL}/users/auth/google`,
      method: "post",
      headers: { accept: "application/json", Authorization: token },
      data: { idToken: token, mode: "web" },
    })
      .then((res) => {
        console.log("res", res);
        localStorage.setItem("AUTH", JSON.stringify(res.data));
        axios({
          method: "get",
          url: `${process.env.REACT_APP_MERAKI_URL}/users/me`,
          headers: {
            accept: "application/json",
            Authorization: res.data.token,
          },
        }).then((res) => {
          console.log("Done");
          // navigate("/");
        });
      })
      .catch((err) => {
        setLoginFailed(true);
        console.log("error in google data", err);
      });
  };

  const onGoogleLoginFail = (errorResponse) => {
    // eslint-disable-next-line no-console
    console.log("onGoogle login fail", errorResponse);
  };

  return (
    <Container
      // className={isActive ? classes.resMerakilogin : classes.merakiLogin}
      className={classes.merakiLogin}
      maxWidth="lg"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} ms={6} md={6}>
          <Container maxWidth="md">
            <Typography
              sx={{ pt: { xs: "none", md: 24 } }}
              variant="h4"
              // align={isActive || isActiveIpad ? "center" : "left"}
              align="left"
              // mt={isActive ? 0 : isActiveIpad ? 12 : 0}
              color="textPrimary"
              gutterBottom
            >
              Embark on your learning journey with Meraki
            </Typography>

            {/* {loading ? (
              <Box
                className={
                  isActive || isActiveIpad
                    ? classes.responsiveLoder
                    : classes.Loder
                }
              >
                <Loader />
              </Box>
            ) : ( */}
            {/* <Stack alignItems={isActive || isActiveIpad ? "center" : "left"}> */}
            <Stack alignItems="left">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Log In with Google "
                onSuccess={onSignIn}
                render={(renderProps) => (
                  <>
                    <Button
                      variant="contained"
                      // startIcon={<GoogleIcon />}
                      startIcon={<img src={GoogleSvg} />}
                      onClick={renderProps.onClick}
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        // width: isActive ? "100%" : "max-content",
                        width: "max-content",
                        margin: "10px 0",
                        fontSize: "18px",
                      }}
                    >
                      Log In with Google
                    </Button>
                  </>
                )}
                onFailure={onGoogleLoginFail}
                cookiePolicy={"single_host_origin"}
                // className={isActive ? classes.responsiveGoogleLogin : classes.googleLogin}
                className={classes.googleLogin}
              />
            </Stack>
            {/* )} */}
          </Container>
        </Grid>
        <Grid
          item
          xs={12}
          ms={6}
          md={6}
          sx={{ mb: 5, display: { xs: "none", md: "flex" } }}
        >
          {/* <img src={require("./assets/login.svg")} alt="img" /> */}
          <img src={login} alt="img" />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
