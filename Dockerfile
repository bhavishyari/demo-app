FROM public.ecr.aws/h4m7c9h3/baseimages:12

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm install

COPY ./ ./

RUN npm run build

CMD npm run start:dev

EXPOSE 3000
