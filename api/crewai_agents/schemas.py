from pydantic import BaseModel, Field, field_validator
from typing import List

class Flight(BaseModel):
    airline: str
    flightNumber: str
    from_airport: str = Field(alias="from")
    to_airport: str = Field(alias="to")
    price: float

    class Config:
        populate_by_name = True

class Hotel(BaseModel):
    id: str
    name: str
    location: str
    price_per_night: float = Field(alias="pricePerNight")

    @field_validator("id", mode="before")
    @classmethod
    def _coerce_id(cls, value):
        if value is None:
            return value
        return str(value)

    class Config:
        populate_by_name = True

class SearchResults(BaseModel):
    flights: List[Flight]
    hotels: List[Hotel]
