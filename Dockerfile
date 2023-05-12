# base image
FROM node:16

# create and set working directory
WORKDIR /usr/src/app
# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the application
COPY . .

# start the consumer
CMD ["npm", "start"]