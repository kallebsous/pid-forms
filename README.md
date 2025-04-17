# PID Forms

Um aplicativo web para gerenciamento de formulários e grupos, construído com React, TypeScript, Supabase e Tailwind CSS. Inclui funcionalidades como autenticação de administradores, registro de usuários, dashboard administrativo e alternância de temas.

## 📋 Visão Geral

O **PID Forms** é uma aplicação voltada para facilitar a criação, gerenciamento e visualização de formulários e grupos. Ele oferece uma interface amigável, suporte a temas claro/escuro, e integração com Supabase para autenticação e armazenamento de dados.

### Funcionalidades

- **Autenticação**: Login para administradores e registro de usuários.
- **Dashboard Administrativo**: Interface para gerenciar formulários e grupos.
- **Gerenciamento de Grupos**: Página dedicada para visualização e edição de grupos.
- **Tema Dinâmico**: Alternância entre modos claro e escuro.
- **Notificações**: Toast de sucesso para feedback ao usuário.
- **Carregamento**: Tela de loading para melhorar a experiência do usuário.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite
- **Estilização**: Tailwind CSS, PostCSS
- **Autenticação e Banco de Dados**: Supabase
- **Linter**: ESLint
- **Outros**: React Hooks, Componentes reutilizáveis

## 📂 Estrutura do Projeto

```plaintext
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── logo-pid.png
│   └── logo.ico
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── GrupoPage.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── SucessToast.tsx
│   │   ├── TelaCarregando.tsx
│   │   └── ThemeToggle.tsx
│   ├── hooks
│   │   └── useAuth.ts
│   ├── index.css
│   ├── lib
│   │   └── supabase.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase
│   └── migrations
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (ou yarn/pnpm)
- Conta no Supabase (para autenticação e banco de dados)

### Passos para Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/kallebsous/pid-forms.git
   cd pid-forms
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o Supabase:

   - Crie um projeto no Supabase (https://supabase.com/).
   - Copie as credenciais (URL do projeto e chave API) do Supabase.
   - Crie um arquivo `.env` na raiz do projeto com as variáveis:

     ```env
     VITE_SUPABASE_URL=sua_url_do_supabase
     VITE_SUPABASE_ANON_KEY=sua_chave_anonima
     ```

4. Execute as migrações do banco de dados (se necessário):

   - Use as configurações na pasta `supabase/migrations` para configurar o banco de dados no Supabase.

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

6. Acesse o aplicativo em `http://localhost:5173` (ou a porta configurada pelo Vite).

## 🖥️ Como Usar

- **Login Administrativo**: Acesse a tela de login com credenciais de administrador.
- **Registro**: Use o formulário de registro para criar novos usuários.
- **Dashboard**: Após o login, gerencie formulários e grupos no dashboard.
- **Tema**: Alterne entre temas claro e escuro usando o componente `ThemeToggle`.

## 🤝 Como Contribuir

1. Faça um fork do repositório.
2. Crie uma branch para sua feature:

   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:

   ```bash
   git commit -m "Adiciona minha feature"
   ```
4. Envie para o repositório remoto:

   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request no GitHub.

Por favor, siga as diretrizes de código (ESLint, TypeScript) e adicione testes, se aplicável.

## 📜 Licença

Este projeto está licenciado sob a MIT License.

## 📞 Contato

- Autor: Kalleb Sousa
- GitHub: https://github.com/kallebsous
- Email: \[insira seu email, se desejar\]
