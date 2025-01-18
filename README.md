# LG Control Server 🚀

The **LG Control Server** is a powerful and intuitive Node.js-based application for managing Liquid Galaxy (LG) systems via SSH. It offers a robust REST API to handle various LG operations, from visualizations to system management.

![Server is Listening](https://github.com/user-attachments/assets/070f5d4d-4691-42f5-9479-cf6752d37edd)


[**View Swagger API Docs**](https://rohit-554.github.io/LgServerSwaggerApi/#/)

---

## 📝 Table of Contents

1. [Getting Started](#getting-started)  
2. [Project Structure](#project-structure)  
3. [How to Run](#how-to-run)  
4. [Adding a New Command](#adding-a-new-command)  
5. [Endpoints](#endpoints)  
6. [License](#license)  
7. [Contributors](#contributors)  

---

## 🚀 Getting Started

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/LiquidGalaxyLAB/lg-server.git
   cd lg-server
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Ngrok Setup Instructions**
   - For executing the commands in the deployed front-end [application](https://yashrajbharti.github.io/lg-web/)
     
### Prerequisites
- A local server running on port 3000

### Installation and Setup
a. **Download and Install ngrok**
   - Navigate to [ngrok downloads](https://download.ngrok.com/downloads/windows)
   - Macos
     
     ```bash
     brew install ngrok
     ```
   - Ubuntu
     
     ```bash
     sudo snap install ngrok
     ```
   
   - Download and extract the ngrok executable to your preferred location (windows)

b. **Launch Tunnel**
   - Open a new terminal window
   - Execute the following command:
     ```bash
     ngrok http 3000
     ```
   - Verify the tunnel is active when you see the forwarding URL in the terminal

c. **Configure Frontend**
   - Copy the HTTPS forwarding URL from the ngrok terminal
     (Example: `https://a1b2c3d4.ngrok.io`)
   - Update your frontend application's configuration with this URL

  - Note
    The ngrok terminal must remain open to maintain the tunnel connection. The free tier will generate a new URL each time you restart ngrok.
---

## 🚧 Project Structure

- **`app.js`**: Entry point of the application.  
- **`server.js`**: Configures middleware, routes, and starts the server.  
- **`routers/`**: Defines API routes.  
- **`controllers/`**: Contains logic to handle API requests.  
- **`services/`**: Implements SSH interactions and reusable logic.

---

## ▶️ How to Run

1. Start the server:

   ```bash
   npm run dev
   ```

2. Verify the server is running by hitting the health check endpoint:

   ```bash
   curl http://localhost:8000/ping
   ```

   **Expected Response**:

   ```json
   { "message": "pong@@" }
   ```

---

## ➕ Adding a New Command

### Step 1: Create a Service Function

1. In the `services/` directory, add a new function:

   ```javascript
   export const newCommandService = async (ip, port, username, password, command) => {  
       const client = new Client();  
       try {  
           await connectSSH(client, { ip, port: parseInt(port, 10), username, password });  
           const result = await executeCommand(client, command);  
           console.log("Command result:", result);  
           return result;  
       } catch (error) {  
           console.error("Error during SSH operations:", error);  
           return { success: false, message: error.message };  
       } finally {  
           client.end();  
       }  
   };  
   ```

### Step 2: Add a Controller Method

1. In `controllers/`, add the logic to handle the new command:

   ```javascript
   newCommand = async (req, res) => {  
       const { ip, port, username, password, command } = req.body;  
       const response = await newCommandService(ip, port, username, password, command);  
       return res.status(200).json(response);  
   };  
   ```

### Step 3: Define the Route

1. Add a route in `routers/index.js`:

   ```javascript
   router.route("/new-command").post(lgConnectionController.newCommand);  
   ```

### Step 4: Test the Endpoint

1. Use `curl` or Postman to test:

   ```bash
   curl -X POST http://localhost:8000/api/new-command \  
   -H "Content-Type: application/json" \  
   -d '{  
       "ip": "192.168.x.x",  
       "port": "22",  
       "username": "your-username",  
       "password": "your-password",  
       "command": "your-command"  
   }'  
   ```

---

## 🌐 Endpoints

### Core Endpoints

| Endpoint                      | Method | Description                      |  
|-------------------------------|--------|----------------------------------|  
| `/ping`                       | GET    | Health check endpoint.           |  
| `/api/execute-orbit`          | POST   | Executes an orbit command.       |  
| `/api/clean-visualization`    | POST   | Cleans LG visualizations.        |  
| `/api/clean-logos`            | POST   | Removes LG logos.                |  
| `/api/relaunch-lg`            | POST   | Relaunches the LG system.        |  
| `/api/reboot-lg`              | POST   | Reboots the LG system.           |  
| `/api/stop-orbit`             | POST   | Stops orbit visualization.       |  
| `/api/clean-balloon`          | POST   | Cleans balloon visualizations.   |  
| `/api/new-command`            | POST   | Executes a custom command.       |  

---

## 📓 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributors

### Contributors

<a href="https://github.com/LiquidGalaxyLAB/lg-server/graphs/contributors">  
  <img src="https://contrib.rocks/image?repo=LiquidGalaxyLAB/lg-server" />  
</a>  

### Backend Developer

The backend is developed by [Lovely Sehotra](https://github.com/LovelySehotra).

### Frontend Designer

Designed by **Mentor Yash**.
