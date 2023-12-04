FROM node:18.18.2-alpine

WORKDIR /app

COPY entrypoint.sh .
COPY test-entrypoint.sh .

COPY package.json .
COPY package-lock.json .

RUN npm clean-install

COPY . .

EXPOSE 3000

# Enable file watching inside the container (hot-reload)
ENV CHOKIDAR_USEPOLLING=true

ENTRYPOINT [ "/app/entrypoint.sh" ]
