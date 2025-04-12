## Overview

SmartService is a web application built using **Angular** for the frontend and **ASP.NET Core REST API** for the backend. The application provides functionalities for users and administrators to manage cars, repairs, bills, and more. The system incorporates various modern practices such as **state management**, **dependency injection**, **guards**, **interceptors**, and **DTOs** to ensure robust and scalable software architecture.

---

## Tech Stack

- **Frontend**: Angular (HTML, SCSS, TypeScript, RxJS)
- **Backend**: ASP.NET Core (C#)
- **Database**: Azure SQL Database (via Entity Framework Core)
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Azure

---

## Frontend (Angular)

### Folder Structure

The folder structure for the Angular application is organized into various modules, services, and components to maintain scalability and separation of concerns.
- `components`: This folder contains reusable UI components (e.g., headers, modals).
- `models`: Stores the application's models (e.g., Car, User, Bill).
- `services`: Contains business logic and API interaction (e.g., authentication, car service).
- `guards`: Contains route guards like auth.guard.ts for protecting routes.
- `interceptors`: Contains HTTP interceptors, such as auth.interceptor.ts for attaching JWT tokens to requests.
-`app-routing.module.ts`: Handles routing across the application.
- `app.module.ts`: The root module that imports and declares the entire application.

---

### Services

Services in Angular handle business logic and API communication. These are provided via Angular's **dependency injection** system.

For example:
```
ng generate service authentication
```

This command generates an authentication.service.ts which contains methods for logging in and managing authentication state.
- `authentication.service.ts`: Manages authentication logic (login, logout, token storage).
- `user.service.ts`: Handles user-related API calls like retrieving user details.
- `bill.service.ts`: Interacts with the backend for bill-related operations.

---

### Guards

Guards in Angular protect routes from unauthorized access.

For example:
```
ng generate guard auth
```

Generates an auth.guard.ts that checks whether a user is authenticated before navigating to a route.

**How it works**: The `AuthGuard` implements `CanActivate` and checks if the user has a valid JWT token before they can access certain pages like the administrator or mechanic dashboards.

Here is the code for the `AuthGuard`:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
    const routerInstance = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // Only execute guard logic in the browser (not on server-side)
    if (isPlatformBrowser(platformId)) {
        // Check if a valid token exists in sessionStorage
        if (!!sessionStorage.getItem(TOKEN_CONSTANT)) {
            return true; // Allow navigation if the token exists
        } else {
            // Redirect to login page if token does not exist
            routerInstance.navigateByUrl('/login');
            return false; // Prevent navigation
        }
    } else {
        return false; // Prevent navigation in non-browser environments
    }
};
```

**Explanation**:

1. **CanActivateFn**: The `authGuard` is defined as a `CanActivateFn` function, which is used as a route guard to control whether a route can be activated or not.
2. **Platform Check**: The guard checks if the code is running in the browser using the `isPlatformBrowser` function. This ensures that the session storage check is only done on the client side.
3. **Token Validation**: The guard looks for the presence of a valid token in `sessionStorage`. If the token exists, the user is allowed to proceed and access the route (return true).
4. **Redirecting Unauthorized Users**: If no token is found, the user is redirected to the login page (`routerInstance.navigateByUrl('/login')`), and the navigation is blocked (return false).
5. **Return False for Non-Browser Platforms**: If the platform is not a browser, the navigation is blocked (return false), preventing the route from being activated.

For the `AuthGuard`, we can add it to the routes that require authentication:
```typescript
const routes: Routes = [
  {
    path: 'protected-route',
    component: ProtectedComponent,
    canActivate: [authGuard],
  }
];
```

---

### Interceptors

Interceptors are used to modify HTTP requests or responses globally.

For example:
```
ng generate interceptor auth
```

This creates `auth.interceptor.ts`, which adds the Authorization header with the stored JWT token to every outgoing HTTP request. It also handles token expiration by redirecting users to the login page if needed.

Here's the code for the **AuthInterceptor**:

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        // Get the token from sessionStorage
        const token = sessionStorage.getItem(TOKEN_CONSTANT);

        // If the token exists, clone the request and add the Authorization header
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        // Pass the modified request to the next handler
        return next.handle(request);
    }
}
```

**Explanation**:
1. **HttpInterceptor**: The AuthInterceptor implements the HttpInterceptor interface, which allows us to modify HTTP requests before they are sent to the server.
2. **Token Injection**: The interceptor checks if there is a stored token in `sessionStorage` using `sessionStorage.getItem(TOKEN_CONSTANT)`. If the token exists, the request is cloned and the Authorization header is set with the token in the form of a Bearer token.
3. **Request Handling**: After adding the token, the modified request is forwarded to the next handler using `next.handle(request)`. If there is no token, the request is sent without the Authorization header.
4. **Usage**: This interceptor is automatically triggered for every HTTP request made in the app, ensuring that every secured request includes the necessary token.

---

### Routing

