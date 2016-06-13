FROM particle/buildpack-base-node:node_v6.2.1

COPY bin /bin
WORKDIR /app
# Copy package.json first to cache npm install
COPY app/package.json /app
RUN /bin/run-in-nvm npm install
COPY app /app
