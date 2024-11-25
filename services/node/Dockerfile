FROM node:22.2.0-alpine AS builder

COPY ./app /home/node/app
WORKDIR /home/node/app

# Just in case node_modules is left locally in development
RUN rm -rf node_modules || true
RUN yarn --production --frozen-lockfile
RUN rm * || true

FROM dzek69/nodemin:22.2.0-node

COPY --from=builder /home/node/app /home/node/app
RUN chown -R node:node /home/node
WORKDIR /home/node/app

USER node

CMD ["node", "/home/node/app/src"]
