from pymongo import MongoClient

# Conecta ao MongoDB (certifique-se de que o container está rodando)
client = MongoClient("mongodb://localhost:27017")
db = client["scorefy_db"]

# 1. Limpa os dados antigos para não duplicar
db.users.delete_many({})
db.albums.delete_many({})
db.artists.delete_many({})
db.reviews.delete_many({})
db.playlists.delete_many({})

# 2. Povoamento de Artistas (com a nova Bio/Descrição)
db.artists.insert_many([
    {
        "id_artista": 1,
        "name": "Linkin Park",
        "bio": "Banda de rock americana formada em California" # Limpo, sem símbolos
    },
    {
        "id_artista": 2,
        "name": "Billie Eilish",
        "bio": "Cantora e compositora norte americana"
    }
])

# 3. Povoamento de Álbuns (com a nova Descrição e IDs)
db.albums.insert_many([
    {
        "id_album": 1,
        "title": "Meteora",
        "id_artista": 1,
        "year": 2003,
        "description": "Segundo album de estudio da banda",
        "image": "https://link-da-imagem.jpg"
    },
    {
        "id_album": 2,
        "title": "Hit Me Hard and Soft",
        "id_artista": 2,
        "year": 2024,
        "description": "Album com sonoridade alternativa e moderna",
        "image": "https://link-da-imagem-2.jpg"
    }
])

# 4. Povoamento de Usuário (Apenas para o Rafael testar o Profile)
db.users.insert_one({
    "username": "EmersonS2",
    "name": "Emerson Ataide",
    "bio": "Estudante de SI na UFOP",
    "location": "Joao Monlevade MG", # Removi a vírgula e o til para seguir sua regra
    "favorite_albums": [1, 2] # IDs dos álbuns
})

print("Banco resetado e povoado com as novas regras!")