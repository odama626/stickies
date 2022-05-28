FROM node:current-alpine
ARG BUILD_CONTEXT

RUN npm i -g lerna
WORKDIR /package/stickies
COPY package.json .
COPY yarn.lock .
COPY lerna.json .
COPY .yarnrc.yml .
COPY .yarn/ .yarn/
# RUN yarn set version stable
# RUN yarn plugin import workspace-tools
COPY ./packages/ packages/
# RUN yarn workspaces focus
# RUN lerna bootstrap
RUN yarn install
ARG APP_DIR=./packages/$BUILD_CONTEXT
# RUN echo ${APP_DIR}
WORKDIR ${APP_DIR}
RUN npx prisma generate
# RUN echo $(pwd)
# COPY ./packages/$BUILD_CONTEXT/ .
# RUN cat package.json
RUN yarn build


CMD ["yarn", "start"]
