# Star Sotre

## Descrição

Este projeto é uma API desenvolvida com Node.js e Express, organizada em camadas (Repository, Controllers, Entities), e utilizando um banco de dados PostgreSQL configurado com Docker Compose. O objetivo desta API é fornecer os recursos necessários da camada de persistencia para o client app.

## Estrutura do Projeto

```bash
/src
    ├── app
    │   ├── controllers
    │   │   └── user
    │   │        └── UsersController.ts
    │   ├── entities
    │   │   └── userEntity.ts
    │   ├── middlewares
    │   │   └── authMiddleware.ts
    │   ├── repositories
    │   │   └── UsersRepository.ts
    ├── database
    │   │   └── index.ts
    │   │   └── schema.ts
    ├── index.ts
    └── routes.ts

docker-compose.yml
Procfile
```

## Descrição das Camadas

- Controllers: Responsável por receber as requisições HTTP, processar os dados necessários e chamar os repositories (Entendo que deveria ter uma camada de services).
- Entities: Define as estruturas de dados (modelos) que representam as entidades do banco de dados.
- Repositories: Interage diretamente com o banco de dados, executando operações CRUD.

## Pré-requisitos

- Node.js
- Docker

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/carolngr/star-store-api.git
   cd star-store-api

   ```

2. **Configure as variáveis de ambiente:**

- Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:

  ```bash
       DATABASE_HOST=localhost
       DATABASE_PORT=5432
       DATABASE_USER=root
       DATABASE_PASSWORD=root
       DATABASE_DATABASE=star-store
  ```

## Executando a Aplicação

### Usando Docker Compose

1. **Inicie o PostgreSQL com Docker Compose:**

   ```bash
   docker-compose up -d

   ```

2. **Inicie o servidor:**

   ```bash
   npm start
   ```

3. **Inicie o servidor:**

   ```bash
   http://localhost:3001
   ```

4. **JSON collection insomnia:**

   [Link para a collection](indominia.json)

