from pymongo import MongoClient

# Conecta ao MongoDB (localhost para rodar no seu Debian)
client = MongoClient("mongodb://localhost:27017/")
db = client["scorefy_db"]

# 1. Limpa os dados antigos
db.users.delete_many({})
db.albums.delete_many({})
db.artists.delete_many({})
db.reviews.delete_many({})
db.playlists.delete_many({})
db.reviews.delete_many({})
db.notifications.delete_many({})

# 2. Povoamento de Artistas (Completo)
db.artists.insert_many([
    {"id_artista": 1, "name": "Linkin Park", "bio": "Banda de Nu Metal americana formada em California", "genre": "Nu Metal", "country": "EUA", "formed_year": 1996, "image_url": "https://cdn-images.dzcdn.net/images/artist/cc73698ecf7d3ce03f3b1079888d9c03/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 2, "name": "Billie Eilish", "bio": "Cantora e compositora de pop alternativo norte americana", "genre": "Pop", "country": "EUA", "formed_year": 2015, "image_url": "https://cdn-images.dzcdn.net/images/artist/8eab1a9a644889aabaca1e193e05f984/500x500.jpg"},
    {"id_artista": 3, "name": "Taylor Swift", "bio": "Cantora e compositora americana conhecida por misturar pop e country com letras autobiograficas", "genre": "Pop", "country": "EUA", "formed_year": 2006, "image_url": "https://thebackstage-deezer.com/wp-content/uploads/2024/07/taylor-swift3-500x463.jpg"},
    {"id_artista": 4, "name": "The Beatles", "bio": "Banda britanica de rock considerada uma das mais influentes da historia da musica", "genre": "Rock", "country": "Reino Unido", "formed_year": 1960, "image_url": "https://cdn-images.dzcdn.net/images/artist/fe9eb4463ea87452e84ed97e0c86b878/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 5, "name": "Nirvana", "bio": "Banda de grunge formada em Seattle que marcou os anos 90", "genre": "Grunge", "country": "EUA", "formed_year": 1987, "image_url": "https://cdn-images.dzcdn.net/images/artist/3ec5542ff520ee74e2befdaba32ef2ef/1900x1900-000000-81-0-0.jpg"},
    {"id_artista": 6, "name": "Legiao Urbana", "bio": "Banda brasileira de rock formada em Brasilia com letras marcantes e politicas", "genre": "Rock", "country": "Brasil", "formed_year": 1982, "image_url": "https://cdn-images.dzcdn.net/images/artist/27331b5535cf5a8fd0cece324c201a18/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 7, "name": "Dua Lipa", "bio": "Cantora britanica de pop conhecida por sucessos internacionais e estilo moderno", "genre": "Pop", "country": "Reino Unido", "formed_year": 2015, "image_url": "https://cdn-images.dzcdn.net/images/cover/da320055ebaebd2391445b7624d6fe7f/0x1900-000000-80-0-0.jpg"},
    {"id_artista": 8, "name": "Marina Sena", "bio": "Cantora brasileira de pop alternativo com sonoridade influenciada por musica brasileira", "genre": "Pop", "country": "Brasil", "formed_year": 2021, "image_url": "https://cdn-images.dzcdn.net/images/artist/0026ccb932df7c793d04cc72e950dad1/500x500.jpg"},
    {"id_artista": 9, "name": "Drake", "bio": "Rapper e cantor canadense conhecido por misturar hip hop e RnB", "genre": "Hip Hop", "country": "Canada", "formed_year": 2009, "image_url": "https://cdn-images.dzcdn.net/images/artist/5d2fa7f140a6bdc2c864c3465a61fc71/1900x1900-000000-81-0-0.jpg"},
    {"id_artista": 10, "name": "Lady Gaga", "bio": "Cantora e atriz americana conhecida por performances ousadas e sucessos no pop", "genre": "Pop", "country": "EUA", "formed_year": 2008, "image_url": "https://cdn-images.dzcdn.net/images/artist/7565262f7661b0d762621a8d69ba6f49/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 11, "name": "Arctic Monkeys", "bio": "Banda britanica de indie rock formada em Sheffield", "genre": "Rock", "country": "Reino Unido", "formed_year": 2002, "image_url": "https://cdn-images.dzcdn.net/images/artist/6c03e4c7c36800897fd468633286db24/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 12, "name": "Paramore", "bio": "Banda americana de pop punk liderada por Hayley Williams", "genre": "Pop Punk", "country": "EUA", "formed_year": 2004, "image_url": "https://cdn-images.dzcdn.net/images/artist/60dc1956a36a5e552384b4a32b0cbf9b/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 13, "name": "Bad Bunny", "bio": "Cantor porto riquenho de reggaeton e trap latino com grande impacto global", "genre": "Reggaeton", "country": "Porto Rico", "formed_year": 2016, "image_url": "https://cdn-images.dzcdn.net/images/artist/45aaf836629158d714432ae37e552ee7/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 14, "name": "Evanescence", "bio": "Banda americana de rock com influencias de metal e vocal feminino marcante", "genre": "Rock", "country": "EUA", "formed_year": 1995, "image_url": "https://cdn-images.dzcdn.net/images/artist/f833f7b583847c251f0286961f338551/500x500.jpg"},
    {"id_artista": 15, "name": "Travis Scott", "bio": "Rapper e produtor americano conhecido por estilo experimental no hip hop", "genre": "Hip Hop", "country": "EUA", "formed_year": 2013, "image_url": "https://cdn-images.dzcdn.net/images/cover/b8be81921aa5990f1cd3b7499d4d6501/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 16, "name": "Charlie Brown Jr", "bio": "Banda brasileira de rock que mistura skate punk rap e reggae", "genre": "Rock", "country": "Brasil", "formed_year": 1992, "image_url": "https://cdn-images.dzcdn.net/images/artist/1a2e562dde23cdbd9abea4bae13eb4fc/500x500.jpg"},
    {"id_artista": 17, "name": "Ivete Sangalo", "bio": "Cantora brasileira de axe e musica pop com forte presenca no carnaval", "genre": "Axe", "country": "Brasil", "formed_year": 1993, "image_url": "https://cdn-images.dzcdn.net/images/artist/79b386e807cd2ffbfb85d9dfe94207aa/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 18, "name": "My Chemical Romance", "bio": "Banda americana de rock associada ao movimento emo dos anos 2000", "genre": "Pop Punk", "country": "EUA", "formed_year": 2001, "image_url": "https://cdn-images.dzcdn.net/images/artist/e34296360cda10a29f85c7170a60178d/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 19, "name": "Olivia Rodrigo", "bio": "Cantora e compositora americana conhecida por musicas emocionais e letras pessoais", "genre": "Pop", "country": "EUA", "formed_year": 2015, "image_url": "https://cdn-images.dzcdn.net/images/artist/245d3346a03388562d56ab5a63f6549d/1900x1900-000000-80-0-0.jpg"},
    {"id_artista": 20, "name": "Lil Nas X", "bio": "Cantor americano conhecido por musicas inovadoras e letras provocativas", "genre": "Pop", "country": "EUA", "formed_year": 2018, "image_url": "https://cdn-images.dzcdn.net/images/cover/a65e86966cfd34b2aa292856136ef9ac/0x1900-000000-80-0-0.jpg"},
    {"id_artista": 21, "name": "Harry Styles", "bio": "Cantor britanico conhecido por carreira solo e estilo pop rock", "genre": "Pop", "country": "Reino Unido", "formed_year": 2017, "image_url": "https://cdn-images.dzcdn.net/images/artist/1151dba9b3edc0633adf35b64c21713f/200x200.jpg"},
    {"id_artista": 22, "name": "Addison Rae", "bio": "Artista pop/alternativa que ascendeu ao mainstream como influencer", "genre": "Pop", "country": "EUA", "formed_year": 2021, "image_url": "https://cdn-images.dzcdn.net/images/artist/a8bc8bbb055934154ffe5ab48e61d6d0/1000x1000-000000-80-0-0.jpg"}
])

# 3. Povoamento de Álbuns (Completo)
db.albums.insert_many([

    {
        "id_album": 1,
        "title": "Three Cheers for Sweet Revenge",
        "id_artista": 18,
        "year": 2004,
        "genre": "Emo-Pop",
        "description": "Album que consolidou o som emo do grupo",
        "image": "https://cdn-images.dzcdn.net/images/cover/9aba5b418a311c0bbefb6699ebc58a4b/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 2,
        "title": "The Black Parade",
        "id_artista": 18,
        "year": 2006,
        "genre": "Rock Opera",
        "description": "Album conceitual que marcou a carreira da banda",
        "image": "https://cdn-images.dzcdn.net/images/cover/ae78cd7f32230593392c8b76519e9044/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 3,
        "title": "Transpiracao Continua Prolongada",
        "id_artista": 16,
        "year": 1997,
        "genre": "Skate Punk",
        "description": "Album de estreia com forte influencia do skate punk",
        "image": "https://cdn-images.dzcdn.net/images/cover/ebc2a1f1dd88e1f1184f5f65dd50a651/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 4,
        "title": "Preco Curto Prazo Longo",
        "id_artista": 16,
        "year": 1999,
        "genre": "Skate Punk",
        "description": "Album que ampliou o sucesso nacional da banda",
        "image": "https://cdn-images.dzcdn.net/images/cover/e1e68b0c566b15c05e4b5512ad60edbc/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 5,
        "title": "Nadando com os Tubaroes",
        "id_artista": 16,
        "year": 2000,
        "genre": "Skate Punk",
        "description": "Album com letras intensas e sonoridade marcante",
        "image": "https://cdn-images.dzcdn.net/images/cover/b21f18394f35fa085a60fb0830e6c0b1/500x500.jpg"
    },

    {
        "id_album": 6,
        "title": "Acustico MTV Charlie Brown Jr",
        "id_artista": 16,
        "year": 2003,
        "genre": "Pop Rock",
        "description": "Album ao vivo em formato acustico com grandes sucessos da banda",
        "image": "https://cdn-images.dzcdn.net/images/cover/8b2e53b96f790c5716ea2c0f2952ca3b/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 7,
        "title": "Bocas Ordinarias",
        "id_artista": 16,
        "year": 2002,
        "genre": "Skate Punk",
        "description": "Album com sucessos populares e letras reflexivas",
        "image": "https://cdn-images.dzcdn.net/images/cover/0643a39cd1500460e282c216685270ad/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 8,
        "title": "Imunidade Musical",
        "id_artista": 16,
        "year": 2005,
        "genre": "Rap Rock",
        "description": "Album premiado com forte impacto no rock nacional",
        "image": "https://cdn-images.dzcdn.net/images/cover/710a0bb8222c01062271e44fbc00a8a2/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 9,
        "title": "All We Know Is Falling",
        "id_artista": 12,
        "year": 2005,
        "genre": "Pop Punk",
        "description": "Album de estreia com sonoridade emo pop",
        "image": "https://cdn-images.dzcdn.net/images/cover/3c761adbf435c7e1c6bc44cd9004bf08/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 10,
        "title": "RIOT",
        "id_artista": 12,
        "year": 2007,
        "genre": "Pop Punk",
        "description": "Album que levou a banda ao sucesso mundial",
        "image": "https://cdn-images.dzcdn.net/images/cover/22e912898ea9df52d73b10625538d615/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 11,
        "title": "brand new eyes",
        "id_artista": 12,
        "year": 2009,
        "genre": "Alternative Rock",
        "description": "Album com evolucao sonora e amadurecimento lirico",
        "image": "https://cdn-images.dzcdn.net/images/cover/1346bb36e5d61b9fea447a9b3ea50f54/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 12,
        "title": "Paramore",
        "id_artista": 12,
        "year": 2013,
        "genre": "Pop Rock",
        "description": "Album com estilo mais pop e experimental",
        "image": "https://cdn-images.dzcdn.net/images/cover/485d7cab7695e48f1420182647273de4/500x500.jpg"
    },

    {
        "id_album": 13,
        "title": "After Laughter",
        "id_artista": 12,
        "year": 2017,
        "genre": "Pop Rock",
        "description": "Album com sonoridade mais leve e influencias dos anos 80",
        "image": "https://cdn-images.dzcdn.net/images/cover/b43c1a8f1be9a9ee3654562e5a949426/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 14,
        "title": "This Is Why",
        "id_artista": 12,
        "year": 2023,
        "genre": "Alternative Rock",
        "description": "Album com abordagem mais madura e alternativa",
        "image": "https://cdn-images.dzcdn.net/images/cover/15b205611f8695468dece5be1fdfe981/500x500.jpg"
    },

    {
        "id_album": 15,
        "title": "WHEN WE ALL FALL ASLEEP WHERE DO WE GO",
        "id_artista": 2,
        "year": 2019,
        "genre": "Alternative Pop",
        "description": "Album de estreia com atmosfera sombria e moderna",
        "image": "https://cdn-images.dzcdn.net/images/cover/6630083f454d48eadb6a9b53f035d734/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 16,
        "title": "Happier Than Ever",
        "id_artista": 2,
        "year": 2021,
        "genre": "Alternative Pop",
        "description": "Album que mistura pop alternativo e vulnerabilidade",
        "image": "https://cdn-images.dzcdn.net/images/cover/bb2880548dd3bc71fb97def2eedec130/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 17,
        "title": "Fearless",
        "id_artista": 3,
        "year": 2008,
        "genre": "Country",
        "description": "Album country pop que consolidou sua carreira",
        "image": "https://cdn-images.dzcdn.net/images/cover/96a161f99836c790df03af3b6dbd9309/1900x1900-000000-81-0-0.jpg"
    },

    {
        "id_album": 18,
        "title": "Red",
        "id_artista": 3,
        "year": 2012,
        "genre": "Pop",
        "description": "Album que mistura country e pop com letras intensas",
        "image": "https://cdn-images.dzcdn.net/images/cover/74bb527e771a74e2e7478cacca15fbba/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 19,
        "title": "1989",
        "id_artista": 3,
        "year": 2014,
        "genre": "Pop",
        "description": "Album totalmente pop com grandes hits mundiais",
        "image": "https://cdn-images.dzcdn.net/images/cover/8c39b232a5edecdf5fffc14f551fa42b/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 20,
        "title": "reputation",
        "id_artista": 3,
        "year": 2017,
        "genre": "Pop",
        "description": "Album com sonoridade mais sombria e eletronica",
        "image": "https://cdn-images.dzcdn.net/images/cover/e6f3afd8a5c3d8ea797f458694166e47/1900x1900-000000-80-0-0.jpg"
    },

        {
        "id_album": 21,
        "title": "Lover",
        "id_artista": 3,
        "year": 2019,
        "genre": "Pop",
        "description": "Album com atmosfera romantica e colorida",
        "image": "https://cdn-images.dzcdn.net/images/cover/6111c5ab9729c8eac47883e4e50e9cf8/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 22,
        "title": "folklore",
        "id_artista": 3,
        "year": 2020,
        "genre": "Folk",
        "description": "Album mais intimista com influencias indie",
        "image": "https://cdn-images.dzcdn.net/images/cover/290abe93bdda84bb8b170f30a4998c4c/500x500.jpg"
    },

    {
        "id_album": 23,
        "title": "Future Nostalgia",
        "id_artista": 7,
        "year": 2020,
        "genre": "Pop",
        "description": "Album pop com forte influencia disco e anos 80",
        "image": "https://cdn-images.dzcdn.net/images/cover/3c5cd0eb919ff9a7767b8ac7acc89e40/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 24,
        "title": "Coisas Naturais",
        "id_artista": 8,
        "year": 2023,
        "genre": "Pop",
        "description": "Album com sonoridade brasileira moderna e sensual",
        "image": "https://cdn-images.dzcdn.net/images/cover/99541f56b36b6f4db2b8680f5a9c3262/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 25,
        "title": "Take Care",
        "id_artista": 9,
        "year": 2011,
        "genre": "Hip Hop",
        "description": "Album que consolidou Drake no rap mundial",
        "image": "https://cdn-images.dzcdn.net/images/cover/6e7a6c8f36669dcd11abe7e7c3222e91/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 26,
        "title": "Views",
        "id_artista": 9,
        "year": 2016,
        "genre": "Hip Hop",
        "description": "Album com mistura de rap e dancehall",
        "image": "https://cdn-images.dzcdn.net/images/cover/56bdb7a86a27fadb96332c0c8f1b8e81/1900x1900-000000-81-0-0.jpg"
    },

    {
        "id_album": 27,
        "title": "Scorpion",
        "id_artista": 9,
        "year": 2018,
        "genre": "Hip Hop",
        "description": "Album duplo com sucessos comerciais globais",
        "image": "https://cdn-images.dzcdn.net/images/cover/b69d3bcbd130ad4cc9259de543889e30/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 28,
        "title": "Dois",
        "id_artista": 6,
        "year": 1986,
        "genre": "Post-Punk",
        "description": "Album com classicos do rock brasileiro",
        "image": "https://cdn-images.dzcdn.net/images/cover/b4738becedbed0481ac71cee50b18d6b/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 29,
        "title": "Que Pais E Esse",
        "id_artista": 6,
        "year": 1987,
        "genre": "Post-Punk",
        "description": "Album com forte critica social e politica",
        "image": "https://cdn-images.dzcdn.net/images/cover/16404d6f94173cd2c1cb05fe476f5012/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 30,
        "title": "Revolver",
        "id_artista": 4,
        "year": 1966,
        "genre": "Rock",
        "description": "Album inovador que marcou a musica mundial",
        "image": "https://cdn-images.dzcdn.net/images/cover/6e1e24a3e4311371abd2c888b1f0e13e/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 31,
        "title": "Abbey Road",
        "id_artista": 4,
        "year": 1969,
        "genre": "Rock",
        "description": "Album classico com producao sofisticada",
        "image": "https://cdn-images.dzcdn.net/images/cover/aa94ab293730bb7845d2aa8c672b2c29/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 32,
        "title": "Let It Be",
        "id_artista": 4,
        "year": 1970,
        "genre": "Rock",
        "description": "Ultimo album lancado pela banda",
        "image": "https://cdn-images.dzcdn.net/images/cover/fcf05300b7c17ec77a6d01028a4bef61/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 33,
        "title": "The Fame",
        "id_artista": 10,
        "year": 2008,
        "genre": "Pop",
        "description": "Album de estreia com grandes hits pop",
        "image": "https://cdn-images.dzcdn.net/images/cover/cc24d60a998e1a296f0c22efa8ddffd2/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 34,
        "title": "The Fame Monster",
        "id_artista": 10,
        "year": 2009,
        "genre": "Pop",
        "description": "Reedicao com sucessos marcantes do pop",
        "image": "https://cdn-images.dzcdn.net/images/cover/fad7de079aa103d60ec1e2d1582c2281/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 35,
        "title": "Born This Way",
        "id_artista": 10,
        "year": 2011,
        "genre": "Pop",
        "description": "Album com mensagem de auto aceitacao",
        "image": "https://cdn-images.dzcdn.net/images/cover/d0790a19ca7b37af16029e10209d323a/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 36,
        "title": "ARTPOP",
        "id_artista": 10,
        "year": 2013,
        "genre": "Pop",
        "description": "Album ambicioso com influencias eletronicas",
        "image": "https://cdn-images.dzcdn.net/images/cover/2355b9a023e34665e347afa8b53fd9e1/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 37,
        "title": "Humbug",
        "id_artista": 11,
        "year": 2009,
        "genre": "Indie Rock",
        "description": "Album com sonoridade mais sombria e psicodelica",
        "image": "https://cdn-images.dzcdn.net/images/cover/13cdeb23547351f3ea543a2f5b4b9a4b/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 38,
        "title": "Suck It And See",
        "id_artista": 11,
        "year": 2011,
        "genre": "Indie Rock",
        "description": "Album com estilo mais romantico e direto",
        "image": "https://cdn-images.dzcdn.net/images/cover/9751005be2b826746df12c45b761573a/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 39,
        "title": "AM",
        "id_artista": 11,
        "year": 2013,
        "genre": "Indie Rock",
        "description": "Album com grande sucesso comercial da banda",
        "image": "https://cdn-images.dzcdn.net/images/cover/64e54e307bd5e2bdb27ffeb662fd910d/1900x1900-000000-81-0-0.jpg"
    },

    {
        "id_album": 40,
        "title": "Montero",
        "id_artista": 20,
        "year": 2021,
        "genre": "Pop",
        "description": "Album de estreia que consolidou Lil Nas X no cenario pop e rap mundial",
        "image": "https://cdn-images.dzcdn.net/images/cover/18e6daf0a1c70c1346c44670ff70645d/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 41,
        "title": "SOUR",
        "id_artista": 19,
        "year": 2021,
        "genre": "Pop Rock",
        "description": "Album de estreia com forte carga emocional e sucesso global",
        "image": "https://cdn-images.dzcdn.net/images/cover/e68da86fd7976135c2d2d1715afaef7c/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 42,
        "title": "The Life of a Showgirl",
        "id_artista": 3,
        "year": 2025,
        "genre": "Pop",
        "description": "Projeto que explora o lado performatico e teatral de Taylor Swift",
        "image": "https://cdn-images.dzcdn.net/images/cover/d0bed55a0efb3c5c3ddb3dacda67d9b3/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 43,
        "title": "Harrys House",
        "id_artista": 21,
        "year": 2022,
        "genre": "Pop",
        "description": "Album com sonoridade leve e influencias do pop contemporaneo",
        "image": "https://cdn-images.dzcdn.net/images/cover/b0e936124f59e669ddba02ebe5893f95/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 44,
        "title": "MAYHEM",
        "id_artista": 10,
        "year": 2025,
        "genre": "Pop",
        "description": "Album com estetica ousada e sonoridade intensa caracteristica de Lady Gaga",
        "image": "https://cdn-images.dzcdn.net/images/cover/5f70ffc30c43410fc2a88ae10baa91c7/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 45,
        "title": "HIT ME HARD AND SOFT",
        "id_artista": 2,
        "year": 2024,
        "genre": "Alternative Pop",
        "description": "Album que explora vulnerabilidade emocional com producao minimalista e atmosferica",
        "image": "https://cdn-images.dzcdn.net/images/cover/5d284b31cb9ddeb1a0c79aede5a94e1c/500x500.jpg"
    },

    {
        "id_album": 46,
        "title": "Meteora",
        "id_artista": 1,
        "year": 2003,
        "genre": "Nu Metal",
        "description": "Album que consolidou o sucesso mundial da banda com som pesado e melodico",
        "image": "https://cdn-images.dzcdn.net/images/cover/882448ab63952aa16e502c82db2df160/1900x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 47,
        "title": "Hybrid Theory",
        "id_artista": 1,
        "year": 2000,
        "genre": "Nu Metal",
        "description": "Album de estreia que marcou o inicio do sucesso global do grupo",
        "image": "https://cdn-images.dzcdn.net/images/cover/033a271b5ec10842c287827c39244fb5/0x1900-000000-80-0-0.jpg"
    },

    {
        "id_album": 48,
        "title": "Addison",
        "id_artista": 22,
        "year": 2025,
        "genre": "Pop",
        "description": "Album de estréia da artista revelação do Scorefy",
        "image": "https://cdn-images.dzcdn.net/images/cover/6925f0e9f34b95ce5781480b249fd86d/1000x1000-000000-80-0-0.jpg"
    }

])



# 4. Povoamento de Usuário (Apenas para o Rafael testar o Profile)
db.users.insert_one({
    "id_user": 1,
    "email": "emerson@ufop.br",
    "senha": "123",
    "username": "EmersonS2",
    "nome": "Emerson Ataide",
    "bio": "Estudante de SI na UFOP",
    "localizacao": "Joao Monlevade MG",
    "imagem_url": "https://i.pravatar.cc/150",
    "albuns_favoritos": [1, 43]  # no máximo 5
})

print("Banco resetado e povoado com sucesso!")