FROM node:18
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .
RUN ls -l

EXPOSE 5173

CMD ["npm", "run", "dev"]