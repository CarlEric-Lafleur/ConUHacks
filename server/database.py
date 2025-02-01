import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
print(MONGO_URI)

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
database = client.get_database("smart_pill")
print("HHAAAAAAAAAAAAAAAAAAAAAA")
app_user_collection = database.get_collection("app_user")
