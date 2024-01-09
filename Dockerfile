# Stage 1: Building the code
FROM node:20.9.0 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Replace API URL in config.js
ARG API_BASE_URL
RUN sed -i 's,REPLACE_API_URL,'"$API_BASE_URL"',g' src/configuration/config.js

RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the React build from Stage 1
COPY --from=build /app/build /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy a new configuration file from your project
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

