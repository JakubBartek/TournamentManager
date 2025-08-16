FROM node:alpine

WORKDIR /app

RUN apk update && apk upgrade

COPY package.json package-lock.json ./
RUN npm install && npm audit fix

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 3000

RUN npm run build

CMD ["node", "dist/index.js"]