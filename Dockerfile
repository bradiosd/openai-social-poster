# Set base Docker image
FROM node:16-alpine

# Set working directory within Docker image
WORKDIR /var/app

# Install NPM packages and copy
COPY . .
RUN npm ci

# Expose ports
EXPOSE 80

# NextJS application start
CMD npm run start