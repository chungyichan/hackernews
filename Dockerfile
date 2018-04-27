#imagen base
FROM node:9.6.1

#Colocar directorio de trabajo
RUN mkdir -p /home/app
WORKDIR /home/app

# Path para los binarios de node
ENV PATH /home/app/node_modules/.bin:$PATH

# Instala create y cache de paquetes
COPY package.json /home/app/package.json
RUN npm i -g npm && npm install --silent && npm install react-scripts -g --silent && npm install axios

# Corre el programa
CMD ["npm","start"]
