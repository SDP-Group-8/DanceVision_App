from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

db_key = os.getenv("CONNECTION_STRING")
print("Db key" , db_key)

client = MongoClient(db_key, ssl=True, tlsAllowInvalidCertificates=True)

db_user_data = client.get_database("user_data")

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