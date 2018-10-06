# Cyborgs LMS

Learning Management System by Team Cyborgs.

## Starting Development

### Frontend

#### Installing node modules

```bash
npm install
```

#### Serving the project for development

```bash
gulp
```
or on the IDE you are using, run the default task of the gulp file.

### Docker

#### Build an image: 
```bash
docker build . -t shilpa-services:$(git rev-parse --short HEAD) -t shilpa-services:latest
```
#### Run the services: 
```bash
docker-compose up
```



#### Implementation

Always follow the implemented file structure to avoid conflicts.

Include all dependencies within your functional scope. i.e. by including them in your module.

Use the helpers to implement all the communications with the backend. i.e. for all the services, factories ... etc;

Create reusable components like directives when the same elements and logics are to be used in serveral instances.

Comment where necessary.

IMPORTANT: Please follow coding standards. 
