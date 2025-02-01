from fastapi import FastAPI, HTTPException
from models import AppUser
from userDatabaseService import *

app = FastAPI()

@app.get("/")
def read_root():
    response = test_db_connection()
    return response


@app.get("/users/")
async def get_users_api():
    users = await get_users()
    return users

@app.post("/users-post/")
async def create_user_api(user: AppUser):
    user_id = await create_user(user)
    return {"user_id": user_id}

@app.get("/users/{user_id}")
async def get_user_api(user_id: str):
    user = await get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}")
async def update_user_api(user_id: str, user_data: dict):
    updated = await update_user(user_id, user_data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated successfully"}

@app.delete("/users/{user_id}")
async def delete_user_api(user_id: str):
    deleted = await delete_user(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
