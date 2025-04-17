# Full-Stack TypeScript Monorepo Documentation

Welcome to the full-stack TypeScript project documentation. This guide covers the entire stack, project structure, setup, and best practices for a monorepo that includes a Next.js frontend and a NestJS backend. Use this as a personal reference and onboarding guide for new developers.

## Stack Overview

This project uses a modern TypeScript stack split into frontend and backend, with shared code and types. Here’s a breakdown of each component and its role:

- **Next.js (TypeScript Frontend)** – Next.js is a React framework for building the frontend UI. It supports server-side rendering and static generation. We use Next.js (with TypeScript) for all user-facing pages and components of the web app.
- **NestJS (Fastify Backend)** – NestJS is a Node.js framework for building scalable server-side applications. Our API is built with NestJS, using the Fastify adapter for high performance (Fastify replaces Express under the hood). NestJS provides a structured way to organize controllers, services, and modules for the backend logic.
- **PostgreSQL Database** – A PostgreSQL database stores all persistent data (e.g. user info, application data). PostgreSQL is a reliable relational database that works well with our ORM for structured data and SQL querying.
- **Drizzle ORM** – Drizzle is a lightweight TypeScript ORM (Object-Relational Mapper) / query builder. We use Drizzle to interact with the PostgreSQL database in a type-safe way. It allows us to define the database schema in TypeScript and perform queries with full type safety (no raw SQL strings needed).
- **ts-rest & Zod (API Contracts)** – We define our REST API contract using **ts-rest**, which, together with Zod schemas, provides end-to-end type safety. The contract is a shared library that both the backend and frontend use. On the backend, ts-rest + Zod validates incoming requests and shapes responses. On the frontend, it gives us TypeScript types and client calls that exactly match the backend API.
- **Passport.js (JWT Authentication)** – Passport.js is used in NestJS to handle authentication. We use the JWT strategy: users log in and receive a JWT (JSON Web Token). The backend verifies this token on protected routes. This provides stateless auth (no sessions stored on the server) and is easily used by the frontend by including the token in requests.
- **Turborepo (Monorepo Tool)** – We manage the codebase as a monorepo with Turborepo. This means the frontend, backend, and shared packages live in one repository. Turborepo helps organize the code, run tasks across projects, and cache builds. It makes developing and building the apps faster and more convenient in a single unified repo.
- **Docker (Deployment Containers)** – We use Docker to containerize the apps for deployment. Both the Next.js app and NestJS API have Docker configurations. On a VPS (Virtual Private Server), we run the frontend, backend, and database as separate Docker containers (or via Docker Compose). This ensures a consistent environment in development and production.

Each part of the stack works together: Next.js provides the interface and calls the NestJS API; NestJS uses Drizzle to query PostgreSQL; ts-rest ensures the data exchanged is valid and typed; Passport secures the API; Turborepo ties the codebase together; Docker enables easy deployment.

## Knowledge Prerequisites

Before diving into development, it’s helpful to be comfortable with the following concepts and technologies:

- **TypeScript & JavaScript** – Understanding TypeScript syntax (interfaces, generics, types) and modern JavaScript/ES6+ features.
- **Node.js & NPM/PNPM** – Basics of Node.js runtime and using package managers (like PNPM or Yarn Workspaces) to install and manage dependencies.
- **React & Next.js** – Familiarity with React (hooks, components, JSX) and Next.js concepts such as pages vs. app directory, routing, server-side rendering (SSR) vs. client-side rendering (CSR).
- **NestJS** – Basics of NestJS structure (modules, controllers, providers, decorators) and how it abstracts HTTP servers (with either Express or Fastify).
- **HTTP & REST** – Understanding of RESTful API principles and HTTP request/response cycle (methods, status codes, headers).
- **JSON Web Tokens (JWT)** – Concept of JWTs for auth (signing, verifying tokens) and how they are used for stateless authentication.
- **Database & SQL** – Fundamental knowledge of relational databases and SQL queries. Knowing how tables, rows, and relations work in PostgreSQL.
- **ORM/Query Builders** – Basic idea of what an ORM is. Drizzle has its own style, but familiarity with ORMs or query builders (like Prisma, TypeORM, Knex) will help in understanding Drizzle’s approach to defining schemas and querying the DB.
- **Zod (Schemas & Validation)** – Some exposure to schema validation libraries. Zod is used to define data schemas and ensure runtime type checking. This is key for validating API inputs/outputs.
- **Monorepo Tools** – Understanding what a monorepo is, and how tools like Turborepo or Nx help manage multiple projects. Basic idea of sharing code between packages.
- **Docker** – Basic knowledge of Docker: what containers and images are, how to build an image from a Dockerfile, what Docker Compose does, and how to run containers. This will be needed for setting up the dev database or deploying to the VPS.
- **Git & Development Workflow** – (Implicitly) familiarity with cloning repos, running scripts, etc., since this is a given in any project.

Don’t worry if you aren’t an expert in all of these – this documentation will guide you through the setup. But having this background will make the process much easier to follow.

## Project Folder Structure

The repository is organized as a **monorepo** using Turborepo, with separate folders for each app and shared packages. Here’s the high-level layout:

```
root/
├── apps/
│   ├── web/       # Next.js frontend application
│   │   ├── pages/ or app/    # Next.js pages or app directory
│   │   ├── components/       # React components
│   │   ├── public/           # Static assets
│   │   ├── ... (other Next.js files like next.config.js)
│   │   └── package.json
│   └── api/       # NestJS backend application
│       ├── src/
│       │   ├── main.ts       # NestJS entry file (bootstrap with Fastify)
│       │   ├── app.module.ts # Root module
│       │   ├── modules/      # NestJS feature modules (e.g., AuthModule, UserModule)
│       │   ├── controllers/  # NestJS controllers
│       │   ├── services/     # NestJS services (business logic)
│       │   └── ... (entities, guards, etc.)
│       ├── test/             # (Optional) tests for NestJS
│       └── package.json
├── packages/
│   └── ts-rest/   # Shared package for API contracts and schemas
│       ├── src/
│       │   ├── contract.ts   # Definition of API endpoints (using ts-rest)
│       │   ├── schemas.ts    # Zod schemas for data models
│       │   └── index.ts      # Barrel file exporting contracts/schemas
│       └── package.json
├── docker/ (optional)        # Dockerfiles or config (could also be at root of each app)
├── package.json              # Root package with workspace settings and scripts
├── turbo.json                # Turborepo configuration (tasks pipeline)
├── tsconfig.json             # Base TypeScript config (extended by apps and packages)
└── ... (other config files like .eslintrc, .prettierrc, etc.)

```

