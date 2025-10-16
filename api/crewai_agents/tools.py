import json
import os
import hashlib
import time
from datetime import datetime, timedelta
from typing import ClassVar, Dict, List, Pattern

import regex as re
import requests
from langchain.tools import Tool

from .mock_data import MOCK_FLIGHTS, MOCK_HOTELS, should_use_mocks

class _NLPHelper:
    DESTINATION_ALIASES: ClassVar[Dict[str, Dict[str, str]]] = {
        'new york city': {'city': 'New York', 'iataCode': 'NYC'},
        'new york': {'city': 'New York', 'iataCode': 'NYC'},
        'nyc': {'city': 'New York', 'iataCode': 'NYC'},
        'los angeles': {'city': 'Los Angeles', 'iataCode': 'LAX'},
        'lax': {'city': 'Los Angeles', 'iataCode': 'LAX'},
        'san francisco': {'city': 'San Francisco', 'iataCode': 'SFO'},
        'sfo': {'city': 'San Francisco', 'iataCode': 'SFO'},
        'london': {'city': 'London', 'iataCode': 'LON'},
        'lon': {'city': 'London', 'iataCode': 'LON'},
        'lhr': {'city': 'London', 'iataCode': 'LHR'},
        'paris': {'city': 'Paris', 'iataCode': 'PAR'},
        'par': {'city': 'Paris', 'iataCode': 'PAR'},
        'tokyo': {'city': 'Tokyo', 'iataCode': 'TYO'},
        'tyo': {'city': 'Tokyo', 'iataCode': 'TYO'},
        'madrid': {'city': 'Madrid', 'iataCode': 'MAD'},
        'mad': {'city': 'Madrid', 'iataCode': 'MAD'},
        'barcelona': {'city': 'Barcelona', 'iataCode': 'BCN'},
        'bcn': {'city': 'Barcelona', 'iataCode': 'BCN'},
        'rome': {'city': 'Rome', 'iataCode': 'ROM'},
        'rom': {'city': 'Rome', 'iataCode': 'ROM'},
        'san diego': {'city': 'San Diego', 'iataCode': 'SAN'},
        'san': {'city': 'San Diego', 'iataCode': 'SAN'},
        'chicago': {'city': 'Chicago', 'iataCode': 'CHI'},
        'chi': {'city': 'Chicago', 'iataCode': 'CHI'},
        'miami': {'city': 'Miami', 'iataCode': 'MIA'},
        'mia': {'city': 'Miami', 'iataCode': 'MIA'},
        'boston': {'city': 'Boston', 'iataCode': 'BOS'},
        'bos': {'city': 'Boston', 'iataCode': 'BOS'},
    }

    SORTED_ALIAS_KEYS: ClassVar[List[str]] = sorted(DESTINATION_ALIASES.keys(), key=len, reverse=True)

    IATA_CODE_REGEX: ClassVar[Pattern[str]] = re.compile(r'\b([A-Z]{3})\b')
    STOP_WORD_REGEX: ClassVar[Pattern[str]] = re.compile(r'\b(for|with|on|in|by|during|next|this|today|tomorrow|from)\b', re.IGNORECASE)

    @classmethod
    def run(cls, query: str) -> dict:
        if not isinstance(query, str):
            return {"destination": None, "destinationCode": None}

        explicit_code_match = cls.IATA_CODE_REGEX.search(query)
        if explicit_code_match:
            candidate = explicit_code_match.group(1).upper()
            alias = cls.DESTINATION_ALIASES.get(candidate.lower())
            return {
                "destination": alias['city'] if alias else None,
                "destinationCode": alias['iataCode'] if alias else candidate,
            }

        normalized_query = query.lower()
        for alias_key in cls.SORTED_ALIAS_KEYS:
            if alias_key in normalized_query:
                alias = cls.DESTINATION_ALIASES[alias_key]
                return {"destination": alias['city'], "destinationCode": alias['iataCode']}

        destination_match = re.search(r'to\s+([\w\s]+)', query, re.IGNORECASE)
        if destination_match:
            raw_destination = destination_match.group(1).strip()
            truncated_destination = cls.STOP_WORD_REGEX.split(raw_destination, 1)[0].strip()
            truncated_destination = re.split(r'[,.!?]', truncated_destination, 1)[0].strip()
            return {
                "destination": truncated_destination if truncated_destination else None,
                "destinationCode": None,
            }

        return {"destination": None, "destinationCode": None}

def _nlp_tool_fn(query: str) -> str:
    result = _NLPHelper.run(query)
    return json.dumps(result)

def _get_amadeus_token() -> str:
    amadeus_api_key = os.getenv('AMADEUS_API_KEY')
    amadeus_api_secret = os.getenv('AMADEUS_API_SECRET')

    if not amadeus_api_key or not amadeus_api_secret:
        raise ValueError('Amadeus API key or secret not provided in environment variables.')

    token_url = 'https://test.api.amadeus.com/v1/security/oauth2/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    data = {
        'grant_type': 'client_credentials',
        'client_id': amadeus_api_key,
        'client_secret': amadeus_api_secret
    }
    response = requests.post(token_url, headers=headers, data=data)
    response.raise_for_status()
    return response.json()['access_token']

def _normalize_amadeus_response(data: list) -> list:
    normalized_flights = []
    for offer in data:
        first_itinerary = offer['itineraries'][0]
        first_segment = first_itinerary['segments'][0]
        normalized_flights.append({
            'id': offer.get('id'),
            'airline': first_segment['carrierCode'],
            'flightNumber': f"{first_segment['carrierCode']} {first_segment['number']}",
            'from': first_segment['departure']['iataCode'],
            'to': first_segment['arrival']['iataCode'],
            'price': float(offer['price']['total']),
        })
    return normalized_flights

