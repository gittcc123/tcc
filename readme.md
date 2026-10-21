# Template aplicação Node.js Typescript com Express e EJS

Este projeto é uma aplicação Node.js utilizando o framework Express e o motor de templates EJS para renderização de páginas dinâmicas.

## Tecnologias Utilizadas
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)

## Instalação

### 1. Clone o repositório
```sh
git clone <url-do-repositorio>
cd template-express-ejs
```

### 2. Instale as dependências
```sh
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo de exemplo e configure suas credenciais:
```sh
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
DB_PORT=5432

# Configurações da Aplicação
PORT=3333
SESSION_SECRET=sua_chave_secreta_aqui
```

### 4. Configure o banco de dados
Execute o script SQL `banco.sql` no seu PostgreSQL para criar as tabelas necessárias.

### 5. Inicie o servidor
```sh
npm run dev
```

O servidor estará rodando em `http://localhost:3333/`

## Scripts Disponíveis
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm test` - Executa os testes (ainda não implementados)

## Estrutura do Projeto
```
src/
├── controllers/     # Controladores da aplicação
├── infra/          # Configurações de infraestrutura (banco, etc.)
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos de dados
├── routes/         # Definições de rotas
├── utils/          # Utilitários
└── views/          # Templates EJS
```

