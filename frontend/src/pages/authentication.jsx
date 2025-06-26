// src/pages/Authentication.jsx
import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Snackbar
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";  

const theme = createTheme();

export default function Authentication() {
  
  const [mode, setMode] = useState("login");      
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  const [snack, setSnack] = useState({ open: false, msg: "", error: false });


  const { login, register } = useAuth();


  const handleSubmit = async () => {
    if (!username || !password || (mode === "register" && !fullName)) {
      return setSnack({ open: true, msg: "Please fill all fields", error: true });
    }

    if (mode === "login") {
      const { ok, msg } = await login(username, password);
      if (!ok) setSnack({ open: true, msg, error: true });
    }

    if (mode === "register") {
      const { ok, msg } = await register(fullName, username, password);
      if (ok) {
        setSnack({ open: true, msg, error: false });
        setMode("login");
        setFullName("");
        setUsername("");
        setPassword("");
      } else {
        setSnack({ open: true, msg, error: true });
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        {/*  Left wallpaper  */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        {/*  Right auth card  */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            {/*  Mode toggle buttons  */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant={mode === "login" ? "contained" : "text"}
                onClick={() => setMode("login")}
              >
                Sign In
              </Button>
              <Button
                variant={mode === "register" ? "contained" : "text"}
                onClick={() => setMode("register")}
              >
                Sign Up
              </Button>
            </Box>

            {/*  Form  */}
            <Box sx={{ mt: 1, width: "100%" }}>
              {mode === "register" && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                {mode === "login" ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/*  Snackbar for success / error  */}
      <Snackbar
        open={snack.open}
        onClose={() => setSnack({ ...snack, open: false })}
        autoHideDuration={4000}
        message={snack.msg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { bgcolor: snack.error ? "error.main" : "success.main" }
        }}
      />
    </ThemeProvider>
  );
}
