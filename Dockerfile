# syntax=docker/dockerfile:1.4
FROM node:22.14.0

RUN npm install -g pnpm@10.7.0

WORKDIR /app

COPY pnpm-lock.yaml .
RUN pnpm fetch

COPY . .
RUN pnpm install --offline --ignore-scripts --frozen-lockfile

ARG NODE_ENV=production
#ARG SENTRY_AUTH_TOKEN
ARG SOURCE_VERSION
ENV NODE_ENV=${NODE_ENV} 

RUN pnpm sh build
RUN pnpm b prepare
RUN pnpm b build


RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    bash -c " \
      export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
      pnpm b sentry && \
      pnpm w build \
    "


FROM node:22.14.0-alpine

COPY --from=0 /app/package.json /app/package.json
COPY --from=0 /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=0 /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml

COPY --from=0 /app/webapp/package.json /app/webapp/package.json
COPY --from=0 /app/backend/package.json /app/backend/package.json
COPY --from=0 /app/shared/package.json /app/shared/package.json

COPY --from=0 /app/webapp/dist /app/webapp/dist
COPY --from=0 /app/backend/dist /app/backend/dist
COPY --from=0 /app/shared/dist /app/shared/dist
COPY --from=0 /app/backend/src/prisma /app/backend/src/prisma

WORKDIR /app

RUN npm install -g pnpm@10.7.0
RUN pnpm install --ignore-scripts --frozen-lockfile --prod

RUN pnpm --filter @brightideas/backend exec prisma generate

ARG SOURCE_VERSION
ENV SOURCE_VERSION=${SOURCE_VERSION}



CMD ["pnpm", "--filter", "@brightideas/backend", "run", "start"]