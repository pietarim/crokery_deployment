FROM node:18

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

ENV DOCKERIZE_VERSION v0.7.0

RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*

EXPOSE 3001

CMD ["/bin/sh", "-c", "dockerize -wait tcp://postgress:5432 -timeout 60s && ./entrypoint.sh"]