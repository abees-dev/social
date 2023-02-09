FROM node:latest as builder
WORKDIR /usr/app
COPY . /usr/app

RUN yarn

RUN yarn build

FROM nginx:latest
COPY --from=builder /usr/app/build /usr/share/nginx/html
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]