# 1️⃣ Use official Node.js LTS image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files
COPY package*.json ./

# 4️⃣ Install all dependencies (dev included, since you need jest)
RUN npm install

# 5️⃣ Copy the rest of the app
COPY . .

# 6️⃣ Expose the port if your app listens (optional)
# EXPOSE 3000

# 7️⃣ Start the app
CMD ["node", "cart.js"]
