from fastapi import FastAPI, UploadFile
from PIL import Image
from services.posology_service import PosologyService
import io

app = FastAPI()

p = PosologyService()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


@app.post("/posology")
async def create_upload_file(files: list[UploadFile]):
    contents = [await file.read() for file in files]
    images = [Image.open(io.BytesIO(content)) for content in contents]
    return p.getJson(images)
