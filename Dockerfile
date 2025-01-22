FROM denoland/deno:2.1.7

WORKDIR /app

# Cache the dependencies
COPY *.ts .
RUN deno cache main.ts

# Added --allow-env flag for environment variables access
CMD ["deno", "run", "--allow-net", "--allow-env", "main.ts"]