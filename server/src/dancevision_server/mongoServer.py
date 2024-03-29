from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId
import json

load_dotenv()

db_key = os.getenv("CONNECTION_STRING")
print("Db key" , db_key)

client = MongoClient(db_key, ssl=True, tlsAllowInvalidCertificates=True)

db_user_data = client.get_database("user_data")
db_dance_scores = client.get_database('dance_scores')

def login(email, password):
    if not email_exists(email=email):
        return {"status":"failed"}
    else:
        pwd = db_user_data.login_credentials.find_one({"email":email})['password']
        if pwd == password:
            user = db_user_data.personal_information.find_one({"email": email})
            if user:
                return {"status":"success", "username" : user.get('user_name')}
        else:
            return {"status":"failed"}

def email_exists(email):
    if db_user_data.login_credentials.find_one( {'email' : email } ):
        return True
    else:
        return False
    
def user_name_exists(user_name):
    if db_user_data.personal_information.find_one({"user_name": user_name}):
        return True
    else: 
        return False
    
def register(email, password):
    k = {"email":email, "password":password}
    login_id = db_user_data.login_credentials.insert_one(k).inserted_id
    if login_id:
        return {"status":"success"}, login_id
    else:
        return {"status":"failed"}
    

def add_personal_information(user_name, login_id, name, email):  
    info = {
        'user_name': user_name,
        'login_id': login_id,
        'email' :  email,
        'name': name
    }
    db_user_data.personal_information.insert_one(info)

def get_personal_information(user_name):
    d = db_user_data.personal_information.find_one({'user_name': user_name })
    if not d:
        return { "status" : "No such user." },
    else:
        data = {
            "name" : d['name'],
            "email" : d['email']
        }
        return data    
    

def store_dance_score(user_name, data):
    id = db_dance_scores[user_name].insert_one(data)
    return str(id.inserted_id)

def get_dance_score(user_name, dance_id):
    object_id = ObjectId(dance_id)
    dance_data = db_dance_scores[user_name].find_one({'_id': object_id})
    dance_data['_id'] = str(dance_data['_id']) # convert ObjectId to string for json output
    return dance_data

def get_all_dance_score(user_name):
    all_objects = db_dance_scores[user_name].find()
    list_data = list(all_objects)
    for data in list_data:
        data['_id'] = str(data['_id'])
    return { "data": list_data }

def get_leaderboard_data():
    collections = db_dance_scores.list_collection_names()
    top_dances = []

    for collection_name in collections:
        collection = db_dance_scores[collection_name]
        data = collection.find().sort("avgScores.total_sccore", -1).limit(10)
        for document in data:
            new_entry = {
                'username' : collection_name,
                'score' : document.get("avgScores").get("total_score"),
                'refVideo' : document.get('ref_video_name'),
                'timeStamp' : document.get('time_stamp'),
            }
            personal_info = db_user_data.personal_information.find_one({'user_name': collection_name })
            if personal_info is not None:
                new_entry["name"] = personal_info.get("name")
            else:
                new_entry["name"] = "Not Found"
            top_dances.append(new_entry)

    # print(top_dances)
    top_dances_sorted = sorted(top_dances, key=lambda x : x.get('score'), reverse=True)
    top_dances_sorted = top_dances_sorted[:10]
    print(top_dances_sorted)

    return {"data": top_dances_sorted}
 

