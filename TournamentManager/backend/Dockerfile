FROM node:alpine

WORKDIR /app
RUN apk add --no-cache bash libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

# entrypoint will run prisma generate & migrations
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/index.js"]