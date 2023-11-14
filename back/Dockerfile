FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm clean-install

COPY . .

RUN npx prisma generate

EXPOSE 3000

# Enable file watching inside the container (hot-reload)
ENV CHOKIDAR_USEPOLLING=true

CMD npm run dev
