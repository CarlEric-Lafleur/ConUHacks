from database import app_user_collection
from models import AppUser
from bson import ObjectId

async def test_db_connection():
    try:
        # Perform a simple operation to check the connection
        await app_user_collection.find_one()
        return {"status": "Connection successful"}
    except Exception as e:
        return {"status": "Connection failed", "error": str(e)}


# Create a new user
async def create_user(user_data: AppUser):
    user_dict = user_data.dict(by_alias=True)
    result = await app_user_collection.insert_one(user_dict)
    return str(result.inserted_id)

# Get a user by ID
async def get_user(user_id: str):
    user = await app_user_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        return AppUser(**user)
    return None

# Get all users
async def get_users():
    users = []
    print("Getting users")
    print(app_user_collection)
    async for user in app_user_collection.find():
        users.append(AppUser(**user))
    return users

async def update_user(user_id: str, update_data: dict):
    result = await app_user_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_data}
    )
    return result.modified_count > 0

async def delete_user(user_id: str):
    result = await app_user_collection.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count > 0
