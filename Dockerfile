# https://hub.docker.com/_/node/
FROM node:6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN yarn install && yarn cache clean
RUN yarn global add foreman
COPY . /usr/src/app

CMD [ "nf", "start" ]
