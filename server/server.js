require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");

const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "JWT SECRET";

const CORSallowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: CORSallowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600 * 1000,
  });

  res.json({ message: "Login successful" });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

app.get("/profile", authenticateUser, async (req, res) => {
  const user = await prisma.user.findUnique({
    select: {
      email: true,
      name: true,
    },
    where: {
      id: req.userId,
    },
  });

  res.json(user);
});

app.get("/api/mf-holdings", async (req, res) => {
  res.json({
    pan: req.query.pan,
    holdings: [
      {
        fund_name: "Axis Bluechip Fund",
        category: "Equity - Large Cap",
        current_value: 150000,
        units: 120.5,
        nav: 1245.8,
      },
      {
        fund_name: "HDFC Short Term Debt Fund",
        category: "Debt - Short Duration",
        current_value: 50000,
        units: 300.75,
        nav: 166.2,
      },
      {
        fund_name: "Mirae Asset Emerging Bluechip",
        category: "Equity - Mid Cap",
        current_value: 200000,
        units: 250.25,
        nav: 799.3,
      },
    ],
    total_value: 400000,
    last_updated: "2025-02-06T10:15:00Z",
  });
});

app.post("/eligibility", authenticateUser, async (req, res) => {
  const { pan } = req.body;

  const holdings = await axios.get(`http://localhost:${PORT}/api/mf-holdings`, {
    params: {
      pan,
    },
  });

  await prisma.holdings.create({
    data: {
      pan,
      fundDetails: holdings.data.holdings,
      value: holdings.data.total_value,
      user: {
        connect: {
          id: req.userId,
        },
      },
    },
  });

  const eligibleAmount = holdings.data.total_value * 0.5;

  const eligibilityCheck = await prisma.eligibilityChecks.create({
    data: {
      eligibleAmount: eligibleAmount,
      user: {
        connect: {
          id: req.userId,
        },
      },
    },
  });

  res.json({
    eligibleAmount: eligibilityCheck.eligibleAmount,
  });
});

app.get("/history", authenticateUser, async (req, res) => {
  const history = await prisma.eligibilityChecks.findMany({
    select: {
      date: true,
      eligibleAmount: true,
    },
    where: {
      userId: req.userId,
    },
  });

  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
