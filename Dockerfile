FROM particle/buildpack-base-node:0.1.0-node_v6.2.1

COPY bin /bin
WORKDIR /app
# Copy package.json first to cache npm install
COPY app/package.json /app
RUN npm install
COPY app /app
