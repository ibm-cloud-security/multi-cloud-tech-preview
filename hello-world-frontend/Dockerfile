FROM node:8
WORKDIR "/app"
ADD . /app
RUN npm install
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
EXPOSE 3000
CMD ["npm", "start"]
