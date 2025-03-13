Run tests
```
docker-compose down --volumes && docker compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from deno-test
```

Migrate schema
```
npx prisma migrate dev --name {migration_name}
```

```
npx prisma generate
```
