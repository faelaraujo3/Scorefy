from pymongo import MongoClient

# Conecta ao MongoDB (certifique-se de que o container está rodando)
client = MongoClient("mongodb://mongodb:27017")
db = client["scorefy_db"]

# 1. Limpa os dados antigos para não duplicar
db.users.delete_many({})
db.albums.delete_many({})
db.artists.delete_many({})
db.reviews.delete_many({})
db.playlists.delete_many({})

# 2. Povoamento de Artistas
db.artists.insert_many([
    {
        "id_artista": 1,
        "name": "Linkin Park",
        "bio": "Banda de Nu Metal americana formada em Califórnia"
    },
    {
        "id_artista": 2,
        "name": "Billie Eilish",
        "bio": "Cantora e compositora de pop alternativo norte americana"
    },
    {
        "id_artista": 3,
        "name": "Taylor Swift",
        "bio": "Cantora e compositora americana conhecida por misturar pop e country com letras autobiográficas"
    },
    {
        "id_artista": 4,
        "name": "The Beatles",
        "bio": "Banda britânica de rock considerada uma das mais influentes da história da música"
    },
    {
        "id_artista": 5,
        "name": "Nirvana",
        "bio": "Banda de grunge formada em Seattle que marcou os anos 90"
    },
    {
        "id_artista": 6,
        "name": "Legiao Urbana",
        "bio": "Banda brasileira de rock formada em Brasília com letras marcantes e políticas"
    },
    {
        "id_artista": 7,
        "name": "Dua Lipa",
        "bio": "Cantora britânica de pop conhecida por sucessos internacionais e estilo moderno"
    },
    {
        "id_artista": 8,
        "name": "Marina Sena",
        "bio": "Cantora brasileira de pop alternativo com sonoridade influenciada por música brasileira"
    },
    {
        "id_artista": 9,
        "name": "Drake",
        "bio": "Rapper e cantor canadense conhecido por misturar hip hop e R&B"
    },
    {
        "id_artista": 10,
        "name": "Lady Gaga",
        "bio": "Cantora e atriz americana conhecida por performances ousadas e sucessos no pop"
    },
    {
        "id_artista": 11,
        "name": "Arctic Monkeys",
        "bio": "Banda britânica de indie rock formada em Sheffield"
    },
    {
        "id_artista": 12,
        "name": "Paramore",
        "bio": "Banda americana de pop punk liderada por Hayley Williams"
    },
    {
        "id_artista": 13,
        "name": "Bad Bunny",
        "bio": "Cantor porto riquenho de reggaeton e trap latino com grande impacto global"
    },
    {
        "id_artista": 14,
        "name": "Evanescence",
        "bio": "Banda americana de rock com influencias de metal e vocal feminino marcante"
    },
    {
        "id_artista": 15,
        "name": "Travis Scott",
        "bio": "Rapper e produtor americano conhecido por estilo experimental no hip hop"
    },
    {
        "id_artista": 16,
        "name": "Charlie Brown Jr",
        "bio": "Banda brasileira de rock que mistura skate punk rap e reggae"
    },
    {
        "id_artista": 17,
        "name": "Ivete Sangalo",
        "bio": "Cantora brasileira de axé e musica pop com forte presença no carnaval"
    },
    {
        "id_artista": 18,
        "name": "My Chemical Romance",
        "bio": "Banda americana de rock associada ao movimento emo dos anos 2000"
    }
])


