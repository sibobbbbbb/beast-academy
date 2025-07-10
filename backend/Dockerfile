FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "cd db/prisma && npx prisma generate && cd /app && npx nodemon --legacy-watch --verbose index.js"]