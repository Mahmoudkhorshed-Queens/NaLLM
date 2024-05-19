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


# Disable strict SSL
RUN npm config set strict-ssl false

RUN npm install

EXPOSE 4173 

RUN npm run build

CMD ["npm", "run", "preview"]
