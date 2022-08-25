FROM node:16-alpine

WORKDIR /app

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
    chromium \
    harfbuzz \
    xvfb \
    "freetype>2.8" \
    ttf-freefont \
    nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV SERVER_PORT 4000
ENV SERVER_HOST 0.0.0.0
ENV SERVER_TIMEOUT 5000

COPY package.json /app/

RUN npm install

COPY . /app/

EXPOSE 4000

CMD ["npm", "start"]
