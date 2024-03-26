from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId

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
    db_dance_scores[user_name].insert_one(data)

def get_dance_score(user_name, dance_id):
    object_id = ObjectId(dance_id)
    dance_data = db_dance_scores[user_name].find_one({'_id': object_id})
    dance_data['_id'] = str(dance_data['_id']) # convert ObjectId to string for json output
    print(dance_data)
    return dance_data

def get_all_dance_score(username):
    pass


def test_data():
    detailed_scores ={
        "left_shoulder" : [10,20,30,40,50,60],
        "right_shoulder" : [10,20,30,40,50,60],
        "left_elbow" : [10,20,30,40,50,60],
        "right_elbow" : [10,20,30,40,50,60],
        "left_wrist" : [10,20,30,40,50,60],
        "right_wrist" : [10,20,30,40,50,60],
        "left_hip" : [10,20,30,40,50,60],
        "right_hip" : [10,20,30,40,50,60],
        "left_knee" : [10,20,30,40,50,60],
        "right_knee" : [10,20,30,40,50,60],
        "left_ankle" : [10,20,30,40,50,60],
        "right_ankle" : [10,20,30,40,50,60],
        "avg_score_over_time" : [10,20,30,40,50,60]
    }

    avgScores = {
        "left_shoulder" : 67,
        "right_shoulder" : 67,
        "left_elbow" : 67,
        "right_elbow" : 67,
        "left_wrist" : 67,
        "right_wrist" : 67,
        "left_hip" : 67,
        "right_hip" : 67,
        "left_knee" : 67,
        "right_knee" : 67,
        "left_ankle" : 67,
        "right_ankle" : 67,
        "total_score" : 90
    }

    data ={ "avgScores" : avgScores,
           "detailed_scores" : detailed_scores,
           "ref_video_name" : "fineese_step",
           "time_stamp" : "2024-03-20 20:18:34"}
    
    db_dance_scores["admin2"].insert_one(data)



    
# test_data()
get_dance_score('admin2', '6602a6b812ed1e46fa7180fc')