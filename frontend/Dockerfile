# Use Node 20 official image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Start the dev server with host 0.0.0.0 so it's accessible outside the container
CMD ["npm", "run", "dev"]
