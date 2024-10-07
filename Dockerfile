# Use the official Node.js image
FROM node:20.17.0

# Set the working directory inside the container
WORKDIR /src

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using pnpm
RUN pnpm install && ls -la node_modules

# Copy the rest of the application code to the working directory
COPY . .

# Check the contents of the working directory
RUN ls -la /src

# Build the Next.js application
RUN pnpm run build

# Set environment variables
ENV HOST 0.0.0.0
ENV PORT 9777

# Expose port 81
EXPOSE 9777

# Command to start the Next.js application
CMD ["pnpm", "run", "start"]
