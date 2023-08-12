FROM node:16

WORKDIR /app

COPY . .

RUN npm install

COPY . .

# Start the application
CMD [ "npm", "run", "start" ]