# 3. Povoamento de Álbuns (com a nova Descrição e IDs)
db.albums.insert_many([
    {
        "id_album": 1,
        "title": "Three Cheers for Sweet Revenge",
        "id_artista": 18,
        "year": 2004,
        "description": "Album que consolidou o som emo do grupo",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 2,
        "title": "The Black Parade",
        "id_artista": 18,
        "year": 2006,
        "description": "Album conceitual que marcou a carreira da banda",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 3,
        "title": "Transpiracao Continua Prolongada",
        "id_artista": 16,
        "year": 1997,
        "description": "Album de estreia com forte influencia do skate punk",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 4,
        "title": "Preco Curto Prazo Longo",
        "id_artista": 16,
        "year": 1999,
        "description": "Album que ampliou o sucesso nacional da banda",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 5,
        "title": "Nadando com os Tubaroes",
        "id_artista": 16,
        "year": 2000,
        "description": "Album com letras intensas e sonoridade marcante",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 6,
        "title": "100 Porcento Charlie Brown Jr Abalando a Sua Fabrica",
        "id_artista": 16,
        "year": 2001,
        "description": "Album que reforcou o estilo irreverente da banda",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 7,
        "title": "Bocas Ordinarias",
        "id_artista": 16,
        "year": 2002,
        "description": "Album com sucessos populares e letras reflexivas",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 8,
        "title": "Imunidade Musical",
        "id_artista": 16,
        "year": 2005,
        "description": "Album premiado com forte impacto no rock nacional",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 9,
        "title": "All We Know Is Falling",
        "id_artista": 12,
        "year": 2005,
        "description": "Album de estreia com sonoridade emo pop",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 10,
        "title": "RIOT",
        "id_artista": 12,
        "year": 2007,
        "description": "Album que levou a banda ao sucesso mundial",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 21,
        "title": "Lover",
        "id_artista": 3,
        "year": 2019,
        "description": "Album com atmosfera romantica e colorida",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 22,
        "title": "folklore",
        "id_artista": 3,
        "year": 2020,
        "description": "Album mais intimista com influencias indie",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 23,
        "title": "Future Nostalgia",
        "id_artista": 7,
        "year": 2020,
        "description": "Album pop com forte influencia disco e anos 80",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 24,
        "title": "Coisas Naturais",
        "id_artista": 8,
        "year": 2023,
        "description": "Album com sonoridade brasileira moderna e sensual",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 25,
        "title": "Take Care",
        "id_artista": 9,
        "year": 2011,
        "description": "Album que consolidou Drake no rap mundial",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 26,
        "title": "Views",
        "id_artista": 9,
        "year": 2016,
        "description": "Album com mistura de rap e dancehall",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 27,
        "title": "Scorpion",
        "id_artista": 9,
        "year": 2018,
        "description": "Album duplo com sucessos comerciais globais",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 28,
        "title": "Dois",
        "id_artista": 6,
        "year": 1986,
        "description": "Album com classicos do rock brasileiro",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 29,
        "title": "Que Pais E Esse",
        "id_artista": 6,
        "year": 1987,
        "description": "Album com forte critica social e politica",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 30,
        "title": "Revolver",
        "id_artista": 4,
        "year": 1966,
        "description": "Album inovador que marcou a musica mundial",
        "image": "https://link-da-imagem.jpg"
    },

        {
        "id_album": 31,
        "title": "Abbey Road",
        "id_artista": 4,
        "year": 1969,
        "description": "Album classico com producao sofisticada",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 32,
        "title": "Let It Be",
        "id_artista": 4,
        "year": 1970,
        "description": "Ultimo album lancado pela banda",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 33,
        "title": "The Fame",
        "id_artista": 10,
        "year": 2008,
        "description": "Album de estreia com grandes hits pop",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 34,
        "title": "The Fame Monster",
        "id_artista": 10,
        "year": 2009,
        "description": "Reedicao com sucessos marcantes do pop",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 35,
        "title": "Born This Way",
        "id_artista": 10,
        "year": 2011,
        "description": "Album com mensagem de auto aceitacao",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 36,
        "title": "ARTPOP",
        "id_artista": 10,
        "year": 2013,
        "description": "Album experimental com influencias eletronicas",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 37,
        "title": "Humbug",
        "id_artista": 11,
        "year": 2009,
        "description": "Album com sonoridade mais sombria e psicodelica",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 38,
        "title": "Suck It And See",
        "id_artista": 11,
        "year": 2011,
        "description": "Album com estilo mais romantico e direto",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 39,
        "title": "AM",
        "id_artista": 11,
        "year": 2013,
        "description": "Album com grande sucesso comercial da banda",
        "image": "https://link-da-imagem.jpg"
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