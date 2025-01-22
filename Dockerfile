FROM denoland/deno:2.1.7

# Create a non-root user
USER deno

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY --chown=deno:deno deno.json deno.lock ./

# Cache dependencies (adjust the path to match your main.ts location)
RUN deno cache app/main.ts

# Copy source files
COPY --chown=deno:deno . .

# The watch command for development (adjust the path to match your main.ts location)
CMD ["deno", "task", "dev"]