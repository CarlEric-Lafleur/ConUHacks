from database import get_collection
from models import AppUser
from bson import ObjectId

async def test_db_connection():
    try:
        # Perform a simple operation to check the connection
        await get_collection().find_one()
        return {"status": "Connection successful"}
    except Exception as e:
        return {"status": "Connection failed", "error": str(e)}


# Create a new user
async def create_user(user_data: AppUser):
    user_dict = user_data.dict(by_alias=True)
    result = await get_collection().insert_one(user_dict)
    return str(result.inserted_id)

# Get a user by ID
async def get_user(user_id: str):
    user = await get_collection().find_one({"_id": user_id})
    return user

# Get all users
async def get_users():
    users = []
    print("Getting users")
    async for user in get_collection().find():
        users.append(AppUser(**user))
    return users

async def update_user(user_id: str, update_data: dict):
    result = await get_collection().update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_data}
    )
    return result.modified_count > 0

async def delete_user(user_id: str):
    result = await get_collection().delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count 
