ARG SOURCE_IMAGE_TAG=1.0.0
ARG NODE_VERSION=18

#FROM artefakt.dev.sbb.berlin:5000/sbb/base-images/nodejs-base:$SOURCE_IMAGE_TAG
FROM node:${NODE_VERSION}-alpine

ENV SERVICE_NAME=hsp-fo-app

WORKDIR /${SERVICE_NAME}

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Run the application.
CMD ["node", "server/start.js"]

# Expose the port that the application listens on.
EXPOSE $APP_PORT