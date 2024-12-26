FROM node:18

WORKDIR /usr/src/app

# Copy package.json and yarn.lock files to the working directory
COPY package.json package.lock ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .