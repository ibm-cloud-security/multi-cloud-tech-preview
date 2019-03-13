FROM node:8-alpine

ADD . /app

RUN cd app && npm install

EXPOSE 3000

WORKDIR "/app"

CMD ["npm", "start"]
