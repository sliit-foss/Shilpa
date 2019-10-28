FROM node:alpine

WORKDIR /usr/app/src

COPY ./package.json ./package.json

RUN npm i 

COPY . .

CMD ["npm", "start"];