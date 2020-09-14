ARG TAG=12-alpine
FROM node:$TAG

WORKDIR /app

CMD ["build"]

ENTRYPOINT ["npm", "run"]
