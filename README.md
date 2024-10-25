# **Jersey Dashboard API**

This project provides a **dashboard and API** for managing jersey orders, built with **Node.js**, **Express**, and **Prisma ORM**, with an **AdminJS** interface for managing resources.

---

## **Getting Started**

Follow these steps to set up the project and database locally.

---

### **Prerequisites**

1. **Node.js** (v18+)
2. **MySQL** or **phpMyAdmin** / **Laragon** installed
3. **Git** installed

---

### **Installation Steps**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Moontaz/db_jersey.git
   cd db_jersey
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up the Database**
   - **Import the provided SQL dump** (`db_jersey.sql`) into your local MySQL instance.
   - Here’s how you can import the file:

---

### **Importing Database Using phpMyAdmin**

1. Open **phpMyAdmin** in your browser (usually at http://localhost/phpmyadmin).
2. Log in with your MySQL credentials.
3. Click **Databases** > Create a database named **`db_jersey`**.
4. After creating the database, go to the **`Import`** tab.
5. Click **Choose File** and select the **`db_jersey.sql`** file.
6. Click **Go** to import the database.

---

### **Importing Database Using Laragon**

1. Open **Laragon** and make sure MySQL is running.
2. Open **phpMyAdmin** or connect via **HeidiSQL**.
3. Create a new database named **`db_jersey`**.
4. Import the **`db_jersey.sql`** file:
   - In phpMyAdmin: Use the **Import** tab as mentioned above.
   - In HeidiSQL: Use **Tools > Import SQL File**.

---

### **Generating Prisma Client**

After importing the SQL data, pull the latest schema using **Prisma** and generate the Prisma client:

```bash
npx prisma db pull
npx prisma generate
```

---

### **Running the Server**

1. **Start the API Server**

   ```bash
   node app.js
   ```

2. **Access the Admin Dashboard**
   - Open your browser and go to:
     ```
     http://localhost:3000/admin
     ```
   - Login Credentials:
     - **Email**: `admin@example.com`
     - **Password**: `12345`

---

### **Project Structure**

```
db_jersey/
│
├── .adminjs/              # AdminJS settings
├── config/                # Logger and configuration files
├── controllers/           # Route handlers
├── logs/                  # Log files
├── middleware/            # Middleware logic
├── node_modules/          # Dependencies
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma      # Prisma schema definition
│   └── migrations/        # Database migration files
├── .env                   # Environment variables
├── app.js                 # Main server file
├── package.json           # NPM dependencies
└── README.md              # Project documentation
```

---

### **Troubleshooting**

- **Database Import Issues**:

  - Ensure the database name in your **`.env`** file matches the one you created.
  - If import fails, ensure MySQL is running and you have the correct permissions.

- **Prisma Issues**:  
  Run `npx prisma generate` if Prisma client isn’t working.

- **Port Conflicts**:  
  Make sure **port 6000** isn’t being used by another process.
