# Use the official Playwright image for Node.js and browsers
FROM mcr.microsoft.com/playwright:v1.41.2-jammy

WORKDIR /e2e

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the test files
COPY . .

# Install browsers (if not already in the base image)
RUN npx playwright install --with-deps

# Default command to run tests
CMD ["npx", "playwright", "test"] 