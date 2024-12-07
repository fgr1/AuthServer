# AuthServer

Este projeto é um servidor de autenticação desenvolvido em Node.js com Express e Prisma, utilizando um banco de dados PostgreSQL. Ele é usado para autenticar usuários e gerenciar votos em filmes e diretores.

---

## Pré-requisitos

- **Node.js** (v16 ou superior)
- **Docker** e **Docker Compose** para subir o banco de dados
- **PostgreSQL** (se não utilizar Docker)

---

## Configuração do Projeto

### 1. Subir o Banco de Dados

Crie o aquivo ***.env*** na raiz do projeto com o conteúdo:

```bash
DATABASE_URL: "postgresql://citus:MySecret1@db:5432/mydb?schema=public"
```

Suba o banco de dados utilizando o `docker-compose`:

```bash
docker-compose up -d
```
### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar o Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Popular o Banco de Dados (Seed)

Precisa ter conexão com internet

```bash
npm run seed
```

### 5. Iniciar o Servidor

Escolha uma das opções abaixo para iniciar o servidor:

Localmente
Para rodar o servidor localmente em modo de desenvolvimento:

```bash
npm run dev
```

Em Container Docker
#### 1. Build da Imagem Docker:

```bash
docker build -t oscar_server .
```
#### 2. Rodar o Container:

```bash
docker run --name oscar_app_server -p 3000:3000 --link oscar_db oscar_server
```
### 6. Verificar os dados
Depois de rodar o seed, você pode usar o Prisma Studio para verificar se os dados foram inseridos no banco:

```bash
npx prisma studio
```