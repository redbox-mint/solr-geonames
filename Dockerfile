FROM node:23.11.0 AS build

ENV NODE_ENV=production
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN echo "Australia/Brisbane" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

ENV INSTALL_PATH="/opt/solr-geonames"

RUN mkdir -p "${INSTALL_PATH}"

WORKDIR "${INSTALL_PATH}"

# Copy package.json & package-lock.json files and install
COPY --chown=node:node *.json "${INSTALL_PATH}/"
RUN npm ci --strict-peer-deps --ignore-scripts

# Copy the source from the host
COPY --chown=node:node build/src/ "${INSTALL_PATH}/build/src/"

USER node

ENTRYPOINT ["node", "build/src/index.js"]
