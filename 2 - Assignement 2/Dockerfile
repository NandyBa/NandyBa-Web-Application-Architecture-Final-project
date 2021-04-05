FROM node:10-alpine
WORKDIR /app
COPY package.json .
COPY server.js .
COPY /public ./public
RUN npm install

RUN mkdir -p /public/images

# Run the server as a non-root user
RUN adduser -D myuser
USER myuser

EXPOSE 3000

CMD ["node", "server.js"]