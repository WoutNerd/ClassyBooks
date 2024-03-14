FROM node:20.9-alpine3.17

WORKDIR /

COPY package*.json ./
RUN npm install

COPY . .
WORKDIR /client
RUN npm install
RUN npm install pm2 -g
RUN npm run build

WORKDIR /

ENV PORT=8080

EXPOSE 8080

CMD ["pm2", "start", "./server/index.js", "--no-daemon"]