**Key directories and their purpose:**

- **`apps/web`** – The Next.js frontend app. This contains all the Next.js specific code (pages or the new `/app` directory depending on Next.js version, components, hooks, etc.). It’s a standalone app that can be run and built independently. It consumes types and API client calls from the shared `ts-rest` package to interact with the backend.
- **`apps/api`** – The NestJS backend app. Contains Nest’s modules, controllers, and services. It uses the Fastify adapter (configured in `main.ts` when creating the Nest application). This app imports the shared `ts-rest` contract to implement the API endpoints according to the contract, and uses Drizzle ORM for database operations.
- **`packages/ts-rest`** – The shared library for API contracts and schemas. Both the frontend and backend depend on this package. It defines the shape of all API endpoints (paths, input, output) using ts-rest, and uses Zod for schema validation. For example, this package might define a `users` contract with endpoints like `getUser` or `createUser`, including the expected request params and response types. By sharing this, we ensure the frontend and backend are always in sync about the API structure and data formats.
- **Monorepo Config Files** – The root has configs used by the whole repo:
  - `package.json` at root usually defines the workspaces (`apps/*` and `packages/*`) and may contain scripts that delegate to Turborepo.
  - `turbo.json` defines how Turborepo runs tasks (for example, which scripts to run in parallel or in sequence, caching settings, etc.). Typically, tasks like build, lint, test are orchestrated here.
  - Shared linting/formatting configs like `.eslintrc.js` or `tsconfig.json` might live at root or in a `packages/config` folder, ensuring consistency across apps.
- **Docker configuration** – We include Docker-related files (like Dockerfile for web, Dockerfile for api, and possibly a `docker-compose.yml`). These might live at the root or in each app directory. They describe how to containerize each app and how to run them together for development/production.

This structure keeps separation of concerns: the web and api apps have their own codebases but can both use the shared contracts (and potentially other shared packages, like a UI library or config). Turborepo will recognize these as separate projects with dependencies between them (for example, `apps/api` and `apps/web` both depend on `packages/ts-rest`). This way, changes in the contract package can trigger rebuilds of the apps as needed, and you avoid duplicating code or types between frontend and backend.

## Initial Setup Instructions

To get the project up and running on your local machine, follow these steps. This covers installing dependencies, setting up the environment, and running the development servers.

1. **Clone the Repository** – If you haven’t already, clone the monorepo from your version control:

   ```bash
   git clone <repository-url>.git
   cd <repository-folder>

   ```

   Make sure you have the repository content on your machine.

2. **Install Dependencies** – This project uses a workspace-enabled package manager. We recommend **pnpm** for speed and consistency (you can also use Yarn if preferred). Ensure you have pnpm installed (`npm install -g pnpm` if not). Then install all dependencies:

   ```bash
   pnpm install

   ```

   This will install all packages in the monorepo (frontend, backend, shared) and link them together. (If using Yarn, run `yarn install` similarly.)

3. **Environment Variables** – Set up your environment variables for both the frontend and backend:

   - There are example environment files provided: for instance, `apps/web/.env.example` and `apps/api/.env.example`. Copy these to `.env`:

     ```bash
     cp apps/web/.env.example apps/web/.env
     cp apps/api/.env.example apps/api/.env

     ```

   - Open the new `.env` files and adjust values if needed. At minimum, you should set:
     - In `apps/api/.env`: the database connection string (e.g., `DATABASE_URL="postgres://user:pass@localhost:5432/mydb"`), a JWT secret (e.g., `JWT_SECRET="some-secret-key"`), and any other config (like port, etc.).
     - In `apps/web/.env`: the base URL of the API (e.g., `NEXT_PUBLIC_API_URL="http://localhost:3001"` if your API runs on port 3001 locally), and any environment-specific flags needed by Next.
   - These env files will be loaded by the apps (NestJS uses something like ConfigModule to load `.env`, Next.js automatically loads `.env` for public vars prefixed with `NEXT_PUBLIC_`).

4. **Database Setup** – Ensure you have a PostgreSQL database running for development:

   - The simplest way is via Docker. You can run a Postgres container with Docker Compose or Docker CLI. For example, if you have Docker installed, run:

     ```bash
     docker run --name mydb -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=mydb -p 5432:5432 -d postgres:14

     ```

     This command will start a PostgreSQL instance on port 5432 with database name `mydb` and user/password as `user`/`pass` (adjust these as you like, but match the `DATABASE_URL` in your env).

   - Alternatively, use the provided `docker-compose.yml` (which we’ll cover later) to start all services including the database in one go.
   - If you have PostgreSQL installed on your host, you can use that as well; just ensure the `DATABASE_URL` in the backend `.env` is correct and that the database is created.

5. **Run Database Migrations** – (If applicable) If the project uses Drizzle’s migration system to set up the schema, run the migration after the DB is up:

   ```bash
   pnpm run migrate

   ```

   This likely calls `drizzle-kit migrate` using the configuration, applying any migrations in the project (usually migrations are generated in a `drizzle/` folder or similar). Running this will create the necessary tables in your database. (If there are no migrations yet and the schema is small, this step might be optional.)

