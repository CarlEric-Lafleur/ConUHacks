from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId serializer/deserializer for MongoDB"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


class Period(str, Enum):
    day = "day"
    week = "week"


class Day(str, Enum):
    Sunday = "Sunday"
    Monday = "Monday"
    Tuesday = "Tuesday"
    Wednesday = "Wednesday"
    Thursday = "Thursday"
    Friday = "Friday"
    Saturday = "Saturday"
    Everyday = "Everyday"


class Frequency(BaseModel):
    times: int
    period: Period


class Schedule(BaseModel):
    day: Day
    time: str  # Format: "HH:MM"
    hasBeenNotified: bool = False
    isTaken: bool = False


class Prescription(BaseModel):
    id: str = Field(..., alias="_id")
    drugName: str
    description: str
    quantity: int
    isRenewable: bool
    doctorName: str
    expirationDate: datetime
    startDate: datetime
    endDate: datetime
    freq: Frequency
    instructions: str
    schedule: List[Schedule]


class AssistantInfo(BaseModel):
    name: str
    email: EmailStr
    phoneNumber: str


class AppUser(BaseModel):
    id: str = Field(alias="_id", default=None)
    email: EmailStr
    displayName: str
    phoneNumber: str
    prescriptions: List[Prescription] = []
    assistMode: bool
    role: str
    assistantInfo: Optional[AssistantInfo] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
