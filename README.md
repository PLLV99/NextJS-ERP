# Project Documentation for NextJS-ERP

## Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Spring Boot
- **Database**: PostgreSQL

## ERP Modules
1. **Dashboard**: Centralized data visualization and key performance indicators.
2. **Sales**: Manage sales orders, customers, and invoicing.
3. **Inventory**: Track stock levels, orders, and deliveries.
4. **Production**: Oversee manufacturing processes and production planning.
5. **Accounting**: Manage financial transactions, journals, and reports.
6. **Material**: Control raw materials and supply chain information.
7. **Formula**: Define production formulas and recipes.
8. **Reporting**: Generate various reports for insights and analysis.

## Authentication Flow
The application uses JSON Web Tokens (JWT) for authentication. Users are required to log in to obtain a token, which must be included in headers for subsequent requests.

## Project Structure
```
NextJS-ERP/
├── frontend/  # Contains Next.js application
├── backend/   # Contains Spring Boot application
└── docs/      # Documentation files
```

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/PLLV99/NextJS-ERP.git
   ```
2. Navigate to the `frontend` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Navigate to the `backend` directory and build the Java application:
   ```bash
   cd backend
   ./mvnw install
   ```
4. Start both frontend and backend servers.

## API Integration Details
- **Frontend** makes HTTP requests to the **Backend** API endpoints to perform CRUD operations on the database.
- Example of fetching sales data:
   ```javascript
   fetch('/api/sales')
       .then(response => response.json())
       .then(data => console.log(data));
   ```

## Deployment Information
To deploy the application, you need to:
1. Build the production assets in the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `backend` to a Java web server like Tomcat or to a cloud service.
3. Ensure the PostgreSQL database is set up and running.

For more detailed deployment instructions, refer to [DEPLOYMENT.md](./docs/DEPLOYMENT.md).