6. **Start the Development Servers** – Now launch both the frontend and backend in development mode. The Turborepo setup allows you to run them together:

   ```bash
   pnpm run dev

   ```

   This uses Turborepo to run the dev script in both `apps/web` and `apps/api` concurrently. Under the hood, it likely runs `next dev` for the frontend and `nest start --watch` (or similar) for the backend. You should see logs for both apps starting up.

   > Tip: If you want to run only one side (say just the backend), you can cd apps/api and run pnpm run start:dev to start NestJS alone. Similarly, cd apps/web && pnpm run dev will start the Next.js app alone. But for most development, running both together via the root dev script is convenient.

7. **Verify Running Apps** – Once `pnpm dev` is running:
   - Open your browser to [**http://localhost:3000**](http://localhost:3000/). This is the Next.js app by default (Next’s dev server runs on port 3000). You should see the web application loading. If it includes any data from the API, it will attempt to fetch from the API.
   - The NestJS API is likely running on [**http://localhost:3001**](http://localhost:3001/) (Nest’s default is 3000, but we often change it to 3001 to avoid clashing with Next. Check `apps/api/.env` or the Nest application bootstrap for the exact port). You can test the API by visiting an endpoint, e.g., `http://localhost:3001/health` or any public endpoint defined, to see if it responds (or check the console logs from Nest which usually show something like “Listening on port ...”).
   - If everything is set up correctly, the Next frontend should be able to communicate with the Nest backend (e.g., via fetch requests). If you get any errors (like CORS issues or network errors), double-check the `NEXT_PUBLIC_API_URL` and the backend’s CORS configuration. In development, you might want to enable CORS in NestJS for `http://localhost:3000`.

At this point, you have the development environment running. Every time you edit code in the frontend or backend, the respective server will hot-reload (Next.js refreshes the page or modules, NestJS will restart thanks to the watch mode). You can develop features and see changes in real time.

## Docker Setup (Containers & Deployment)

We use Docker to containerize the application for both local testing (optional) and production deployment on a VPS. Docker allows us to package the Node.js apps and even the database in a consistent environment. Below, we provide example Dockerfiles for the frontend and backend, and a docker-compose configuration to run them together.

### Dockerfile for Frontend (Next.js)

For the Next.js app (`apps/web`), we use a multi-stage Dockerfile to first build the app (statically optimize it) and then serve it. Here’s an example:

```
# Use an official Node.js image as the build environment
FROM node:18-alpine AS builder

# Set working directory and copy package definitions
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/

# Install dependencies (including dev deps for building)
RUN npm install -g pnpm && pnpm install

# Copy the source code of the frontend
COPY apps/web ./apps/web
COPY packages/ts-rest ./packages/ts-rest

# Build the Next.js app (production build)
RUN pnpm --filter apps/web run build

# ---- Run Stage ----
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the production build output and necessary files from builder
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/next.config.js ./apps/web/
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/

# Expose the port Next.js will run on
EXPOSE 3000

# Set environment variable to production
ENV NODE_ENV=production

# Start the Next.js app
CMD ["pnpm", "--filter", "apps/web", "start"]

```

**Explanation:** We use Node 18 Alpine for a lightweight image. In the **builder stage**, we install dependencies and run the Next.js build (which outputs a `.next` directory with optimized static files and server code). In the **runner stage**, we copy the build output and `node_modules` needed to run the app. We then run `pnpm start` for the web app, which by default (in Next) starts the production server on port 3000. This container will serve the Next.js application.

### Dockerfile for Backend (NestJS)

For the NestJS API (`apps/api`), we also do a multi-stage build to compile TypeScript to JavaScript and then run the server:

```
# Use Node.js for building the Nest app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/ts-rest/package.json packages/ts-rest/
# (If there are other shared packages, copy their package.json as well)

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy source code for API and shared packages
COPY apps/api ./apps/api
COPY packages/ts-rest ./packages/ts-rest

# Build the NestJS app (transpile TypeScript to JS)
RUN pnpm --filter apps/api run build

# ---- Run Stage ----
FROM node:18-alpine AS runner

WORKDIR /app

# Copy compiled output and necessary files
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json .
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the API will run on (match the port in main.ts or env, e.g., 3001)
EXPOSE 3001
ENV NODE_ENV=production

# Start the NestJS server (Fastify)
CMD ["node", "dist/main.js"]

```

**Explanation:** In the builder stage, we install all dependencies (so that Nest CLI or tsc can run) and then run the build (which, in Nest’s default setup, compiles to `dist` directory). In the final image, we take the compiled `dist` files and `node_modules` needed to run them. We then execute the compiled `main.js` which starts the NestJS Fastify server. The port exposed should match the port configured in the app (commonly 3001 for our setup). The environment is set to production to ensure no dev-specific behavior runs.

### Docker Compose Configuration

We can use **docker-compose** to orchestrate running multiple containers (web, api, and database) together, both for local development or on a server. Here’s an example `docker-compose.yml` that defines the three services:

```yaml
version: "3.9"
services:
  db:
    image: postgres:14-alpine
    container_name: myapp-db
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=myappdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myappdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: myapp-api
    env_file: apps/api/.env # use the env file for API config (DB URL, JWT secret, etc.)
    depends_on:
      - db
    ports:
      - "3001:3001"
    # Optionally, restart: always (in production to keep it running)
    networks:
      - myapp-network

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: myapp-web
    env_file: apps/web/.env # env for Next.js (NEXT_PUBLIC_API_URL etc.)
    depends_on:
      - api
    ports:
      - "3000:3000"
    networks:
      - myapp-network

networks:
  myapp-network:
    driver: bridge

volumes:
  pgdata:
```

**Explanation:** We define three services:

- **db:** uses the official Postgres image. We set up environment variables for default user, password, and database name. We also mount a volume (`pgdata`) to persist data. The port 5432 is published so the apps (or your local machine) can connect. A healthcheck is included to ensure the DB is ready before other services use it.
- **api:** builds from our `apps/api/Dockerfile` (assuming the Dockerfile we wrote is located there). It uses the environment file for configuration, so it will pick up `DATABASE_URL`, `JWT_SECRET`, etc. It depends_on the db, meaning it will wait for the database to start (though in Compose v3 this is not a strict wait, but the healthcheck on db helps). It exposes port 3001 to the host. Both `api` and `web` are on a custom network `myapp-network` so they can communicate by name.
- **web:** builds from `apps/web/Dockerfile`. It depends on `api` (so that the frontend starts after the API). It uses the env file for any needed config (like API URL). It exposes port 3000 for the Next.js app. By sharing `myapp-network` with the API, the web container can reach the API container via the hostname `api` (for example, `NEXT_PUBLIC_API_URL` could be `http://api:3001` inside the container network).

Using this compose file, you can run `docker-compose up --build` to build and start all services. For local development, you might still prefer running via `pnpm dev` (for hot-reloading). But for testing a production-like environment or ensuring Docker setup works, compose is handy.

**Deployment to VPS:** On your VPS, ensure you have Docker and docker-compose installed. You can copy the code or build artifacts to the server, or build images and push to a registry, then pull on the server. Common deployment steps might be:

1. Copy your project (or at least the Dockerfiles and docker-compose config) to the server.
2. Set up real environment variables in the `.env` files (e.g., a strong `JWT_SECRET`, proper `DATABASE_URL` pointing to a production DB or the local db container).
3. Run `docker-compose up -d` to start all containers in the background.
4. Possibly set up a reverse proxy (like Nginx) to route traffic to the `web` container (if you want to serve the frontend on port 80/443 with a domain). Alternatively, you could bind the web container to port 80 directly in compose. For production, consider using a proxy for SSL termination.

The result is the Next.js app running (serving the UI) and the NestJS API running (serving JSON endpoints), both inside Docker, communicating with each other and the PostgreSQL database. This isolates the environment and makes it easier to maintain consistency between dev and prod.

## Authentication Setup (Passport JWT + Frontend Handling)

Authentication in this project is implemented via JSON Web Tokens (JWT) using Passport.js on the backend, and handling the tokens on the frontend for API calls. Here’s a high-level guide to how it works:

### NestJS: Passport JWT Strategy (Backend)

On the backend, we set up a NestJS **AuthModule** that uses Passport’s JWT strategy:

- **Passport and JWT Modules:** In the NestJS `AuthModule`, we import `PassportModule` and `JwtModule`. For example:

  ```tsx
  // apps/api/src/auth/auth.module.ts
  import { PassportModule } from "@nestjs/passport";
  import { JwtModule } from "@nestjs/jwt";
  import { JWTStrategy } from "./jwt.strategy";

  @Module({
    imports: [
      PassportModule.register({ defaultStrategy: "jwt" }),
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "1h" }, // tokens expire in 1 hour
      }),
    ],
    providers: [JWTStrategy, AuthService],
    controllers: [AuthController],
  })
  export class AuthModule {}
  ```

  Here we configure Passport to use the 'jwt' strategy by default and set up the JWT secret and expiration (using the `JWT_SECRET` from our env file). The `AuthService` might handle validating user credentials and generating tokens.

- **JWT Strategy:** We implement a `JwtStrategy` by extending Passport’s `JwtStrategy` class:

  ```tsx
  // apps/api/src/auth/jwt.strategy.ts
  import { Injectable } from "@nestjs/common";
  import { PassportStrategy } from "@nestjs/passport";
  import { ExtractJwt, Strategy } from "passport-jwt";

  @Injectable()
  export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET,
      });
    }

    async validate(payload: any) {
      // `payload` is the decoded JWT payload. We can attach it to the request.
      // For example, return a user object or ID:
      return { userId: payload.sub, username: payload.username };
    }
  }
  ```

  This strategy tells Passport how to extract the JWT (here, from the `Authorization: Bearer <token>` header) and how to verify it (using our secret key). The `validate` function defines what we want to do with the JWT’s contents once verified. Typically, we’d look up the user in the database or simply trust the token and attach the payload to the request. In this example, we assume the JWT payload contains `sub` (user ID) and `username`, and we return an object representing the authenticated user.

- **Auth Controller & Service:** We create an `AuthController` with routes like login and (optionally) register or refresh:

  ```tsx
  // apps/api/src/auth/auth.controller.ts
  @Controller("auth")
  export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("login")
    async login(@Body() loginDto: LoginDto) {
      // Validate user credentials (AuthService validates against DB)
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password
      );
      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }
      // Generate a JWT for the user
      return this.authService.login(user);
    }

    @Post("register")
    async register(@Body() dto: RegisterDto) {
      // Create new user and return JWT
      const user = await this.authService.register(dto);
      return this.authService.login(user);
    }
  }
  ```

  The AuthService would have methods like `validateUser` (check email/password with DB, perhaps using Drizzle to query the users table) and `login(user)` which signs a JWT:

  ```tsx
  // apps/api/src/auth/auth.service.ts
  async login(user: UserEntity) {
    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  ```

  We include `JwtService` (from the JwtModule) via dependency injection to sign the token with our secret and options.

- **Protecting Routes:** Other controllers (for protected resources) use the `@UseGuards(AuthGuard('jwt'))` decorator to require a valid JWT:

  ```tsx
  // apps/api/src/users/users.controller.ts
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  ```

  The `AuthGuard('jwt')` will utilize the JWTStrategy to automatically validate the token on incoming requests. If the token is missing or invalid/expired, the request will be rejected with 401 Unauthorized. If valid, `req.user` will contain whatever we returned in `validate()` (e.g., userId and username), which can be used in the handler (perhaps to fetch user-specific data).

In summary, the NestJS backend issues JWTs via the auth endpoints and secures routes by checking for the JWT in requests. The token itself is typically a signed payload containing the user’s ID (and maybe other info), so the server doesn’t need to keep session state.

### Next.js: Handling JWT on the Frontend

On the frontend (Next.js app), we need to **obtain the JWT upon login and include it in API requests** for protected resources. Key points for the client side:

- **Login Flow:** When a user logs in (for example, submitting a form with email/password to a Next.js page or API route that calls the Nest API):
  - The Next app will send a request to the NestJS auth login endpoint (e.g., `POST /auth/login`) with the user’s credentials. This can be done using the fetch API or a library like axios. Because we share types via ts-rest, we know the request body format (LoginDto) and the response shape (which includes `accessToken`).
  - If the credentials are correct, the response will contain `accessToken` (the JWT). On the frontend, we should store this token for subsequent use.
  - **Storing the Token:** There are a couple of approaches:
    - Store the JWT in **memory or context** (e.g., React state or a context provider) – simple but the token is lost on refresh unless you also persist it.
    - Store in **localStorage** – persists across refreshes, but JavaScript accessible (potential XSS risk if your app is vulnerable).
    - Store in an **HTTP-only cookie** – more secure against XSS (JavaScript cannot read it) and the cookie can be automatically sent to the API if on the same domain, but requires your API to handle cookie auth and possibly CORS with credentials.
    - In many cases, a common approach is storing the token in memory or localStorage for simplicity. Just be aware of security implications; for sensitive scenarios, http-only cookies or a proper auth library might be used.
  - For example, a simple approach:
    ```jsx
    // In a Next.js page or React component on login form submit:
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    if (response.ok) {
      const data = await response.json(); // expects { accessToken: '...' }
      localStorage.setItem("token", data.accessToken);
      // Optionally, set a state or context that user is now logged in
    } else {
      // Handle login error (wrong credentials, etc.)
    }
    ```
    Now the token is stored in localStorage. In a more advanced setup, you might also store a refresh token or set a cookie.
- **Including JWT in Requests:** For any subsequent API calls from the frontend to the backend (to protected routes), include the JWT in the Authorization header. If we are using the ts-rest client, we can configure it to include the header:
  ```tsx
  import { initClient } from "@ts-rest/core";
  import { contract } from "@my-org/ts-rest"; // import our shared contract
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const client = initClient(contract, {
    baseUrl: apiBase,
    baseHeaders: {
      // Attach JWT from localStorage for all requests:
      Authorization: () => {
        const token = localStorage.getItem("token");
        return token ? `Bearer ${token}` : undefined;
      },
    },
  });
  ```
  This `client` will automatically set the `Authorization: Bearer <token>` header on calls, using the token from localStorage. Now you can call API endpoints through this client:
  ```tsx
  const result = await client.users.getProfile();
  // this corresponds to some contract endpoint and will include the auth header
  if (result.status === 200) {
    const profile = result.body;
    // use profile data in your component
  } else if (result.status === 401) {
    // not authenticated (maybe token expired or missing)
  }
  ```
  If you’re not using ts-rest’s client for some reason, ensure that any fetch or axios call to protected endpoints includes the header:
  ```jsx
  fetch("/api/protected-route", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  ```
  Where `'/api/protected-route'` is the full URL to the NestJS API.
- **Maintaining Auth State:** It’s good to maintain a global auth state in the frontend (for example, using React Context or Redux) to know if the user is logged in and who they are. You might decode the JWT on the client to get the user info (JWT is just base64 data) or better, fetch the user profile after login. The decoded token can give you user ID, etc., but avoid using it as a source of truth for anything sensitive (always verify on backend). A simple approach: after login, fetch the `/users/profile` endpoint (which returns user info using the token) and store that in React state.
- **Logout:** To log out, you can simply remove the token from storage (and cookies if set). For example:

  ```
  localStorage.removeItem('token');

  ```

  This will prevent the Authorization header from being sent next time, and you can redirect the user to a login page or homepage.

- **SSR Considerations:** If you use Next.js’s server-side rendering and want to check auth on the server side (for example, protecting certain pages), you can do so in `getServerSideProps`. You’d have to parse the token from a cookie (if you stored it as a cookie) or some other mechanism, since getServerSideProps doesn’t have access to browser localStorage. Many apps set a cookie `token=<JWT>` and include that in requests, so the Next.js server code can verify it (maybe by calling the Nest API or having a lightweight check).
  - For simplicity, our approach can treat the Next app as a pure client where authentication is handled on the client side. But if SEO or SSR-protection is needed, consider storing JWT in a cookie and adding logic in Next.js API routes or getServerSideProps to verify user authentication.

**Security Tip:** If possible, prefer HTTP-only cookies for JWT, as it mitigates XSS attacks stealing your token. This requires some setup: NestJS would set a cookie on login (via response), and your Next.js app would need to send credentials on fetch and handle CORS. This is more complex, so if sticking to localStorage, be sure your app is otherwise secure against XSS, and consider token expiration and refresh logic.

In summary, on the frontend the dev workflow is: user logs in -> get JWT -> store it -> include it on future requests -> handle logouts by removing it. On the backend: verify JWT on each request via Passport. This results in a secure, stateless auth system.

## API Development with ts-rest and Zod (Type-Safe Contracts)

One of the highlights of this stack is the use of **ts-rest** to create a single source of truth for API endpoints. This allows us to share request/response types between the NestJS API and the Next.js client, ensuring both are always in sync. We also use **Zod** schemas to validate data at runtime. Here’s how to work with the API contracts:

### Defining the API Contract (Shared Package)

In the monorepo’s shared `packages/ts-rest` package, we define the API contract. Think of this as an **interface for our REST API**. Using ts-rest, we declare each endpoint’s method, path, input, and output. For example, consider a simple posts API:

```tsx
// packages/ts-rest/src/contract.ts
import { initContract } from "@ts-rest/core";
import { z } from "zod";

// Initialize a ts-rest contract instance
const c = initContract();

// Define Zod schemas for data models
export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  authorId: z.string(),
});
export type Post = z.infer<typeof PostSchema>; // TypeScript type for a Post

// Define Zod schema for creating a post (input data)
export const CreatePostSchema = z.object({
  title: z.string(),
  body: z.string(),
});

// Now define the contract for posts endpoints
export const postsContract = c.router({
  getPost: {
    method: "GET",
    path: "/posts/:id",
    // No body for GET. Perhaps no query params either in this case.
    responses: {
      200: PostSchema.nullable(), // 200 OK returns a Post or null if not found
    },
  },
  createPost: {
    method: "POST",
    path: "/posts",
    body: CreatePostSchema, // what the client should send in the body
    responses: {
      201: PostSchema, // 201 Created returns the created Post
    },
  },
});
```

In this snippet, we:

- Created Zod schemas `PostSchema` and `CreatePostSchema` to define the shape of a Post object and the expected input for creating a post.
- Used `c.router({...})` to define two endpoints: `getPost` and `createPost`. For each, we specify:
  - HTTP method and path (with `:id` indicating a route parameter for getPost).
  - The expected request body schema if any (only for createPost).
  - The possible responses: for simplicity we list just success responses here (200 and 201) with the schema of the response.
  - You can also add a `summary` or description for documentation, and even define error status responses if needed.

This `postsContract` (and similarly you’d define other contracts, e.g., for auth, users, etc.) is exported and becomes part of the shared contract library. You might combine multiple routers or nest them as needed. For example, ts-rest allows combining routers, but keeping them separate by domain (posts, users, etc.) is clean.

**Why this is useful:** The above defines **both** the server-side API spec and the client-side expectations in one go. Now both the NestJS app and Next.js app will import this contract to implement or consume it. If we change a schema (say, add a field to `PostSchema`), both sides will immediately be aware of it (TypeScript types will update).

### Implementing API Endpoints in NestJS (Server Side)

On the NestJS side, we implement the contract using ts-rest’s Nest adapter. Instead of writing typical Nest controllers with manual DTOs and decorators for each param, we can leverage the contract to reduce boilerplate and ensure the implementation matches the spec.

First, install the ts-rest Nest integration (`@ts-rest/nest`) in the api project if not already.

In the NestJS controller, we use the `TsRestHandler` decorator to attach a contract endpoint to a method, and `tsRestHandler` to handle the request and response. For example:

```tsx
// apps/api/src/posts/posts.controller.ts
import { Controller } from "@nestjs/common";
import { TsRest, TsRestHandler } from "@ts-rest/nest"; // import ts-rest Nest utilities
import { postsContract } from "@my-org/ts-rest"; // import the contract definitions
import { PostsService } from "./posts.service";

const c = postsContract; // alias for brevity

@Controller()
@TsRest({ jsonQuery: true }) // optional config, e.g., if using JSON in query params
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @TsRestHandler(c.getPost)
  async getPost(@TsRest() { params }: TsRestRequest<typeof c.getPost>) {
    // params will be { id: string } and already validated by Zod (if any schema on params)
    const post = await this.postsService.findById(params.id);
    if (!post) {
      return { status: 200, body: null }; // no post found
    }
    return { status: 200, body: post };
  }

  @TsRestHandler(c.createPost)
  async createPost(@TsRest() { body }: TsRestRequest<typeof c.createPost>) {
    // body is validated against CreatePostSchema
    const newPost = await this.postsService.create(body);
    return { status: 201, body: newPost };
  }
}
```

Let’s unpack this:

- We import our `postsContract` from the shared package.
- We use `@Controller()` without a route prefix here for simplicity (assuming perhaps global prefix or the contract paths are full).
- The `@TsRestHandler(c.getPost)` decorator tells Nest/ts-rest that this method implements the contract’s `getPost` endpoint. The library will handle matching the route and method ("/posts/:id", GET) to this method.
- The method signature uses `@TsRest()` parameter decorator to get an object containing `params`, `body`, etc., based on the request. We also leverage `TsRestRequest<typeof c.getPost>` to get correct typing for the request object.
- We then use a service (`postsService`) to get or create data. Note: by the time our method is called, ts-rest + Zod have **already validated** the input. For example, if `body` for createPost is missing a required field, this method wouldn’t even run; a 400 error would be thrown by the validation automatically. This offloads a lot of manual validation code.
- We return an object with `status` and `body`. ts-rest will ensure this gets converted to an actual Nest HttpResponse. The status must match one of the statuses defined in the contract for that endpoint (so you can’t accidentally return a 418 if you didn’t specify it – TypeScript will enforce the allowed statuses).
- The response body is automatically checked against the response schema (PostSchema in our example). So if our service returns an object that doesn’t conform, we’d catch it during development.

By doing this, the **NestJS controller is succinct and always aligned with the contract**. Adding a new endpoint means updating the contract in the shared package (with its schemas) and then implementing it in the controller with the same name reference.

### Consuming the API in Next.js (Client Side)

On the Next.js frontend, we can use the ts-rest client to call the API in a type-safe way, using the shared contract. The `@ts-rest/core` package’s `initClient` function creates a client object that mirrors the structure of the contract.

For example, continuing with the posts scenario, in a React component or a data utility on the frontend:

```tsx
import { initClient } from "@ts-rest/core";
import { postsContract } from "@my-org/ts-rest";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const postsClient = initClient(postsContract, {
  baseUrl: apiBaseUrl,
  baseHeaders: {
    "Content-Type": "application/json",
    // You can include auth header globally here if needed (as shown earlier)
  },
});

// Using the client to call getPost
async function fetchPost(postId: string) {
  const result = await postsClient.getPost({ params: { id: postId } });
  if (result.status === 200) {
    const postData = result.body;
    // postData is typed as Post | null according to our contract!
    return postData;
  }
  // handle other status cases if necessary
}
```

Key points:

- `initClient(contract, { baseUrl })` creates an object (`postsClient` here) with methods corresponding to each endpoint in the contract (`getPost` and `createPost` in our example).
- To call an endpoint, we call that method with an object containing any needed `params`, `body`, or `query` as defined by the contract.
  - For `getPost`, we needed to provide `params: { id: postId }`.
  - For `createPost`, we would call `postsClient.createPost({ body: { title: "...", body: "..." } })`.
- The result is a discriminated union or an object that contains `.status` and `.body`. We typically check `result.status` to see if it’s 200 (or expected success) and then use `result.body`. This is slightly more verbose than a simple fetch, but it forces you to handle error cases and matches how the server defined responses.
- All data coming back is validated by Zod as well (if the server sent something that doesn’t match the schema, ts-rest would flag it). This rarely happens unless the server is not adhering to the contract, but it’s good for safety.

Because the `postsContract` and others are shared, the `Post` type, the request body type, etc., are all known to the client. Your IDE will auto-complete field names and show errors if you provide the wrong type of data. This greatly reduces mismatches between frontend and backend.

**Additional Client Integrations:** ts-rest also provides integrations with React Query (`@ts-rest/react-query`) if you want to leverage data fetching hooks and caching, and similar for other frameworks. In our project, you could wrap the ts-rest client calls with React Query hooks for convenience, but that’s an optional enhancement. The primary idea is that whether you use plain fetch or a query library, the contract types are there to ensure correctness.

**Summary of ts-rest benefits:** By using ts-rest and Zod:

- We have a **single source of truth** for what our API looks like.
- We **avoid duplicate DTO definitions** in backend and frontend – no need to write separate interface or type for a Post in the frontend and backend; the shared schema covers both.
- We get **runtime validation** on the backend (via Zod) for free, which means we can trust that `postsClient.createPost({ body: ... })` will be validated server-side according to `CreatePostSchema`.
- We get **TypeScript validation** on the frontend, catching mistakes at compile time (e.g., using a wrong field name or forgetting a required field).
- It streamlines documenting the API as well, since the contract can be used to generate OpenAPI docs if needed (ts-rest has an OpenAPI generator too).

When adding new API endpoints:

1. Define it in the contract with proper schemas.
2. Implement it in the NestJS controller using TsRestHandler.
3. Use it on the frontend via the client. (Often, steps 2 and 3 can be done in parallel by different team members since the contract drives the development).

## Scripts and Development Commands

The project comes with a set of NPM/Yarn/PNPM scripts (managed through Turborepo) that help with development, building, and other tasks. Here’s a list of useful commands and what they do:

- **Install Dependencies:**

  ```bash
  pnpm install

  ```

  Installs all dependencies in the monorepo and links workspace packages. Run this after cloning or whenever dependencies change.

- **Development (Frontend & Backend together):**

  ```bash
  pnpm run dev

  ```

  Uses Turborepo to start both the Next.js and NestJS apps in parallel (usually runs `next dev` and `nest start --watch`). This is the main command for local development.

- **Build All Projects:**

  ```bash
  pnpm run build

  ```

  Triggers production builds for all apps and packages. For example, it will compile the NestJS app to JS (in `dist`), and create an optimized Next.js build. Turborepo will orchestrate the build order (shared packages first, then apps).

- **Start in Production Mode:**
  After building, you can run:

  ```bash
  pnpm run start

  ```

  This likely starts the compiled NestJS server (`node dist/main.js`) and the Next.js app (`next start`). Depending on configuration, there might be separate commands (`pnpm run start:web` and `pnpm run start:api`) to start each individually in prod mode. In development we use `dev`, in production you use `build` then `start` (or just use Docker which does build+start internally).

- **Run Tests:**

  ```bash
  pnpm run test

  ```

  Runs the test suites for all projects. If using Jest (common in NestJS and perhaps for React testing), this will find and run tests in `apps/api` and `apps/web`. You might also have more specific scripts like `test:unit` or `test:e2e` depending on how tests are organized.

- **Lint Code:**

  ```bash
  pnpm run lint

  ```

  Runs the linter (ESLint) for all projects to catch code style issues or errors. Keeping the code linted ensures consistency. Similarly, `pnpm run format` might run Prettier to auto-format code.

- **Generate ORM Types (Drizzle):**

  ```bash
  pnpm run generate

  ```

  If configured, this command runs Drizzle’s code generation for schema and migrations (e.g., `drizzle-kit generate`). It reads the schema definitions and produces SQL migration files or type output. Use this when you modify the database schema in code to create new migration files.

- **Run Database Migrations:**

  ```bash
  pnpm run migrate

  ```

  Runs the database migrations against the configured database. This will apply any new migrations to update the schema. Typically uses Drizzle’s migrate command under the hood.

- **Clean Build Artifacts:**

  ```bash
  pnpm run clean

  ```

  (If available) This might delete any compiled files or caches (like removing the `dist` folder in Nest, or the `.next` folder in Next). Useful if you want to ensure a fresh build.

- **Docker Compose (local):**

  ```bash
  docker-compose up --build

  ```

  Although not a package script, this command (run in the project root where the `docker-compose.yml` is) will build and start the Docker containers for the database, API, and web. Add `-d` to run in background. Use this to test the containerized setup.

- **Turbo Specific:**
  If you want to run a specific task with turbo manually, you can use:

  ```bash
  npx turbo run <task> --filter=<project>

  ```

  e.g., `npx turbo run build --filter=api` to only build the api, or adding `--parallel` to run tasks in parallel. The package scripts already cover common cases, but turbo can be invoked for advanced use (like generating a graph of tasks or checking what will be cached).

Typically, you will mainly use `dev`, `build`, `test`, and `lint` during day-to-day development. The others are for more specific needs (database setup or after pulling changes).

**Note:** The `package.json` at the root might use Turborepo to alias these commands. For example, `"dev": "turbo run dev --parallel"` meaning it looks at each workspace package that has a `dev` script and runs them in parallel. Each app/package has its own scripts too (for example, `apps/api/package.json` might have `start:dev`, `build`, etc.). As a developer, you can usually call the root scripts and let Turborepo handle it, but if needed, you can run individual package scripts by either `cd` into that directory or using the filter as shown.

## Development Tips and Best Practices

Building a full-stack project can be complex. Here are some tips and best practices to maintain code quality, ensure scalability, and follow a clean architecture:

- **Maintain a Clean Architecture:** Separate concerns in your codebase.
  - In the **backend (NestJS)**, follow Nest’s modular architecture. Keep your controllers lean – they should mainly handle request/response and delegate to services. Put business logic in service classes. If the service logic grows complex, consider splitting logic into providers or even using a repository pattern (e.g., a data access layer that uses Drizzle calls, so your service is abstracted from the ORM details).
  - In the **frontend (Next.js)**, organize your code with separation of UI and data logic. For example, have presentational components that just display data, and container components or hooks that fetch data (using ts-rest client or React Query). This makes components more reusable and easier to test.
  - **Shared code:** Leverage the monorepo to share anything that multiple parts of the app use. We already share API contracts. You can also share utility functions, validation logic, or even UI components (if you create a `packages/ui` library). This avoids duplication and inconsistencies.
- **Consistent Coding Style:** Adhere to the coding standards set by the project.
  - Run the linter (`pnpm lint`) often to catch issues. Fix any warnings or errors.
  - Use Prettier (if configured) to auto-format code. This keeps the style consistent (quotes, spacing, etc.) across different contributors.
  - Take advantage of TypeScript’s capabilities. Define interfaces or types for complex objects rather than using `any`. The stronger your typing, the more errors you catch at compile time.
  - In commit messages or PRs, keep changes focused and described clearly, which helps in code reviews.
- **Error Handling and Validation:** We use Zod to validate inputs at the API boundary – make sure to define schemas thoroughly so we catch bad data early.
  - On the backend, handle errors gracefully. For example, if a database query fails or returns not found, respond with appropriate HTTP status (404, 500, etc.). The contract can include error responses if needed.
  - On the frontend, anticipate error states (e.g., display a message if a fetch fails). Because the ts-rest client forces you to consider the status, you’re already nudged to handle non-200 responses.
  - Use NestJS exception filters or interceptors for consistent error responses (e.g., you might have an interceptor to format Zod validation errors into a nice JSON reply).
- **Testing:** Aim to write tests for both backend and frontend as the project grows.
  - **Backend tests:** NestJS provides a testing utility to create a module with dependencies. You can write unit tests for services (mock the Drizzle database calls using an in-memory approach or a test database). You can also write integration tests for controllers using Supertest to make HTTP calls against a running Nest server (possibly with an SQLite or a Dockerized Postgres for test).
  - **Frontend tests:** Use React Testing Library and Jest to test React components and pages. Verify that components render correctly given certain props or state. If you have complex logic in hooks, test those in isolation.
  - **Contract tests:** Since the client and server share contracts, you normally wouldn't need to test the contract itself (it’s just types). But you might test that certain endpoints behave correctly end-to-end (call the real API from a fetch and see expected result).
  - Set up CI (Continuous Integration) to run tests and lints on every push, if possible. This ensures code quality for every change.
- **Performance Considerations:**
  - Using Fastify for Nest gives a performance boost out of the box. Keep an eye on any heavy computations in requests – if something is slow, consider moving it to a background job or optimizing the query (Drizzle gives you control over SQL, utilize indexes in Postgres where necessary).
  - Enable caching for frequently requested data. You could use Nest’s built-in caching module or an external cache like Redis if needed. For example, cache results of expensive queries for a short time.
  - In Next.js, use built-in features like automatic static optimization or incremental static regeneration for pages that don’t need to be always dynamic. If a page shows data that doesn’t change per request, consider using `getStaticProps` or caching data on the server.
  - Use code-splitting in Next.js to avoid shipping unnecessary JS to the client. Next does this by route automatically, but if you have large components or heavy libraries, consider dynamic imports.
- **Scaling and Deployment:**
  - Because the frontend and backend are separate services (even though in one repo), you can scale them independently. For example, if the API becomes a bottleneck, you can run multiple instances of the NestJS container behind a load balancer. Ensure the statelessness of the API (with JWT, our server is stateless – no sessions stored on one instance) to allow horizontal scaling.
  - The Next.js app can also be scaled or even deployed to a CDN (if mostly static) or serverless platform. On a VPS with Docker, you might simply run another container for web if needed. Next’s performance can be improved by enabling compression (serve via a proxy like Nginx that compresses responses) and using a CDN for assets.
  - Keep an eye on the database when scaling – a single Postgres instance can handle a lot, but you might need to optimize queries or add indexes as data grows. For very large scale, consider read replicas or a migration to a distributed database, but that’s beyond initial scope.
  - Use monitoring tools in production. For instance, enable logging in NestJS (Fastify’s pino logger or Nest’s logger) and aggregate logs using a tool (like Winston or a cloud logging service). Consider using an application performance monitoring (APM) tool or error tracking service (like Sentry) to catch exceptions in both backend and frontend.
- **Workflow Tips:**
  - Leverage Turborepo’s caching: if you notice that builds or tests are slow, Turborepo can cache outputs. Make sure to configure `turbo.json` to cache heavy tasks (like the Next build) and to set up remote caching if working in a team (so CI can share cache with dev machines, etc.).
  - When adding a new dependency that is used by both apps, consider whether it belongs in a shared package. For example, if you add a utility library or a set of types that both front and back might use, you could create a `packages/utils` to hold that.
  - Regularly update dependencies to keep the stack modern, but do so carefully (maybe one at a time and test). Especially keep an eye on security updates for things like Passport, JWT, or database libraries.
- **Documentation and Onboarding:** Keep this documentation updated as the project evolves! If you add a significant feature or change how something is set up (e.g., move from Passport to a different auth system, or add a new shared package), update the relevant section here. Good documentation will save future developers (and your future self) a lot of time.

By following these practices, the project will remain maintainable, and new developers can quickly get up to speed. This stack is quite powerful – with Next.js and NestJS you have a robust foundation for building almost any web application. Happy coding!
