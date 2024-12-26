# Use the official Node.js image as the base image
FROM node:18.18.0 AS builder-backend

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN npm install ts-node -g
RUN yarn install
# Copy the rest of the application code to the working directory
COPY . .
RUN yarn build

FROM node:18.18.0  AS backend-prod
WORKDIR /app
COPY --from=builder-backend /app/dist /app/dist
COPY package.json yarn.lock ./
RUN yarn install --production
CMD ["yarn", "start:prod"]