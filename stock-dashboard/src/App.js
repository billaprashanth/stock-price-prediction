import React, { useState } from "react";
import './App.css';
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Tooltip as MUITooltip,
} from "@mui/material";
import {
  LightMode,
  DarkMode,
  ShowChart,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import clsx from "clsx";
import logo from "./assets/Prashanth-Logo-2.png";

// User-friendly features with explanations!
const FEATURE_COLS = [
  {
    name: "Close",
    label: "Previous Day Close Price",
    desc: "The closing price of the previous trading day.",
  },
  {
    name: "SMA_7",
    label: "7-Day Simple Moving Average",
    desc: "Average closing price over the last 7 days.",
  },
  {
    name: "SMA_21",
    label: "21-Day Simple Moving Average",
    desc: "Average closing price over the last 21 days.",
  },
  {
    name: "EMA_7",
    label: "7-Day Exponential Moving Average",
    desc: "Weighted average of last 7 days' closing prices (more weight on recent days).",
  },
  {
    name: "EMA_21",
    label: "21-Day Exponential Moving Average",
    desc: "Weighted average of last 21 days' closing prices (more weight on recent days).",
  },
  {
    name: "Return",
    label: "Previous Day Return (%)",
    desc: "Percentage change in price from the previous day.",
  },
  {
    name: "Volatility_7",
    label: "7-Day Price Volatility",
    desc: "Standard deviation of returns over the last 7 days.",
  },
  {
    name: "Volatility_21",
    label: "21-Day Price Volatility",
    desc: "Standard deviation of returns over the last 21 days.",
  },
  {
    name: "Lag_1",
    label: "1-Day Lag Close Price",
    desc: "Closing price from one day ago.",
  },
  {
    name: "Lag_2",
    label: "2-Day Lag Close Price",
    desc: "Closing price from two days ago.",
  },
];

function App() {
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    const API_URL = "https://stock-price-prediction-7hkj.onrender.com/predict"; // "http://127.0.0.1:5000/predict"
    const payload = {};
    FEATURE_COLS.forEach((f) => (payload[f.name] = Number(inputs[f.name])));
    try {
      const res = await axios.post(API_URL, payload);
      setPrediction(res.data.predicted_close);
      setHistory([
        ...history,
        { ...inputs, predicted_close: res.data.predicted_close },
      ]);
    } catch (error) {
      alert("Prediction failed: " + error);
    }
  };

  // Toggle dark/light mode
  const handleThemeChange = () => setDarkMode(!darkMode);

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-blue-900 to-black"
    : "bg-gradient-to-br from-white via-blue-100 to-gray-100";

  return (
    <div className={clsx("min-h-screen", bgGradient, "pb-16")}>
      <AppBar
        position="static"
        color={darkMode ? "default" : "primary"}
        sx={{
          borderRadius: "0 0 30px 30px",
          boxShadow: 3,
          mb: 4,
          background: darkMode ? "#182848" : "#3a7bd5",
        }}
      >
        <Toolbar>
          <img
            src={logo}
            className="logo"
            alt="Brand Logo"
            style={{ height: 50, marginRight: 20 }}
          />
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              color: "#fff",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            Stock Price Prediction Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleThemeChange}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Card
        className="mx-auto w-full max-w-3xl rounded-2xl shadow-2xl"
        sx={{ background: darkMode ? "#1a2238" : "#fff", mt: 4 }}
      >
        <CardContent>
          <Typography
            variant="h6"
            color={darkMode ? "#fff" : "#333"}
            className="mb-2 flex items-center"
          >
            <ShowChart sx={{ mr: 1, color: "#3a7bd5" }} />
            Enter Feature Values
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURE_COLS.map((feat) => (
              <div key={feat.name}>
                <MUITooltip title={feat.desc} placement="top" arrow>
                  <input
                    type="number"
                    name={feat.name}
                    value={inputs[feat.name] || ""}
                    onChange={handleChange}
                    className={clsx(
                      "w-full rounded-xl px-3 py-2 bg-gray-200 focus:bg-white outline-none mb-1",
                      darkMode &&
                        "bg-gray-800 text-white focus:bg-gray-900 border-none"
                    )}
                    required
                    placeholder={feat.label}
                  />
                </MUITooltip>
                <span className="text-xs text-gray-400 pl-1">{feat.desc}</span>
              </div>
            ))}
          </div>
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 4,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              boxShadow: 2,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #3a7bd5, #00d2ff)",
              color: "#fff",
            }}
            fullWidth
            onClick={handlePredict}
          >
            Predict Close Price
          </Button>
        </CardContent>
      </Card>

      {/* Predicted Result Card */}
      {prediction !== null && (
        <Card
          className="mx-auto mt-8 max-w-xl rounded-2xl shadow-xl"
          sx={{ background: darkMode ? "#3a7bd5" : "#fff" }}
        >
          <CardContent>
            <Typography variant="h5" color={darkMode ? "#fff" : "#333"}>
              Predicted Close Price
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: darkMode ? "#fff" : "#3a7bd5", mt: 1 }}
            >
              {prediction.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Prediction History Line Chart */}
      {history.length > 0 && (
        <Card
          className="mx-auto mt-8 max-w-4xl rounded-2xl shadow-lg"
          sx={{ background: darkMode ? "#232d45" : "#fff" }}
        >
          <CardContent>
            <Typography
              variant="h6"
              color={darkMode ? "#fff" : "#333"}
              className="mb-3"
            >
              Prediction History
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="Close"
                  label={{
                    value: "Close",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="predicted_close"
                  stroke="#3a7bd5"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Footer Branding */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          py: 2,
          background: darkMode ? "#111d2b" : "#e9ecef",
        }}
      >
        <Typography
          align="center"
          color={darkMode ? "#8ecae6" : "#3a7bd5"}
          fontSize="1rem"
        >
          &copy; {new Date().getFullYear()} | Powered
          by Prashanth Billa
        </Typography>
      </Box>
    </div>
  );
}

export default App;
