from node:alpine

# copy ./app

workdir /app  
#creates a base folder for my app

copy app/index.js  
# copies the apps config file

cmd node start

