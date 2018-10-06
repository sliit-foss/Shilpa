FROM node:8.12.0
COPY . /app
RUN ls -d /app/services/*/ | xargs -n1 -I 'FOLDER_NAME' sh -c 'cd /FOLDER_NAME && npm install'