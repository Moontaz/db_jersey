# **Jersey Dashboard API**

This project provides a **dashboard and API** for managing jersey orders, built using **Node.js**, **Express**, and **Prisma** ORM with **AdminJS** for a user-friendly admin panel.

---

## **Getting Started**

Follow the instructions below to set up and run the project on your local machine.

---

### **Prerequisites**
1. **Node.js** (v18+)
2. **MySQL** installed locally or a MySQL database connection.
3. **Git** installed.

---

### **Setup Instructions**

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
   - Create a **MySQL database** named `db_jersey`.
   - Update the **`.env`** file with your database credentials:
     ```
     DATABASE_URL="mysql://<user>:<password>@localhost:3306/db_jersey"
     ```

4. **Generate Prisma Client**
   Run the following commands to introspect the database and generate the Prisma client:
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

5. **Run the Application**
   Start the server:
   ```bash
   node app.js
   ```

6. **Access the Admin Dashboard**
   - Open your browser and navigate to:
     ```
     http://localhost:3000/admin
     ```
   - Login using the following credentials:
     - **Email**: `admin@example.com`
     - **Password**: `12345`

---

### **Available Endpoints**
- **Health Check**:  
  `GET /`  
  Returns `running...` to confirm the server is live.

---

### **Troubleshooting**
If you encounter any issues, try the following:
- Make sure MySQL is running and accessible.
- Ensure your `.env` file is configured correctly with the database credentials.
- Run `npx prisma generate` again if any Prisma-related issues occur.

---

That’s it! 🎉 You're now ready to use the **Jersey Dashboard API**.