Routing in Angular is handled by the `app-routing.module.ts` file, where routes are defined and associated with components. Angular uses a single-page application approach, meaning that the page does not reload when navigating between views, providing a faster user experience.

#### Route Definitions

Here are the routes defined in the application:
```typescript
const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    {
        path: 'user-main-page',
        canActivate: [authGuard],
        component: UserMainPageComponent,
    },
    {
        path: 'user-cars-page',
        canActivate: [authGuard],
        component: UserCarsPageComponent,
    },
    {
        path: 'user-bills-page',
        canActivate: [authGuard],
        component: UserBillsPageComponent,
    },
    {
        path: 'user-edit-page',
        canActivate: [authGuard],
        component: UserEditPageComponent,
    },
    {
        path: 'mechanic-main-page',
        canActivate: [authGuard],
        component: MechanicMainPageComponent,
    },
    {
        path: 'administrator-main-page',
        canActivate: [authGuard],
        component: AdministratorMainPageComponent,
    },
    {
        path: 'administrator-add-mechanic-page',
        canActivate: [authGuard],
        component: AdministratorAddMechanicPageComponent,
    },
];
```
- **Login and Registration**: The routes `/login` and `/register` point to their respective components, **LoginPageComponent** and **RegisterPageComponent**, which allow the user to authenticate or create a new account.
- **Protected Routes**: Certain routes, such as `/user-main-page`, `/user-cars-page`, `/user-bills-page`, etc., are protected with the `authGuard`. This ensures that only authenticated users can access these pages. If a user is not logged in and tries to access these routes, they will be redirected to the login page.

##### Redirection
- **Default Route**: When the application is loaded, the default route (`path: ''`) redirects to the `/login page` if the user is not logged in.

---

### Notifications

For notifications in the application, I used the **Toastr** library, which provides a simple and customizable way to show alerts to the user. Toastr is widely used for success, error, and informational messages.

#### Installation

To install Toastr in your Angular application, I followed these steps:

1. **Install the required packages**:
   Run the following command to install Toastr and its dependencies:
   ```
   npm install ngx-toastr toastr
   ```
2. **Import ToastrModule**:
   In the `app.module.ts`, import ToastrModule from ngx-toastr and include it in the imports array.
   
4. **Add Toastr CSS**:
   Toastr comes with a default set of styles. You need to add the Toastr CSS file to your project. In your `angular.json` file, add the following to the styles array:
   ```json
   "styles": [
    "src/styles.scss",
    "node_modules/toastr/build/toastr.min.css"
    ]
   ```
   
**Using Toastr via the ToastService**

To make the usage of Toastr more modular and reusable, I created a custom ToastService that wraps the Toastr functionality. This service exposes methods to show different types of notifications such as success, error, warning, and information.

Here is the ToastService implementation:
```typescript
@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private toastr: ToastrService) {}

    success(message: string, title?: string) {
        this.toastr.success(message, title);
    }

    error(message: string, title?: string) {
        this.toastr.error(message, title);
    }

    warning(message: string, title?: string) {
        this.toastr.warning(message, title);
    }

    information(message: string, title?: string) {
        this.toastr.info(message, title);
    }
}
```

## Backend (ASP .NET Core)

### REST API
ASP .NET Core follows REST principles and exposes a set of HTTP endpoints for performing CRUD operations on resources like users, cars, bills, and repairs. These endpoints use standard HTTP verbs such as GET, POST, PUT, and DELETE to interact with the data.

The main endpoints are exposed through controllers in the Controllers folder, and the API is designed to handle requests from a frontend Angular application.

### Controllers
Controllers are responsible for handling incoming HTTP requests. They expose API endpoints that can be used by the client to interact with the system. For example, the `AuthenticationController` manages user login and registration, while the `CarController` exposes endpoints for managing car data.

**Common HTTP Verbs**:
- **GET**: Retrieves data from the server (e.g., getting a list of users or a specific car).
- **POST**: Creates new resources (e.g., registering a new user or creating a car record).
- **PUT**: Updates existing resources (e.g., modifying user details).
- **DELETE**: Removes resources (e.g., deleting a car or user).

**Attributes Used**:
- **[HttpGet]**: Used to specify that the method responds to GET requests.
- **[HttpPost]**: Used to specify that the method responds to POST requests.
- **[Authorize]**: Protects the endpoint by ensuring that only authenticated users can access it.
- **[Route]**: Specifies the route template for the controller action.

Example from `AuthenticationController.cs`:
```csharp
[HttpPost("login")]
public IActionResult Login([FromBody] UserLoginDTO loginDTO)
{
    // Logic to authenticate user
}
```

### Services

Services in ASP.NET Core encapsulate business logic and are typically injected into controllers to handle operations like authentication, password hashing, and token generation.
- `PasswordHasherService.cs`: Responsible for securely hashing and verifying passwords.
- `TokenService.cs`: Generates and validates JWT tokens used for authentication.

