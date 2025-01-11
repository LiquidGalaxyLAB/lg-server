

# LG Control Server

The **LG Control Server** is a Node.js-based application designed to control and manage Liquid Galaxy (LG) systems via SSH. It provides an easy-to-use REST API for executing LG-related commands such as managing orbit visualizations, cleaning resources, and rebooting rigs.

- [**Read Swagger Docs**](https://rohit-554.github.io/LgServerSwaggerApi/#/)

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [How to Run](#how-to-run)
4. [Adding a New Command](#adding-a-new-command)
5. [Endpoints](#endpoints)
6. [License](#license)

---

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LovelySehotra/lgserver-experimental.git
   cd lgserver-experimental
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

---

## Project Structure

- **`app.js`**: Main server entry point.
- **`server.js`**: Sets up routes, middleware, and starts the application.
- **`routers`**: Contains API route definitions.
- **`controllers`**: Includes logic to process incoming API requests.
- **`services`**: Handles core SSH interactions and reusable logic.
---

## How to Run

1. Start the server:
   ```bash
   node server.js
   ```
   or
    ```bash
   npm run dev
   ```

2. Verify the server is running by hitting the health check endpoint:
   ```bash
   curl http://localhost:8000/ping
   ```

   **Expected Response:**
   ```json
   { "message": "pong@@" }
   ```

---

## Adding a New Command

Follow these steps to add a new command to the application:

### Step 1: Create a Service Function
1. Navigate to `services`.
2. Add a new service function:
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
1. Navigate to `controllers`.
2. Add a new method in `LgConnectionController`:
   ```javascript
   newCommand = async (req, res) => {
       const { ip, port, username, password, command } = req.body;
       const response = await newCommandService(ip, port, username, password, command);
       return res.status(200).json(response);
   };
   ```

### Step 3: Define the Route
1. Navigate to `routers/index.js`.
2. Add a route for the new command:
   ```javascript
   router.route("/new-command").post(lgConnectionController.newCommand);
   ```

### Step 4: Test the New Endpoint
Use `Postman` or `curl` to test the new endpoint:
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

## Endpoints

### Health Check
- **Endpoint**: `/ping`
- **Method**: GET
- **Response**:
  ```json
  { "message": "pong@@" }
  ```

### Command Endpoints

| Endpoint                      | Method | Description                      |
|-------------------------------|--------|----------------------------------|
| `/api/execute-orbit`          | POST   | Executes an orbit command.       |
| `/api/clean-visualization`    | POST   | Cleans the LG visualization.     |
| `/api/clean-logos`            | POST   | Removes LG logos.                |
| `/api/relaunch-lg`            | POST   | Relaunches the LG system.        |
| `/api/reboot-lg`              | POST   | Reboots the LG system.           |
| `/api/stop-orbit`             | POST   | Stops the orbit process.         |
| `/api/clean-balloon`          | POST   | Cleans up balloon visualizations.|
| `/api/new-command`            | POST   | Executes a custom command.       |

---


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.


## Contributor

This projected is contributed by <br></br>
<a href="https://github.com/LiquidGalaxyLAB/lg-server/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LiquidGalaxyLAB/lg-server" />
</a>
<a href="https://github.com/LovelySehotra12/Swiper-Carousel/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LovelySehotra12/Swiper-Carousel" />
</a>

The frontend is Designed by Mentor Yash.
