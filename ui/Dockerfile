FROM node:lts-alpine

ARG FOLDER=/ui

RUN mkdir -p $FOLDER

COPY . /ui/.

#CMD ["cd", "ui"]

WORKDIR $FOLDER

# Copy CA certificate
# COPY your-ca-certificate.crt /usr/local/share/ca-certificates/your-ca-certificate.crt

# # Update CA certificates
# RUN update-ca-certificates

# # Configure npm to use the custom CA
# RUN npm config set cafile /usr/local/share/ca-certificates/your-ca-certificate.crt

RUN rm -rf node_modules
RUN rm -rf dist

# Disable strict SSL
RUN npm config set strict-ssl false
RUN npm install vite
RUN npm install react react-dom
RUN npm install --save-dev @types/react @types/react-dom 
# RUN npm install --save-dev @types/vite
RUN npm install react-use-websocket
RUN npm install
# RUN npm run build

EXPOSE 4173 


CMD ["npm", "run", "start"]
