FROM denoland/deno:2.1.7

# Temporarily switch to root to install Node.js and Prisma CLI
USER root

# Install Node.js 20.x and npm
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@10.2.4 prisma \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories and set permissions
RUN mkdir -p /home/deno/.npm && \
    chown -R deno:deno /home/deno && \
    mkdir -p /app/node_modules && \
    chown -R deno:deno /app

# Switch to deno user
USER deno

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY --chown=deno:deno deno.json deno.lock ./

# # Copy wait-for-it script and entrypoint
# COPY --chown=deno:deno docker-entrypoint.sh wait-for-it.sh ./
# RUN chmod +x docker-entrypoint.sh wait-for-it.sh

# Set npm cache directory to a location where deno user has access
ENV NPM_CONFIG_CACHE=/home/deno/.npm

WORKDIR /prisma

COPY --chown=deno:deno prisma/schema.prisma ./

WORKDIR /app

# Cache dependencies
RUN deno cache main.ts

# Copy source files
COPY --chown=deno:deno . .

# Generate Prisma Client
RUN npm install prisma && npx prisma generate

# The entrypoint script will handle migrations
# ENTRYPOINT ["/docker-entrypoint.sh"]

# The main application command
CMD ["deno", "task", "dev"]