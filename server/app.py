from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from bson import ObjectId
app = Flask(__name__)
CORS(app)

# MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["scorefy_db"]

# Coleções
usuarios_col = db["users"]
artistas_col = db["artists"]
albuns_col = db["albums"]
criticas_col = db["reviews"]
notificacoes_col = db["notifications"]

# --- ROTA DE LOGIN ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')
    usuario = usuarios_col.find_one({"email": email, "senha": senha}, {"_id": 0})
    if not usuario:
        return jsonify({"error": "E-mail ou palavra-passe incorretos"}), 401
    return jsonify({"message": "Login realizado com sucesso!", "user": usuario}), 200

# --- ROTA DE REGISTO ---
@app.route('/api/registrar', methods=['POST'])
def registrar():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')
    nome = data.get('nome')

    if not email or not senha or not nome:
        return jsonify({"error": "E-mail, senha e nome são obrigatórios"}), 400
    if usuarios_col.find_one({"email": email}):
        return jsonify({"error": "E-mail já cadastrado!"}), 400

    ultimo_usuario = usuarios_col.find_one(sort=[("id_user", -1)])
    proximo_id = (ultimo_usuario["id_user"] + 1) if ultimo_usuario else 1

    novo_usuario = {
        "id_user": proximo_id,
        "email": email,
        "senha": senha,
        "username": data.get('username') or nome.split()[0].lower(),
        "nome": nome,
        "bio": "",
        "localizacao": "",
        "imagem_url": "default_avatar.png",
        "albuns_favoritos": []
    }
    usuarios_col.insert_one(novo_usuario)
    return jsonify({"message": "Conta criada com sucesso!", "id_user": proximo_id}), 201

# --- BUSCA E LISTAGEM ---
@app.route('/api/busca', methods=['GET'])
def busca_global():
    termo = request.args.get('q', '')
    if not termo:
        return jsonify({"artistas": [], "albuns": []}), 200
    artistas = list(artistas_col.find({"name": {"$regex": termo, "$options": "i"}}, {"_id": 0}))
    albuns = list(albuns_col.find({"title": {"$regex": termo, "$options": "i"}}, {"_id": 0}))
    for art in artistas:
        albuns_do_artista = list(albuns_col.find({"id_artista": art.get("id_artista")}, {"_id": 0}))
        for album in albuns_do_artista:
            if album not in albuns: albuns.append(album)
    return jsonify({"artistas": artistas, "albuns": albuns}), 200

@app.route('/api/albuns', methods=['GET'])
def listar_albuns():
    genero = request.args.get('genero')
    pipeline = [
        {"$match": {"genre": {"$regex": f"^{genero}$", "$options": "i"}}} if genero else {"$match": {}},
        {"$lookup": {"from": "artists", "localField": "id_artista", "foreignField": "id_artista", "as": "art"}},
        {"$unwind": "$art"},
        {"$project": {"_id": 0, "id_album": 1, "title": 1, "genre": 1, "year": 1, "image": 1, "description": 1, "nome_artista": "$art.name"}}
    ]
    return jsonify(list(albuns_col.aggregate(pipeline))), 200

