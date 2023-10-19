FROM node:18

WORKDIR /

COPY package*.json ./
RUN npm install

COPY . .

RUN cd client && npm install & npm run build

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "run", "run"]