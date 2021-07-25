# Local docker setup

```bash
docker-compose -f docker-compose.local.yml up -d
docker-compose -f docker-compose.local.yml ps
docker-compose -f docker-compose.local.yml restart migration
```

Or if you've exported environment variable COMPOSE_FILE=docker-compose.local.yml
then

```bash
docker-compose up -d
docker-compose ps
docker-compose restart migration
```

## Styleguide

Always prefer async/await over callbacks, or .then promise
