from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import datetime
import os
import re


app = Flask(__name__)


# Replace with your MongoDB connection string
client = MongoClient("mongodb://localhost:27017/")
db = client["Aora"]
users_collection=db['users']
videos_collection = db["videos"]

secret_key = os.urandom(32).hex()

app.config['SECRET_KEY'] = secret_key
app.config["JWT_SECRET_KEY"] = 'your_jwt_secret_key'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
  


CORS(app)
JWTManager(app)


@app.route('/register', methods=['POST'])
def register_user():
  try:
    # Get user data from request body
    data = request.get_json()

    username = data.get('username')
    email=data.get('email')
    password = data.get('password')

    

    # Validate user data (optional)
    if not username or not password or not email:
      return jsonify({'error': 'Missing required fields'}), 400
    
    if users_collection.find_one({'username':username}):
      return jsonify({'message':"Username already exists..", 'success':False})
    
    if users_collection.find_one({'email':email}):
      return jsonify({'message':"Email already exists..", "success":False})


    # Insert user data into the database
    users_collection.insert_one({'username': username, 'email':email, 'password': password})
    print("user saved successfully")

    return jsonify({'message': "user saved successfully", 'success':True }), 201

  except Exception as e:
    return jsonify({'error': str(e)}), 500
  

@app.route("/login", methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')


        if not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'message': 'User not found'})
        
        if user['password']!= password:
            return jsonify({'message': 'Invalid password'})
        
        expires_delta = datetime.timedelta(days=30)
        token = create_access_token(identity=email, expires_delta=expires_delta)
        print(token)

        return jsonify({'token': token }), 201
    
           
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/get-current-user", methods=['GET'])
@jwt_required()
def getUser():
   email=get_jwt_identity()

   user = users_collection.find_one({"email":email},{'_id':0, 'password':0})

   return jsonify(user)


@app.route("/create-post",methods=['POST'])
def createPost():
  try:
    data=request.get_json()['post']

    email= data['email']
    creator= data['creator']
    title = data['title']
    video = data['video']
    thumbnail = data['thumbnail']
    prompt = data['prompt']

    date=datetime.datetime.now()

    videos_collection.insert_one({'email':email, 'creator':creator, 'title':title, 'video':video, 'thumbnail':thumbnail, 'prompt':prompt, 'date':date})

    return jsonify({'success':True, 'message':"post created successfully"})
  except:
    return jsonify({'success':False, 'message':"post not created..."})
     


@app.route("/get-all-posts", methods=['GET'])
def allPosts():
    posts = videos_collection.find()
    return jsonify(json_util.dumps(posts))

@app.route("/get-user-posts",methods=['GET'])
def userPosts():
    email = request.args.get('email')
    posts = videos_collection.find({'email':email})
    return jsonify(json_util.dumps(posts))

@app.route("/get-latest-posts", methods=['GET'])
def latestPosts():
  
    posts = videos_collection.find().sort('date',-1).limit(7)
    return jsonify(json_util.dumps(posts))


@app.route("/search_posts", methods=["GET"])
def search_posts():
  # Get search query from request parameters
  query = request.args.get("query")

  print(query)

  # Perform case-insensitive text search using regular expression
  pattern = re.compile(f".*{query}.*", re.IGNORECASE)
  posts = videos_collection.find({"title": {"$regex": pattern}})

  return jsonify(json_util.dumps(posts))






if __name__ == '__main__':
  app.run(host="0.0.0.0", port=8000, debug=True)