The services are registered in `Program.cs` like this:
```csharp
builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();
builder.Services.AddSingleton<ITokenService, TokenService>();
```

### Authentication

Authentication is handled using **JWT (JSON Web Tokens)**. The process starts by receiving a login request and validating the user's credentials. Upon successful authentication, a JWT token is issued, which is used for subsequent requests to verify the user's identity.

Here’s how the authentication is set up in `Program.cs`:

```csharp
var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
```
- **Jwt:Issuer** and **Jwt:Key** are retrieved from the configuration to set up the JWT token validation parameters.
- **AddAuthentication** and **AddJwtBearer** are used to configure JWT bearer authentication.

In the application pipeline, `app.UseAuthentication()` and `app.UseAuthorization()` are called to ensure that all requests are authenticated and authorized before proceeding.

### Entity Framework

**How to setup Entity Framework**

1. `AddDbContext<ApplicationDbContext>`: This method registers `ApplicationDbContext` as a service in the dependency injection (DI) container. `ApplicationDbContext` is the EF Core DbContext class, which represents the session between your application and the database. It’s responsible for querying and saving data.
2. `options.UseSqlServer(...)`: This method specifies the database provider that EF Core should use. In this case, it’s configured to use SQL Server by calling `UseSqlServer`. We can also use other databases such as MySQL, SQLite, or PostgreSQL by calling the appropriate method, such as `UseMySql()` or `UseSqlite()`.
3. `builder.Configuration.GetConnectionString("DatabaseConnection")`: Here, we're retrieving the connection string for the database from the appsettings.json configuration file. The key `"DatabaseConnection"` should match the connection string name in our configuration file. Here’s how it typically looks in `appsettings.json`:
     ```json
      "ConnectionStrings": {
      "DatabaseConnection": "Server=your_server;Database=your_db;User Id=your_user;Password=your_password;"
      }
     ```
   The connection string tells EF Core how to connect to your SQL Server database. It includes details like the server name, database name, and credentials.

Entity Framework Core (EF Core) is used to interact with the SQL database. The `ApplicationDbContext.cs` class is where the database context is defined, including the DbSets for each entity (e.g., User, Car, Bill).

**Migrations** are used to manage database schema changes. The migration files are located in the `Migrations` folder and can be applied using the:
```
dotnet ef database update command
```

Example of `ApplicationDbContext.cs`:
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Car> Cars { get; set; }
    public DbSet<Reparation> Reparations { get; set; }
    public DbSet<Bill> Bills { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
}
```

**Basic Entity Framework Commands**

Here are some common Entity Framework Core (EF Core) commands for managing the database and migrations:
1. **Creating a Migration**
   Migrations allow you to update the database schema when you make changes to your models. You generate a migration to capture those changes.
   
   Example command:
   ```
   dotnet ef migrations add <MigrationName>
   ```

3. **Applying Migrations (Updating the Database)**
   Once we’ve created a migration, we need to apply it to the database to update the schema. This command applies the latest migrations to the database.

   Example command:
   ```
   dotnet ef database update
   ```

4. **Viewing Migrations**
   If we want to see all the migrations that have been applied to your database, we can run the following command:

   Example command:
   ```
   dotnet ef migrations list
   ```

5. **Reverting to a Previous Migration**
   If we need to revert the database to a previous state, we can specify the migration name you want to revert to.
   
   Example command:
   ```
   dotnet ef database update <MigrationName>
   ```

6. Removing a Migration
   If we created a migration by mistake and haven't applied it to the database yet, we can remove it using this command:
   Example command:
   ```
   dotnet ef migrations remove
   ```

## Deploy using Azure

To deploy the SmartService application, I created two Azure Web Apps: one for the Angular client and one for the ASP.NET Core server, both hosted in the Germany West region for optimal performance. The Angular app was set up to run on Node.js, while the ASP.NET Core app was configured to run on .NET. For the backend database, we used Azure SQL Database. CORS was configured on the server to allow cross-origin requests from the client app, enabling smooth communication between the frontend and backend.

## Run application locally

To run the SmartService application locally, follow these steps:
1. **Clone the Repository**
   Start by cloning the repository from GitHub to your local machine. Open a terminal or command prompt and run:
   ```bash
   git clone https://github.com/tudorsuiu/framework-design-project.git
   cd framework-design-project
   ```

2. Run the server
   Navigate to the backend folder (`framework-design-project/backend`), and run the following command to restore the NuGet packages and run the backend server:

   ```bash
   dotnet restore
   dotnet run
   ```

   This will start the ASP.NET Core server locally, typically running on `https://localhost:5001` or `http://localhost:5000` depending on your setup.
   
3. Run the client
   After the backend is running, navigate to the client folder (`framework-design-project/frontend`), and install the dependencies using npm:

   ```bash
   npm install
   ```

   Once the dependencies are installed, start the Angular application with:

   ```bash
   ng serve -o
   ```

   Once both applications are running, open your browser and go to `http://localhost:4200` to access the Angular client.
   
