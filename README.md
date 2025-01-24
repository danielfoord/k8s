Run tests
```
docker compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from deno-test
```

Migrate schema
```
npx prisma migrate dev --name init
```

```
npx prisma generate
```