// src/pages/History.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Snackbar,
  Box
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function History() {
  const { getHistory } = useAuth(); // ✅ Using new hook
  const [meetings, setMeetings] = useState([]);
  const [snack, setSnack] = useState({ open: false, msg: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistory();
        setMeetings(history);
      } catch (err) {
        setSnack({
          open: true,
          msg: "Failed to fetch meeting history"
        });
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Back to Home */}
      <IconButton onClick={() => navigate("/home")} sx={{ mb: 2 }}>
        <HomeIcon />
      </IconButton>

      {/* Meeting Cards */}
      {meetings.length > 0 ? (
        meetings.map((meeting, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Code: {meeting.meetingCode}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Date: {formatDate(meeting.date)}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
          No meeting history found.
        </Typography>
      )}

      {/* Snackbar for errors */}
      <Snackbar
        open={snack.open}
        onClose={() => setSnack({ ...snack, open: false })}
        autoHideDuration={4000}
        message={snack.msg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
