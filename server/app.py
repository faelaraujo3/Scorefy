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
        "data_postagem": datetime.now().strftime("%d/%m/%Y %H:%M")
    }
    criticas_col.insert_one(nova_review)
    return jsonify({"message": "Review publicada!"}), 201

@app.route('/api/albuns/<int:id_album>', methods=['GET'])
def detalhes_album(id_album):
    album = albuns_col.find_one({"id_album": id_album}, {"_id": 0})
    if not album: return jsonify({"error": "Álbum não encontrado"}), 404
    reviews = list(criticas_col.find({"id_album": id_album}))
    notas = [r['nota'] for r in reviews if 'nota' in r]
    media = sum(notas) / len(notas) if notas else 0
    for r in reviews: r['_id'] = str(r['_id'])
    return jsonify({"album": album, "nota_media": round(media, 1), "total_reviews": len(reviews), "reviews": reviews}), 200

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

# --- SEÇÕES DA HOME (Lógica Completa com Ajustes) ---
def buscar_detalhes_album(lista_agregada):
    ids = [item["_id"] for item in lista_agregada]
    albuns = list(albuns_col.find({"id_album": {"$in": ids}}, {"_id": 0}))
    for alb in albuns:
        art = artistas_col.find_one({"id_artista": alb["id_artista"]})
        alb["artist"] = art["name"] if art else "Desconhecido"
    return albuns

@app.route('/api/home/secoes', methods=['GET'])
def obter_secoes_home():
    # 1. Melhores Avaliações (campo 'nota')
    pipeline_top = [
        {"$group": {"_id": "$id_album", "media": {"$avg": "$nota"}, "total": {"$sum": 1}}},
        {"$sort": {"media": -1, "total": -1}}, {"$limit": 8}
    ]
    melhores_ids = list(criticas_col.aggregate(pipeline_top))
    
    # 2. Em Alta (Última semana)
    uma_semana = (datetime.now() - timedelta(days=7)).strftime("%d/%m/%Y %H:%M")
    pipeline_trending = [
        {"$match": {"data_postagem": {"$gte": uma_semana}}},
        {"$group": {"_id": "$id_album", "contagem": {"$sum": 1}}},
        {"$sort": {"contagem": -1}}, {"$limit": 8}
    ]
    trending_ids = list(criticas_col.aggregate(pipeline_trending))

    novos_lancamentos = list(albuns_col.find({}, {"_id": 0}).sort("year", -1).limit(8))
    for nl in novos_lancamentos:
        art = artistas_col.find_one({"id_artista": nl["id_artista"]})
        nl["artist"] = art["name"] if art else "Desconhecido"

    return jsonify({
        "trending": buscar_detalhes_album(trending_ids) if trending_ids else novos_lancamentos,
        "top_rated": buscar_detalhes_album(melhores_ids) if melhores_ids else novos_lancamentos,
        "new_releases": novos_lancamentos
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)