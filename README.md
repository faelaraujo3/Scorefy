# 🎵 Scorefy

O **Scorefy** é uma rede social moderna e interativa dedicada aos apaixonados por música, inspirada em plataformas como o *RateYourMusic*. O objetivo principal é permitir que os utilizadores descubram, avaliem, cataloguem álbuns e interajam uns com os outros através de um sistema social completo.

Este projeto foi desenvolvido com foco total em arquitetura de microsserviços e utilização intensiva de um **Sistema de Gestão de Banco de Dados Não-Relacional (MongoDB)**, recorrendo estritamente a queries nativas (sem o uso de ORMs), de forma a evidenciar o domínio na manipulação de dados.

---

## ✨ Funcionalidades Principais

### 👥 Rede Social e Perfis
* **Perfis Personalizáveis:** Alteração de foto (via URL), biografia, localização e criação de listas de álbuns.
* **Sistema de Follows:** Capacidade de seguir outros utilizadores, construindo uma rede de amigos e críticos favoritos.
* **Feed de Atividades (Timeline):** Uma página inicial dinâmica que exibe em tempo real as avaliações mais recentes das pessoas que o usuário segue.

### 💿 Avaliações e Interação
* **Reviews Completas:** Avaliação de álbuns com notas por meio de estrelas e críticas em texto.
* **Sistema de "Likes":** Possibilidade de curtir as reviews e os comentários de outros utilizadores.
* **Comentários e Menções Inteligentes:** Respostas a reviews com suporte a menções (`@username`).
* **Notificações em Tempo Real:** Alertas para novos seguidores, curtidas em reviews/comentários e menções.

### 📋 Listas Personalizadas (Playlists)
* Criação de listas customizadas de álbuns.
* **Capas Dinâmicas:** Geração automática de uma capa em *Grid 2x2* com as imagens dos primeiros 4 álbuns da lista, ou opção de inserir uma capa personalizada via URL.
* Interface interna de pesquisa nativa para adicionar e remover álbuns das listas de forma fluida.

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* [React.js](https://reactjs.org/) (com Vite)
* [Tailwind CSS](https://tailwindcss.com/) (Estilização base)
* CSS Customizado (Efeitos de *Glassmorphism*, transições e scrollbars modernas)
* [Lucide React](https://lucide.dev/) (Ícones)
* React Router DOM (Navegação SPA)

**Backend:**
* [Python 3](https://www.python.org/)
* [Flask](https://flask.palletsprojects.com/) (Framework web leve e rápido)
* [PyMongo](https://pymongo.readthedocs.io/) (Driver nativo para comunicação direta com a BD)

**Base de Dados & Infraestrutura:**
* [MongoDB](https://www.mongodb.com/) (SGBD Não-Relacional)
* [Docker](https://www.docker.com/) & Docker Compose (Orquestração de contentores)

---

## 🎓 Contexto Académico

Este projeto cumpre rigorosamente os requisitos académicos de **Sistemas de Base de Dados Não-Relacionais**:
1. **Zero ORM:** A comunicação com o MongoDB é feita exclusivamente através do driver `pymongo`, executando consultas nativas (`find`, `insert_one`, `update_one`, `$push`, `$pull`, `$addToSet`).
2. **Aggregations Avançadas:** Utilização de *Aggregation Pipelines* complexas. Exemplo: Para gerar a secção "Em Alta" e o "Top Avaliados", bem como para fazer `$lookup` e mapear imagens (`$map`, `$slice`) para a geração automática da grelha de capas nas listas.

---

## 🚀 Como Rodar o Projeto (Localmente)

Tem toda a razão! Como o professor pode querer rodar o projeto manualmente (sem usar o Docker), é fundamental listar o Node.js, Python e o MongoDB.

Substitua apenas a secção **"Pré-requisitos"** e **"Passos de Instalação"** (na zona do "Como Correr o Projeto") por este texto abaixo. Assim, abrange tanto quem usa Docker como quem vai rodar "à mão":


### ⚙️ Pré-requisitos

Para rodar o projeto, pode optar por usar **Docker** (forma mais rápida) ou instalar as dependências localmente na sua máquina:

**Opção 1: Via Docker (Recomendado)**
* [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/) instalados na máquina.

**Opção 2: Instalação Local (Manual)**
* [Node.js](https://nodejs.org/) (versão 18+ recomendada) e `npm` (para o frontend React).
* [Python](https://www.python.org/downloads/) (versão 3.9+) e `pip` (para o backend Flask).
* [MongoDB](https://www.mongodb.com/try/download/community) instalado e a rodar localmente na porta padrão (`27017`), ou um cluster no MongoDB Atlas.

---

### 💻 Passos de Instalação

#### 🐳 Opção 1: Rodar com Docker
1. Clone o repositório e abra o terminal na pasta raiz.
2. Suba os contenders:
   
```bash
   docker-compose up --build

```

3. (Opcional) Povoe a base de dados em outro terminal:
```bash
docker exec -it scorefy-server python povoar.py

```



#### 🖥️ Opção 2: Rodar Localmente (Sem Docker)

1. **Base de Dados:** Certifique-se de que o MongoDB está rodando na porta `27017`.
2. **Backend (Python):**
```bash
cd server
pip install -r requirements.txt
python povoar.py  # (Opcional) Para criar dados de teste
python app.py

```


3. **Frontend (React):** Abra um novo terminal.
```bash
cd client
npm install
npm run dev

```



#### 🌐 Aceder à Aplicação

* **Frontend:** `http://localhost:5173`
* **Backend API:** `http://localhost:5000`
