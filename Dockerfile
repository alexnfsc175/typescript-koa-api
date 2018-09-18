FROM node:10.8.0-alpine

WORKDIR src/

COPY package*.json  startup.sh src/

RUN npm install -g node-gyp node-pre-gyp && npm install --production --silent \
	&& npm rebuild bcrypt --build-from-source 

COPY ./dist /src

RUN apk update && apk upgrade \
	&& apk add --no-cache git \
	&& apk --no-cache add --virtual builds-deps build-base python \
	&& sed -i s/\r//g src/startup.sh

EXPOSE 3000

EXPOSE 9222

ENTRYPOINT ["sh","/src/startup.sh"] 