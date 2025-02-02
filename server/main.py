from fastapi import FastAPI, UploadFile
from PIL import Image
from services.posology_service import PosologyService
import io
from models import AppUser
from userDatabaseService import *
from services.groq_service import GroqServices
import numpy as np
from starlette.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

p = PosologyService()
g = GroqServices()


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

    return user


@app.put("/users/{user_id}")
async def update_user_api(user_id: str, user_data: dict):
    updated = await update_user(user_id, user_data)

    return {"message": "User updated successfully"}


@app.delete("/users/{user_id}")
async def delete_user_api(user_id: str):
    deleted = await delete_user(user_id)
    return {"message": "User deleted successfully"}


@app.post("/posology")
async def create_upload_file(files: list[UploadFile]):
    print(files)
    contents = [await file.read() for file in files]
    images = [np.array(Image.open(io.BytesIO(content))) for content in contents]
    images = [images[0] for i in range(3)]
    return p.getJson(images)


@app.post("/groq")
async def query_groq(query: str):
    id = "123"  # CHANGEME
    return g.chat(id, query)
