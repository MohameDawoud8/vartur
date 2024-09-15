# Use Node.js 20 with Alpine Linux as the base image, which is lightweight
FROM node:20-alpine AS base

# STAGE 01
# Create a separate stage for installing dependencies, making it easier to cache
FROM base AS deps

# Install the libc6-compat package to ensure compatibility with certain Node.js binaries
# This may be necessary for certain dependencies or build processes.
RUN apk add --no-cache libc6-compat

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the container
# These files are required to install dependencies, and by copying only these first,
# Docker can cache the dependencies layer if they don't change.
COPY package.json package-lock.json* ./

# Install the dependencies using npm ci, which ensures a clean, deterministic install
# and is faster and more suitable for CI/CD environments compared to npm install.
RUN npm ci

# STAGE 02
# Create a new stage for building the application
FROM base AS builder

# Set the working directory for the build process
WORKDIR /app

# Copy the node_modules from the previous 'deps' stage to avoid reinstalling dependencies
# This helps speed up the build process by reusing installed dependencies.
COPY --from=deps /app/node_modules ./node_modules

# Copy the entire project directory into the container for building
COPY . .

# Generate Prisma client files
# This is part of the Prisma ORM setup and needs to be done before building the app.
RUN npx prisma generate

# Build the Next.js application
# This step compiles the application into a production-ready version.
RUN npm run build

# STAGE 03
# Create a final stage for the production image
FROM base AS runner

# Set the working directory for the production environment
WORKDIR /app

# Set the environment variable to production, which tells Node.js to optimize for production performance
ENV NODE_ENV production

# Create a system group and user to run the Next.js application securely
# Running as non-root is a security best practice.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder from the build stage to make it available in production
COPY --from=builder /app/public ./public

# Set correct permissions for the prerender cache by creating and assigning ownership of the .next folder
# The .next folder stores build artifacts that Next.js uses to serve content.
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size by copying only necessary files
# Next.js output tracing ensures that only the files required for production are copied.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user (nextjs) to run the application securely
USER nextjs

# Expose port 3000 to the host, which is the default port for Next.js applications
EXPOSE 3000

# Set the PORT environment variable for the application to use
ENV PORT 3000

# Run the Next.js server using the compiled standalone server.js file
# Setting HOSTNAME="0.0.0.0" makes the server accessible from outside the container.
CMD HOSTNAME="0.0.0.0" node server.js
