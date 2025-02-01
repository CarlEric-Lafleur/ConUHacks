from fastapi import APIRouter, Body, HTTPException, status, Response
from models import AppUserModel, UpdateAppUserModel, AppUserCollection
from database import app_user_collection
from bson import ObjectId
from pymongo import ReturnDocument

router = APIRouter()

@router.post(
    "/",
    response_description="Add new app user",
    response_model=AppUserModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_app_user(app_user: AppUserModel = Body(...)):
    """
    Insert a new app user record.

    A unique `id` will be created and provided in the response.
    """
    new_app_user = await app_user_collection.insert_one(
        app_user.dict(by_alias=True, exclude={"id"})
    )
    created_app_user = await app_user_collection.find_one(
        {"_id": new_app_user.inserted_id}
    )
    return created_app_user

@router.get(
    "/",
    response_description="List all app users",
    response_model=AppUserCollection,
    response_model_by_alias=False,
)
async def list_app_users():
    """
    List all of the app user data in the database.

    The response is unpaginated and limited to 1000 results.
    """
    return AppUserCollection(app_users=await app_user_collection.find().to_list(1000))

@router.get(
    "/{id}",
    response_description="Get a single app user",
    response_model=AppUserModel,
    response_model_by_alias=False,
)
async def show_app_user(id: str):
    """
    Get the record for a specific app user, looked up by `id`.
    """
    if (
        app_user := await app_user_collection.find_one({"_id": ObjectId(id)})
    ) is not None:
        return app_user

    raise HTTPException(status_code=404, detail=f"AppUser {id} not found")

@router.put(
    "/{id}",
    response_description="Update an app user",
    response_model=AppUserModel,
    response_model_by_alias=False,
)
async def update_app_user(id: str, app_user: UpdateAppUserModel = Body(...)):
    """
    Update an existing app user record.
    """
    updated_app_user = await app_user_collection.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": app_user.dict(exclude_unset=True)},
        return_document=ReturnDocument.AFTER,
    )

    if updated_app_user is not None:
        return updated_app_user

    raise HTTPException(status_code=404, detail=f"AppUser {id} not found")

@router.delete(
    "/{id}",
    response_description="Delete an app user",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def delete_app_user(id: str):
    """
    Delete an existing app user record.
    """
    delete_result = await app_user_collection.delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"AppUser {id} not found")