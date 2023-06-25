FROM public.ecr.aws/docker/library/node:18.16.0-alpine3.16 as dev

# install dependencies to build native nodejs dependency modules
RUN apk --no-cache add bash python3 make cmake g++

# set default work directory which will be root of all following commands in this stage
WORKDIR /app

# copies versioning files to download same dependencies
COPY package*.json yarn.lock ./

# add node_modules bin to PATH to find the nx executable
ENV PATH=/app/node_modules/.bin:$PATH
ENV HOST=0.0.0.0

# default command to run when starting container stage
CMD ["nx", "serve", "api"]

# create new stage based on dev
FROM dev as build

# install dependencies
RUN yarn install --ignore-optional

# copy all code in container as we are not relying on docker compose volume mount to load code
COPY . .

# build distributable
RUN nx build api

# lightweight production image
FROM public.ecr.aws/docker/library/node:18.16.0-alpine3.16 as production

# set work directory
WORKDIR /app

# copy dependencies files
COPY package*.json yarn.lock ./

# install only production dependencies
RUN yarn install --production=true --ignore-optional

# copy built js files from build stage
COPY --from=build /app/dist ./dist

# set default run command
CMD ["node","dist/index.js"]
