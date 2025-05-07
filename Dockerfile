FROM node:21-alpine

WORKDIR /usr/src/app

# Instalar dependências de compilação necessárias
RUN apk add --no-cache python3 make g++ gcc

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"] 