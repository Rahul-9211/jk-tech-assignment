   # Use the official Node.js image as a base
   FROM node:18

   # Set the working directory
   WORKDIR /usr/src/app

   # Copy package.json and package-lock.json
   COPY package*.json ./

   # Install dependencies
   RUN npm install

   # Rebuild bcrypt for the correct architecture
   RUN npm rebuild bcrypt

   # Copy the rest of the application code
   COPY . .

   # Build the application
   RUN npm run build

   # Expose the application port
   EXPOSE 3000

   # Start the application
   CMD ["npm", "run", "start:prod"]