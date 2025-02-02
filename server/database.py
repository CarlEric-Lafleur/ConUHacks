import os
import motor.motor_asyncio
def get_db():
    MONGO_URI = os.getenv("MONGO_URI")
    MONGO_USER = os.getenv("MONGO_USER")
    MONGO_PW = os.getenv("MONGO_PW")

    MONGO_URI = MONGO_URI.replace("<db_username>",MONGO_USER)
    MONGO_URI = MONGO_URI.replace("<db_password>",MONGO_PW)
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    return client.get_database("smart_pill")

def get_collection():
    return get_db().get_collection("app_user") 