def _resolve_destination_code(value: str) -> str | None:
    if not isinstance(value, str) or not value.strip():
        return None
    trimmed = value.strip()
    if re.fullmatch(r'^[A-Z]{3}$', trimmed, re.IGNORECASE):
        return trimmed.upper()
    return None

def _flight_tool_fn(destination_iata_code: str) -> str:
    if should_use_mocks():
        return json.dumps(MOCK_FLIGHTS)

    resolved_code = _resolve_destination_code(destination_iata_code)
    if not resolved_code:
        return json.dumps([])

    try:
        token = _get_amadeus_token()
        today = datetime.now().strftime('%Y-%m-%d')

        amadeus_url = 'https://test.api.amadeus.com/v2/shopping/flight-offers'
        headers = {'Authorization': f'Bearer {token}'}
        params = {
            'originLocationCode': 'NYC',
            'destinationLocationCode': resolved_code,
            'departureDate': today,
            'adults': 1,
        }

        response = requests.get(amadeus_url, headers=headers, params=params)
        response.raise_for_status()

        raw_offers = response.json().get('data', [])[:5]
        normalized = _normalize_amadeus_response(raw_offers)
        return json.dumps(normalized)
    except requests.exceptions.RequestException as exc:
        print(f"Amadeus API request failed: {exc}")
        return json.dumps([])
    except ValueError as exc:
        print(f"Configuration error: {exc}")
        return json.dumps([])

def _generate_x_signature(api_key: str, api_secret: str) -> str:
    timestamp = str(int(time.time()))
    signature_string = api_key + api_secret + timestamp
    return hashlib.sha256(signature_string.encode('utf-8')).hexdigest()

def _hotelbeds_city_code(city: str) -> str | None:
    mapping = {
        'london': 'LON',
        'paris': 'PAR',
        'madrid': 'MAD',
        'new york': 'NYC',
        'tokyo': 'TYO',
        'rome': 'ROM',
        'berlin': 'BER',
        'dubai': 'DXB',
        'sydney': 'SYD',
        'los angeles': 'LAX',
    }
    return mapping.get(city.lower())

def _normalize_hotelbeds_response(data: list) -> list:
    normalized_hotels = []
    for hotel in data:
        name_field = hotel.get('name')
        if isinstance(name_field, dict):
            name_value = name_field.get('content')
        else:
            name_value = name_field

        price_field = hotel.get('minRate', 0.0)
        try:
            price_value = float(price_field)
        except (TypeError, ValueError):
            price_value = 0.0

        hotel_id = hotel.get('code')
        if hotel_id is not None:
            hotel_id = str(hotel_id)

        normalized_hotels.append({
            'id': hotel_id,
            'name': name_value,
            'location': hotel.get('destinationName'),
            'pricePerNight': price_value,
        })
    return normalized_hotels

def _hotel_tool_fn(destination_city: str) -> str:
    if should_use_mocks():
        return json.dumps(MOCK_HOTELS)

    if not isinstance(destination_city, str):
        return json.dumps([])

    hotelbeds_code = _hotelbeds_city_code(destination_city)
    if not hotelbeds_code:
        print(f"No Hotelbeds code found for destination: {destination_city}")
        return json.dumps([])

    try:
        hotelbeds_api_key = os.getenv('HOTELBEDS_API_KEY')
        hotelbeds_api_secret = os.getenv('HOTELBEDS_API_SECRET')

        if not hotelbeds_api_key or not hotelbeds_api_secret:
            raise ValueError('Hotelbeds API key or secret not provided in environment variables.')

        x_signature = _generate_x_signature(hotelbeds_api_key, hotelbeds_api_secret)

        check_in = datetime.now().strftime('%Y-%m-%d')
        check_out = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

        hotelbeds_url = 'https://api.test.hotelbeds.com/hotel-api/1.0/hotels'
        headers = {
            'Api-Key': hotelbeds_api_key,
            'X-Signature': x_signature,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        payload = {
            'stay': {
                'checkIn': check_in,
                'checkOut': check_out,
            },
            'occupancies': [{
                'rooms': 1,
                'adults': 1,
                'children': 0
            }],
            'destination': {
                'code': hotelbeds_code,
            },
            'language': "ENG",
            'currency': "USD"
        }

        response = requests.post(hotelbeds_url, headers=headers, json=payload)
        response.raise_for_status()

        raw_hotels = response.json().get('hotels', {}).get('hotels', [])[:5]
        normalized = _normalize_hotelbeds_response(raw_hotels)
        return json.dumps(normalized)
    except requests.exceptions.RequestException as exc:
        print(f"Hotelbeds API request failed: {exc}")
        return json.dumps([])
    except ValueError as exc:
        print(f"Configuration error: {exc}")
        return json.dumps([])

nlp_tool = Tool.from_function(
    func=_nlp_tool_fn,
    name="Natural Language Processing Tool",
    description="Extract destination and destinationCode from a user's natural language travel query.",
)

flight_tool = Tool.from_function(
    func=_flight_tool_fn,
    name="Flight Search Tool",
    description="Return up to five flight options for a given destination IATA code.",
)

hotel_tool = Tool.from_function(
    func=_hotel_tool_fn,
    name="Hotel Search Tool",
    description="Return up to five hotel options for a given destination city.",
)

__all__ = ["nlp_tool", "flight_tool", "hotel_tool", "should_use_mocks"]
