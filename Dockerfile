FROM node:18

WORKDIR /usr/src/app

# Copy package.json file to the working directory
COPY package.json ./ package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .