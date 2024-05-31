FROM node:20

# Set the working directory in the Docker image
WORKDIR /usr/src/app


# Copy the current directory contents into the container at /usr/src/app
COPY . .

RUN npm install

# Run index.js with Node.js
ENTRYPOINT [ "node", "index.js" ]
