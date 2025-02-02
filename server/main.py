from fastapi import FastAPI, UploadFile
from PIL import Image
from services.posology_service import PosologyService
import io
import DatabaseService as db
from services.groq_service import GroqServices
import numpy as np
from starlette.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

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

load_dotenv()


@app.get("/")
async def read_root():
    response = await db.test_db_connection()
    return response


@app.get("/users/")
async def get_users_api():
    users = await db.get_users()
    return users


@app.post("/users/")
async def create_user_api(user: dict):
    print("here", user)
    user_id = await db.create_user(user)
    return {"user_id": user_id}


@app.get("/users/{user_id}")
async def get_user_api(user_id: str):
    user = await db.get_user(user_id)
    return user


@app.put("/users/{user_id}")
async def update_user_api(user_id: str, user_data: dict):
    await db.update_user(user_id, user_data)
    return {"message": "User updated successfully"}


@app.delete("/users/{user_id}")
async def delete_user_api(user_id: str):
    await db.delete_user(user_id)
    return {"message": "User deleted successfully"}


@app.post("/posology")
async def create_upload_file(files: list[UploadFile]):
    print(files)
    contents = [await file.read() for file in files]
    images = [np.array(Image.open(io.BytesIO(content))) for content in contents]
    images = [images[0] for i in range(3)]
    return p.getJson(images)


@app.get("/chat")
async def query_groq(message: str):
    id = "123"  # CHANGEME
    return g.chat(id, message)


@app.post("/prescriptions/{user_id}")
async def push_drug_api(user_id: str, drug_dict: dict):
    await db.push_prescription(user_id, drug_dict)
    return await db.get_user(user_id)


@app.get("/prescriptions/{user_id}")
async def get_drugs_api(user_id: str):
    drugs = await db.get_user(user_id)
    return drugs["prescriptions"]


@app.get("/helpees/{email}")
async def get_helpees(email: str):
    users = []
    for user in await db.get_users():
        if user["assistantInfo"]["email"] == email:
            user["_id"] = str(id)
            users.append(user)
    return users
