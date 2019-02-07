FROM node:11.8.0-alpine

WORKDIR /usr/app

COPY ./src/ ./src/ 

COPY package*.json nodemon.json tsconfig.json startup.sh ./

RUN ls

RUN apk update && apk upgrade \
	&& apk add --no-cache git \
	&& apk --no-cache add --virtual builds-deps build-base python \
	&& npm install -g node-gyp node-pre-gyp && npm install --production  \
	&& npm rebuild bcrypt --build-from-source \
	&& sed -i s/\r//g startup.sh

EXPOSE 4955

EXPOSE 9222

ENTRYPOINT ["sh","/usr/app/startup.sh"] 