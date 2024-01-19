# Stage 1: Build Stage
FROM node:iron-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the library dependencies
RUN npm install
RUN npm run build

# Copy the entire library code to the working directory
COPY . .
