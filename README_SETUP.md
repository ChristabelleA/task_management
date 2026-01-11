
# Setup Backend & Database

Prerequisites include having .NET SDK ready for API development with Entity Framework Core. Install .NET 9.0 from the official site.

Navigate to the backend directory and restore packages:
```
cd task_management_c-\TaskManagementAPI
dotnet restore
```

Create and apply database migrations:
```
dotnet ef migrations add InitialCreate --context TasksContext
dotnet ef database update --context TasksContext
```
This sets up SQL Server LocalDB for your TasksContext.[1]

Start the backend server:
```
dotnet run
```
Access Swagger at `https://localhost:5236/swagger` for testing.

# Setup Frontend

Install Node.js 18+ LTS version. This ensures compatibility with React scripts and npm packages.

Navigate to the frontend directory and install dependencies:
```
cd task_management_app
npm install
```

Start the React development server:
```
npm start
```
The app runs on `http://localhost:3000`