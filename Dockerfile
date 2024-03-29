FROM node as builder
WORKDIR /usr/app
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm install net
COPY . .
CMD ["npm", "run", "dev"]
# EXPOSE 5173