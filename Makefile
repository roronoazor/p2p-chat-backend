
# Makefile for NestJS Chat Application

# Command to install dependencies
install:
	npm install

# Command to run database migrations
migrate:
	npx prisma migrate dev

# Command to deploy the database
deploy:
	npx prisma db push

# Command to start the application
start:
	npm run start

# Command to start the application in development mode
start-dev:
	npm run start:dev

# Command to build the application
build:
	npm run build

# Command to lint the application
lint:
	npm run lint

# Command to format the code
format:
	npm run format
