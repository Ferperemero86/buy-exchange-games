FROM node:lts-alpine
WORKDIR /opt/app

# system dependencies
# https://github.com/kelektiv/node.bcrypt.js/issues/577
RUN apk update && apk upgrade \
  && apk add --no-cache git \
  && apk --no-cache add --virtual builds-deps build-base python

# javascript dependencies
ADD package.json package-lock.json ./
RUN npm ci

# build application
ADD . .
RUN npm run build

# wrap up
EXPOSE 3000/tcp
CMD npm run start