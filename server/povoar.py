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

# 2. Povoamento de Artistas
db.artists.insert_many([
    {
        "id_artista": 1,
        "name": "Linkin Park",
        "bio": "Banda de Nu Metal americana formada em California",
        "genre": "Nu Metal",
        "country": "EUA",
        "formed_year": 1996,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 2,
        "name": "Billie Eilish",
        "bio": "Cantora e compositora de pop alternativo norte americana",
        "genre": "Pop",
        "country": "EUA",
        "formed_year": 2015,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 3,
        "name": "Taylor Swift",
        "bio": "Cantora e compositora americana conhecida por misturar pop e country com letras autobiograficas",
        "genre": "Pop",
        "country": "EUA",
        "formed_year": 2006,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 4,
        "name": "The Beatles",
        "bio": "Banda britanica de rock considerada uma das mais influentes da historia da musica",
        "genre": "Rock",
        "country": "Reino Unido",
        "formed_year": 1960,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 5,
        "name": "Nirvana",
        "bio": "Banda de grunge formada em Seattle que marcou os anos 90",
        "genre": "Grunge",
        "country": "EUA",
        "formed_year": 1987,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 6,
        "name": "Legiao Urbana",
        "bio": "Banda brasileira de rock formada em Brasilia com letras marcantes e politicas",
        "genre": "Rock",
        "country": "Brasil",
        "formed_year": 1982,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 7,
        "name": "Dua Lipa",
        "bio": "Cantora britanica de pop conhecida por sucessos internacionais e estilo moderno",
        "genre": "Pop",
        "country": "Reino Unido",
        "formed_year": 2015,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 8,
        "name": "Marina Sena",
        "bio": "Cantora brasileira de pop alternativo com sonoridade influenciada por musica brasileira",
        "genre": "Pop",
        "country": "Brasil",
        "formed_year": 2021,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 9,
        "name": "Drake",
        "bio": "Rapper e cantor canadense conhecido por misturar hip hop e RnB",
        "genre": "Hip Hop",
        "country": "Canada",
        "formed_year": 2009,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 10,
        "name": "Lady Gaga",
        "bio": "Cantora e atriz americana conhecida por performances ousadas e sucessos no pop",
        "genre": "Pop",
        "country": "EUA",
        "formed_year": 2008,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 11,
        "name": "Arctic Monkeys",
        "bio": "Banda britanica de indie rock formada em Sheffield",
        "genre": "Rock",
        "country": "Reino Unido",
        "formed_year": 2002,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 12,
        "name": "Paramore",
        "bio": "Banda americana de pop punk liderada por Hayley Williams",
        "genre": "Pop Punk",
        "country": "EUA",
        "formed_year": 2004,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 13,
        "name": "Bad Bunny",
        "bio": "Cantor porto riquenho de reggaeton e trap latino com grande impacto global",
        "genre": "Reggaeton",
        "country": "Porto Rico",
        "formed_year": 2016,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 14,
        "name": "Evanescence",
        "bio": "Banda americana de rock com influencias de metal e vocal feminino marcante",
        "genre": "Rock",
        "country": "EUA",
        "formed_year": 1995,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 15,
        "name": "Travis Scott",
        "bio": "Rapper e produtor americano conhecido por estilo experimental no hip hop",
        "genre": "Hip Hop",
        "country": "EUA",
        "formed_year": 2013,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 16,
        "name": "Charlie Brown Jr",
        "bio": "Banda brasileira de rock que mistura skate punk rap e reggae",
        "genre": "Rock",
        "country": "Brasil",
        "formed_year": 1992,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 17,
        "name": "Ivete Sangalo",
        "bio": "Cantora brasileira de axe e musica pop com forte presenca no carnaval",
        "genre": "Axe",
        "country": "Brasil",
        "formed_year": 1993,
        "image_url": "https://link-da-imagem.jpg"
    },
    {
        "id_artista": 18,
        "name": "My Chemical Romance",
        "bio": "Banda americana de rock associada ao movimento emo dos anos 2000",
        "genre": "Pop Punk",
        "country": "EUA",
        "formed_year": 2001,
        "image_url": "https://link-da-imagem.jpg"
    }
])



