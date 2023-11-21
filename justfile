TEST_SERVICE := "test"
BACKEND_SERVICE := "back"
DATABASE_SERVICE := "database"

MIGRATE_COMMAND := "npx prisma migrate dev"
POPULATE_COMMAND := "npx prisma db seed"
DATABASE_ACCESS_COMMAND := "mysql -u root -p"

up *FLAGS:
    @docker compose up -d {{FLAGS}}

re *FLAGS:
    @docker compose down && docker compose up -d {{FLAGS}}

down:
    @docker compose down

build SERVICE *FLAGS:
    @docker compose build {{SERVICE}} {{FLAGS}}

logs SERVICE:
    @docker compose logs {{SERVICE}} -f

exec +COMMAND:
    @docker compose exec {{BACKEND_SERVICE}} {{COMMAND}}

prisma +COMMAND:
    @docker compose exec {{BACKEND_SERVICE}} npx prisma {{COMMAND}}

shell SERVICE SHELL='sh':
    @docker compose exec -it {{SERVICE}} {{SHELL}}

reset:
    @docker compose down --volumes

test:
    @docker compose up {{TEST_SERVICE}} --build

migrate:
    @docker compose exec {{BACKEND_SERVICE}} {{MIGRATE_COMMAND}}

db:
    @docker compose exec -it {{DATABASE_SERVICE}} {{DATABASE_ACCESS_COMMAND}}

populate:
    @docker exec {{BACKEND_SERVICE}} {{POPULATE_COMMAND}}
