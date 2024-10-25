const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const logger = require("./config/logger");

const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Configure session for authentication
app.use(
  session({
    secret: "secretbanget",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Middleware to log incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get("/", (req, res) => {
  logger.info("Health check request received.");
  res.send("running...");
});

// AdminJS setup
(async () => {
  try {
    const AdminJS = (await import("adminjs")).default;
    const AdminJSExpress = await import("@adminjs/express");
    const { Resource, Database, getModelByName } = await import(
      "@adminjs/prisma"
    );

    AdminJS.registerAdapter({ Resource, Database });

    // Configure AdminJS resources for db_jersey models
    const adminJs = new AdminJS({
      resources: [
        {
          resource: { model: getModelByName("jenis_layanan"), client: prisma },
          options: { navigation: { name: "Layanan", icon: "MenuBook" } },
        },
        {
          resource: { model: getModelByName("pesanan"), client: prisma },
          options: { navigation: { name: "Pesanan", icon: "ShoppingCart" } },
        },
        {
          resource: { model: getModelByName("jadwal"), client: prisma },
          options: { navigation: { name: "Jadwal", icon: "CalendarToday" } },
        },
        {
          resource: { model: getModelByName("variabel"), client: prisma },
          options: {
            navigation: { name: "Variabel Khusus", icon: "Settings" },
          },
        },
      ],
      rootPath: "/admin",
    });

    // Admin authentication setup
    const ADMIN = {
      email: "admin@example.com",
      password: await bcrypt.hash("12345", 10),
    };

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
      authenticate: async (email, password) => {
        if (
          email === ADMIN.email &&
          (await bcrypt.compare(password, ADMIN.password))
        ) {
          return ADMIN;
        }
        return null;
      },
      cookieName: "adminjs",
      cookiePassword: "session-secret-password",
    });

    // Use AdminJS router
    app.use(adminJs.options.rootPath, adminRouter);

    console.log("AdminJS is running on /admin");
  } catch (error) {
    console.error("Error setting up AdminJS:", error);
  }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jersey Dashboard API running on port ${PORT}`);
  logger.info(`Jersey Dashboard API running on port ${PORT}`);
  console.log(`AdminJS started on http://localhost:${PORT}/admin`);
});