# --- SISTEMA DE REVIEWS (Sua Parte) ---
@app.route('/api/reviews', methods=['POST'])
def postar_review():
    data = request.json
    id_user = data.get('id_user')
    usuario = usuarios_col.find_one({"id_user": id_user})
    if not usuario:
        return jsonify({"error": "Usuário não encontrado"}), 404

    nova_review = {
        "id_user": id_user,
        "username": usuario.get('username') or usuario.get('nome'),
        "id_album": int(data.get('id_album')),
        "nota": float(data.get('nota')),
        "texto": data.get('texto'),
        "curtidas": [],
        "respostas": [],
        "data_postagem": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    criticas_col.insert_one(nova_review)
    return jsonify({"message": "Review publicada!"}), 201

@app.route('/api/albuns/<int:id_album>', methods=['GET'])
def detalhes_album(id_album):
    # 1. Busca o álbum
    album = albuns_col.find_one({"id_album": id_album}, {"_id": 0})
    if not album: return jsonify({"error": "Álbum não encontrado"}), 404

    if "id_artista" in album:
        artista_db = artistas_col.find_one({"id_artista": album["id_artista"]})
        album["artist"] = artista_db["name"] if artista_db else "Desconhecido"
    else:
        album["artist"] = "Desconhecido"
    reviews = list(criticas_col.find({"id_album": id_album}))
    notas = [r['nota'] for r in reviews if 'nota' in r]
    
    media = sum(notas) / len(notas) if notas else 0
    
    for r in reviews: r['_id'] = str(r['_id'])
    
    return jsonify({
        "album": album, 
        "nota_media": round(media, 1), 
        "total_reviews": len(reviews), 
        "reviews": reviews
    }), 200

# --- INTERAÇÕES E NOTIFICAÇÕES ---

@app.route('/api/reviews/<review_id>/curtir', methods=['POST'])
def curtir_review(review_id):
    data = request.json
    id_user_curtiu = data.get('id_user')
    
    # 1. Busca quem está curtindo no banco
    user_curtiu = usuarios_col.find_one({"id_user": id_user_curtiu})
    
    # Se o usuário não existir, usamos o nome que veio no JSON ou "Alguém"
    nome_quem_curtiu = user_curtiu.get('username') if user_curtiu else data.get('username', 'Alguém')
    
    review_original = criticas_col.find_one_and_update(
        {"_id": ObjectId(review_id)},
        {"$addToSet": {"curtidas": id_user_curtiu}}
    )

    if not review_original:
        return jsonify({"error": "Review não encontrada"}), 404

    # 2. Só notifica se for outra pessoa e se tivermos os dados
    if review_original['id_user'] != id_user_curtiu:
        notificacoes_col.insert_one({
            "para_id_user": review_original['id_user'],
            "mensagem": f"{nome_quem_curtiu} curtiu sua review do álbum {review_original['id_album']}!",
            "tipo": "curtida",
            "lida": False,
            "data": datetime.now().strftime("%d/%m/%Y %H:%M")
        })

    return jsonify({"status": "sucesso"}), 200

@app.route('/api/notificacoes/<int:id_user>', methods=['GET'])
def obter_notificacoes(id_user):
    avisos = list(notificacoes_col.find({"para_id_user": id_user}).sort("_id", -1))
    for a in avisos: a['_id'] = str(a['_id'])
    return jsonify(avisos), 200

@app.route('/api/reviews/<review_id>/responder', methods=['POST'])
def responder_review(review_id):
    data = request.json
    id_resp = data.get('id_user')
    user_resp = usuarios_col.find_one({"id_user": id_resp})
    
    nova_resposta = {
        "id_user": id_resp,
        "username": user_resp.get('username') if user_resp else data.get('username', 'Alguém'),
        "texto": data.get('texto'),
        "data": datetime.now().strftime("%d/%m/%Y %H:%M")
    }

    # Adiciona a resposta ao array da review original
    review_alvo = criticas_col.find_one_and_update(
        {"_id": ObjectId(review_id)},
        {"$push": {"respostas": nova_resposta}}
    )

    # Notifica o dono da review (se não for ele mesmo respondendo)
    if review_alvo and review_alvo['id_user'] != id_resp:
        notificacoes_col.insert_one({
            "para_id_user": review_alvo['id_user'],
            "mensagem": f"{nova_resposta['username']} respondeu sua review!",
            "tipo": "resposta",
            "lida": False,
            "data": datetime.now().strftime("%d/%m/%Y %H:%M")
        })

    return jsonify({"message": "Resposta enviada!"}), 200

@app.route('/api/notificacoes/<notif_id>/ler', methods=['PATCH'])
def marcar_como_lida(notif_id):
    notificacoes_col.update_one(
        {"_id": ObjectId(notif_id)},
        {"$set": {"lida": True}}
    )
    return jsonify({"status": "sucesso"}), 200



# --- SEÇÕES DA HOME (Lógica Completa com Ajustes) ---
def buscar_detalhes_album(lista_agregada):
    if not lista_agregada:
        return []
    
    ids = [item["_id"] for item in lista_agregada]
    albuns = list(albuns_col.find({"id_album": {"$in": ids}}, {"_id": 0}))
    albuns.sort(key=lambda x: ids.index(x["id_album"]))
    for alb in albuns:
        art = artistas_col.find_one({"id_artista": alb["id_artista"]})
        alb["artist"] = art["name"] if art else "Desconhecido"
        if "rating" not in alb:
             alb["rating"] = 4.5 

    return albuns

@app.route('/api/home/secoes', methods=['GET'])
def obter_secoes_home():
    # 1. Melhores Avaliações
    pipeline_top = [
        {"$group": {"_id": "$id_album", "media": {"$avg": "$nota"}, "total": {"$sum": 1}}},
        {"$sort": {"media": -1, "total": -1}},
        {"$limit": 8}
    ]
    melhores_agregados = list(criticas_col.aggregate(pipeline_top))
    
    # 2. Em Alta (Última semana)
    uma_semana = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S")
    
    pipeline_trending = [
        # Nota: Isso só funcionará 100% se a data for salva como YYYY-MM-DD
        {"$match": {"data_postagem": {"$gte": uma_semana}}},
        {"$group": {"_id": "$id_album", "contagem": {"$sum": 1}}},
        {"$sort": {"contagem": -1}},
        {"$limit": 8}
    ]
    trending_agregados = list(criticas_col.aggregate(pipeline_trending))

    # 3. Novos Lançamentos
    novos_lancamentos = list(albuns_col.find({}, {"_id": 0}).sort("year", -1).limit(8))
    for nl in novos_lancamentos:
        art = artistas_col.find_one({"id_artista": nl["id_artista"]})
        nl["artist"] = art["name"] if art else "Desconhecido"
        nl["rating"] = 0

    lista_trending = buscar_detalhes_album(trending_agregados)
    if not lista_trending:
        # Pega 8 aleatórios ou os primeiros 8 para não repetir 'novos'
        lista_trending = list(albuns_col.find({}, {"_id": 0}).limit(8))
        for x in lista_trending:
             art = artistas_col.find_one({"id_artista": x["id_artista"]})
             x["artist"] = art["name"] if art else "Desconhecido"

    lista_top = buscar_detalhes_album(melhores_agregados)
    if not lista_top:
        # Pega 8 pulando os primeiros para variar
        lista_top = list(albuns_col.find({}, {"_id": 0}).skip(8).limit(8))
        for x in lista_top:
             art = artistas_col.find_one({"id_artista": x["id_artista"]})
             x["artist"] = art["name"] if art else "Desconhecido"

    return jsonify({
        "trending": lista_trending,
        "top_rated": lista_top,
        "new_releases": novos_lancamentos
    })

# Função auxiliar para formatar a resposta
def formatar_albuns(lista_ids_ou_docs):
    resultados = []
    
    if not lista_ids_ou_docs:
        return []

    primeiro_item = lista_ids_ou_docs[0]
    
    if "title" in primeiro_item:
        albuns_db = lista_ids_ou_docs
        ids_para_ordenar = None 
    else:
        # Caso contrário, extraímos os IDs para buscar
        ids_para_ordenar = [item["_id"] if "_id" in item else item["id_album"] for item in lista_ids_ou_docs]
        albuns_db = list(albuns_col.find({"id_album": {"$in": ids_para_ordenar}}, {"_id": 0}))

        # Reordena a lista do banco para bater com a ordem do ranking
        if ids_para_ordenar:
            albuns_db.sort(key=lambda x: ids_para_ordenar.index(x["id_album"]))

    for album in albuns_db:
        art = artistas_col.find_one({"id_artista": album["id_artista"]})
        album["artist"] = art["name"] if art else "Desconhecido"
        
        # CÁLCULO REAL DA MÉDIA
        reviews_album = list(criticas_col.find({"id_album": album["id_album"]}))
        notas = [r['nota'] for r in reviews_album if 'nota' in r]
        
        # Se não tiver nota, fica 0.0. Se tiver, calcula a média.
        album["rating"] = round(sum(notas) / len(notas), 1) if notas else 0.0
        
        resultados.append(album)
    
    return resultados

# Rota de listagem para albuns em alta, melhores avaliações e lançamentos
@app.route('/api/lista/em-alta', methods=['GET'])
def lista_em_alta():
    uma_semana_atras = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S")
    
    pipeline = [
        {"$match": {"data_postagem": {"$gte": uma_semana_atras}}},
        {"$group": {"_id": "$id_album", "contagem": {"$sum": 1}}},
        {"$sort": {"contagem": -1}},
        {"$limit": 50} 
    ]
    ids = list(criticas_col.aggregate(pipeline))
    
    if not ids: 
        fallback = list(albuns_col.find({}, {"_id": 0}).sort("year", -1).limit(20))
        return jsonify(formatar_albuns(fallback))
        
    return jsonify(formatar_albuns(ids))

@app.route('/api/lista/melhores', methods=['GET'])
def lista_melhores():
    pipeline = [
        {"$group": {"_id": "$id_album", "media": {"$avg": "$rating"}}},
        {"$sort": {"media": -1}},
        {"$limit": 50}
    ]
    ids = list(criticas_col.aggregate(pipeline))
    if not ids: return jsonify(formatar_albuns(list(albuns_col.find({}, {"_id": 0}).limit(20))))
    return jsonify(formatar_albuns(ids))

@app.route('/api/lista/lancamentos', methods=['GET'])
def lista_lancamentos():
    # Busca os álbuns ordenados por ano do mais novo para o mais antigo
    albuns_cursor = albuns_col.find({}, {"_id": 0}).sort("year", -1).limit(50)
    
    return jsonify(formatar_albuns(list(albuns_cursor)))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)