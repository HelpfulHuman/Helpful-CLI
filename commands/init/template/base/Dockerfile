{% if tags.javascript -%}
FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
{% if tags.server -%}
COPY server /usr/src/app/server/
{%- endif %}

RUN npm install

EXPOSE 5000
CMD ["npm", "start"]
{%- endif %}