# 3. Povoamento de Álbuns (com genero adicionado)
db.albums.insert_many([

    {
        "id_album": 1,
        "title": "Three Cheers for Sweet Revenge",
        "id_artista": 18,
        "year": 2004,
        "genre": "Emo-Pop",
        "description": "Album que consolidou o som emo do grupo",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 2,
        "title": "The Black Parade",
        "id_artista": 18,
        "year": 2006,
        "genre": "Rock Opera",
        "description": "Album conceitual que marcou a carreira da banda",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 3,
        "title": "Transpiracao Continua Prolongada",
        "id_artista": 16,
        "year": 1997,
        "genre": "Skate Punk",
        "description": "Album de estreia com forte influencia do skate punk",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 4,
        "title": "Preco Curto Prazo Longo",
        "id_artista": 16,
        "year": 1999,
        "genre": "Skate Punk",
        "description": "Album que ampliou o sucesso nacional da banda",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 5,
        "title": "Nadando com os Tubaroes",
        "id_artista": 16,
        "year": 2000,
        "genre": "Skate Punk",
        "description": "Album com letras intensas e sonoridade marcante",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 6,
        "title": "Acustico MTV Charlie Brown Jr",
        "id_artista": 16,
        "year": 2003,
        "genre": "Pop Rock",
        "description": "Album ao vivo em formato acustico com grandes sucessos da banda",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 7,
        "title": "Bocas Ordinarias",
        "id_artista": 16,
        "year": 2002,
        "genre": "Skate Punk",
        "description": "Album com sucessos populares e letras reflexivas",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 8,
        "title": "Imunidade Musical",
        "id_artista": 16,
        "year": 2005,
        "genre": "Rap Rock",
        "description": "Album premiado com forte impacto no rock nacional",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 9,
        "title": "All We Know Is Falling",
        "id_artista": 12,
        "year": 2005,
        "genre": "Pop Punk",
        "description": "Album de estreia com sonoridade emo pop",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 10,
        "title": "RIOT",
        "id_artista": 12,
        "year": 2007,
        "genre": "Pop Punk",
        "description": "Album que levou a banda ao sucesso mundial",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 11,
        "title": "brand new eyes",
        "id_artista": 12,
        "year": 2009,
        "genre": "Alternative Rock",
        "description": "Album com evolucao sonora e amadurecimento lirico",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 12,
        "title": "Paramore",
        "id_artista": 12,
        "year": 2013,
        "genre": "Pop Rock",
        "description": "Album com estilo mais pop e experimental",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 13,
        "title": "After Laughter",
        "id_artista": 12,
        "year": 2017,
        "genre": "Pop Rock",
        "description": "Album com sonoridade mais leve e influencias dos anos 80",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 14,
        "title": "This Is Why",
        "id_artista": 12,
        "year": 2023,
        "genre": "Alternative Rock",
        "description": "Album com abordagem mais madura e alternativa",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 15,
        "title": "WHEN WE ALL FALL ASLEEP WHERE DO WE GO",
        "id_artista": 2,
        "year": 2019,
        "genre": "Alternative Pop",
        "description": "Album de estreia com atmosfera sombria e moderna",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 16,
        "title": "Happier Than Ever",
        "id_artista": 2,
        "year": 2021,
        "genre": "Alternative Pop",
        "description": "Album que mistura pop alternativo e vulnerabilidade",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 17,
        "title": "Fearless",
        "id_artista": 3,
        "year": 2008,
        "genre": "Country",
        "description": "Album country pop que consolidou sua carreira",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 18,
        "title": "Red",
        "id_artista": 3,
        "year": 2012,
        "genre": "Pop",
        "description": "Album que mistura country e pop com letras intensas",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 19,
        "title": "1989",
        "id_artista": 3,
        "year": 2014,
        "genre": "Pop",
        "description": "Album totalmente pop com grandes hits mundiais",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 20,
        "title": "reputation",
        "id_artista": 3,
        "year": 2017,
        "genre": "Pop",
        "description": "Album com sonoridade mais sombria e eletronica",
        "image": "https://link-da-imagem.jpg"
    },

        {
        "id_album": 21,
        "title": "Lover",
        "id_artista": 3,
        "year": 2019,
        "genre": "Pop",
        "description": "Album com atmosfera romantica e colorida",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 22,
        "title": "folklore",
        "id_artista": 3,
        "year": 2020,
        "genre": "Folk",
        "description": "Album mais intimista com influencias indie",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 23,
        "title": "Future Nostalgia",
        "id_artista": 7,
        "year": 2020,
        "genre": "Pop",
        "description": "Album pop com forte influencia disco e anos 80",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 24,
        "title": "Coisas Naturais",
        "id_artista": 8,
        "year": 2023,
        "genre": "Pop",
        "description": "Album com sonoridade brasileira moderna e sensual",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 25,
        "title": "Take Care",
        "id_artista": 9,
        "year": 2011,
        "genre": "Hip Hop",
        "description": "Album que consolidou Drake no rap mundial",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 26,
        "title": "Views",
        "id_artista": 9,
        "year": 2016,
        "genre": "Hip Hop",
        "description": "Album com mistura de rap e dancehall",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 27,
        "title": "Scorpion",
        "id_artista": 9,
        "year": 2018,
        "genre": "Hip Hop",
        "description": "Album duplo com sucessos comerciais globais",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 28,
        "title": "Dois",
        "id_artista": 6,
        "year": 1986,
        "genre": "Post-Punk",
        "description": "Album com classicos do rock brasileiro",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 29,
        "title": "Que Pais E Esse",
        "id_artista": 6,
        "year": 1987,
        "genre": "Post-Punk",
        "description": "Album com forte critica social e politica",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 30,
        "title": "Revolver",
        "id_artista": 4,
        "year": 1966,
        "genre": "Rock",
        "description": "Album inovador que marcou a musica mundial",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 31,
        "title": "Abbey Road",
        "id_artista": 4,
        "year": 1969,
        "genre": "Rock",
        "description": "Album classico com producao sofisticada",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 32,
        "title": "Let It Be",
        "id_artista": 4,
        "year": 1970,
        "genre": "Rock",
        "description": "Ultimo album lancado pela banda",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 33,
        "title": "The Fame",
        "id_artista": 10,
        "year": 2008,
        "genre": "Pop",
        "description": "Album de estreia com grandes hits pop",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 34,
        "title": "The Fame Monster",
        "id_artista": 10,
        "year": 2009,
        "genre": "Pop",
        "description": "Reedicao com sucessos marcantes do pop",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 35,
        "title": "Born This Way",
        "id_artista": 10,
        "year": 2011,
        "genre": "Pop",
        "description": "Album com mensagem de auto aceitacao",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 36,
        "title": "ARTPOP",
        "id_artista": 10,
        "year": 2013,
        "genre": "Pop",
        "description": "Album ambicioso com influencias eletronicas",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 37,
        "title": "Humbug",
        "id_artista": 11,
        "year": 2009,
        "genre": "Indie Rock",
        "description": "Album com sonoridade mais sombria e psicodelica",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 38,
        "title": "Suck It And See",
        "id_artista": 11,
        "year": 2011,
        "genre": "Indie Rock",
        "description": "Album com estilo mais romantico e direto",
        "image": "https://link-da-imagem.jpg"
    },

    {
        "id_album": 39,
        "title": "AM",
        "id_artista": 11,
        "year": 2013,
        "genre": "Indie Rock",
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