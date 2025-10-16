import os
from typing import Dict, List

MOCK_FLIGHTS: List[Dict[str, object]] = [
    {
        "id": "MOCK-FLT-1",
        "airline": "DemoAir",
        "flightNumber": "DA 100",
        "from": "NYC",
        "to": "LON",
        "price": 512.34,
    },
    {
        "id": "MOCK-FLT-2",
        "airline": "SampleJet",
        "flightNumber": "SJ 202",
        "from": "NYC",
        "to": "LON",
        "price": 548.90,
    },
]

MOCK_HOTELS: List[Dict[str, object]] = [
    {
        "id": "MOCK-HOTEL-1",
        "name": "Mock Grand London",
        "location": "London City Center",
        "pricePerNight": 189.00,
    },
    {
        "id": "MOCK-HOTEL-2",
        "name": "Demo Riverside Inn",
        "location": "London South Bank",
        "pricePerNight": 164.50,
    },
]

def should_use_mocks() -> bool:
    """
    Returns True when CrewAI execution should rely on mock data instead of external APIs.
    """
    return os.getenv("CREWAI_USE_MOCKS", "false").lower() in ("1", "true", "yes", "on")
