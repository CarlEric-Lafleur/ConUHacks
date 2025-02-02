from database import get_user_collection, get_drug_collection

async def test_db_connection():
    try:
        # Perform a simple operation to check the connection
        await get_user_collection().find_one()
        return {"status": "Connection successful"}
    except Exception as e:
        return {"status": "Connection failed", "error": str(e)}


# Create a new user
async def create_user(user_dict):
    result = await get_user_collection().insert_one(user_dict)
    return str(result.inserted_id)

# Get a user by ID
async def get_user(user_id: str):
    user = await get_user_collection().find_one({"_id":user_id})
    user["_id"] = str(user["_id"])
    return user

# Get all users
async def get_users():
    users = []
    async for user in get_user_collection().find():
        user["_id"] = str(user["_id"])
        users.append(user)
    return users

async def update_user(user_id: str, update_data: dict):
    result = await get_user_collection().update_one(
        {"_id": user_id}, {"$set": update_data}
    )
    return result.modified_count > 1

async def push_prescription(user_id: str, prescription: dict):
    result = await get_user_collection().update_one(
        {"_id": user_id}, {"$push": {"prescriptions": prescription}}
    )
    return result.modified_count > 1


async def delete_user(user_id: str):
    result = await get_user_collection().delete_one({"_id": user_id})
    return result.deleted_count 

async def create_drug(drug_dict):
    res = await get_drug_collection().insert_one(drug_dict)
    return str(res.inserted_id)

async def get_drug(id: str):
    drug = await get_drug_collection().find_one({"_id":id})
    drug["_id"] = str(drug["_id"]) 
    return drug

# Get all users
async def get_drugs():
    drugs = []
    async for drug in get_drug_collection().find():
        drug["_id"] = str(drug["_id"])
        drugs.append(drug)
    return drugs


