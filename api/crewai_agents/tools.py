from crewai_tools import BaseTool
import re
import os
import hashlib
import time
from datetime import datetime, timedelta
import requests

class NLPParsingTool(BaseTool):
    name: str = "Natural Language Processing Tool"
    description: str = "Extracts structured travel parameters (destination, destinationCode) from a user's natural language query."

    DESTINATION_ALIASES = {
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

    SORTED_ALIAS_KEYS = sorted(DESTINATION_ALIASES.keys(), key=len, reverse=True)

    IATA_CODE_REGEX = re.compile(r'\b([A-Z]{3})\b')
    STOP_WORD_REGEX = re.compile(r'\b(for|with|on|in|by|during|next|this|today|tomorrow|from)\b', re.IGNORECASE)

    def _run(self, query: str) -> dict:
        if not isinstance(query, str):
            return {"destination": None, "destinationCode": None}

        explicit_code_match = self.IATA_CODE_REGEX.search(query)
        if explicit_code_match:
            candidate = explicit_code_match.group(1).upper()
            alias = self.DESTINATION_ALIASES.get(candidate.lower())
            return {
                "destination": alias['city'] if alias else None,
                "destinationCode": alias['iataCode'] if alias else candidate,
            }

        destination_match = re.search(r'to\s+([\p{L}\s]+)', query, re.UNICODE)
        raw_destination = destination_match.group(1).strip() if destination_match else ''
        if not raw_destination:
            return {"destination": None, "destinationCode": None}

        truncated_destination = self.STOP_WORD_REGEX.split(raw_destination, 1)[0].strip()
        truncated_destination = re.split(r'[,.!?]', truncated_destination, 1)[0].strip()

        normalized_destination = truncated_destination.lower()
        matched_alias = next((key for key in self.SORTED_ALIAS_KEYS if normalized_destination.startswith(key)), None)

        if matched_alias:
            alias = self.DESTINATION_ALIASES[matched_alias]
            return {"destination": alias['city'], "destinationCode": alias['iataCode']}

        return {
            "destination": truncated_destination if truncated_destination else None,
            "destinationCode": None,
        }

class FlightSearchTool(BaseTool):
    name: str = "Flight Search Tool"
    description: str = "Finds available flights based on a given destination IATA code. Requires an IATA code for the destination."

    def _get_amadeus_token(self) -> str:
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

    def _normalize_amadeus_response(self, data: list) -> list:
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

    def _resolve_destination_code(self, value: str) -> str | None:
        if not isinstance(value, str) or not value.strip():
            return None
        trimmed = value.strip()
        if re.fullmatch(r'^[A-Z]{3}$', trimmed, re.IGNORECASE):
            return trimmed.upper()
        return None

    def _run(self, destination_iata_code: str) -> list:
        resolved_code = self._resolve_destination_code(destination_iata_code)
        if not resolved_code:
            print(f"No valid IATA code provided for destination: {destination_iata_code}")
            return []

        try:
            token = self._get_amadeus_token()
            today = datetime.now().strftime('%Y-%m-%d')

            amadeus_url = 'https://test.api.amadeus.com/v2/shopping/flight-offers'
            headers = {'Authorization': f'Bearer {token}'}
            params = {
                'originLocationCode': 'NYC', # Hardcoded for now, will be dynamic later
                'destinationLocationCode': resolved_code,
                'departureDate': today,
                'adults': 1,
            }

            response = requests.get(amadeus_url, headers=headers, params=params)
            response.raise_for_status()
            return self._normalize_amadeus_response(response.json()['data'])
        except requests.exceptions.RequestException as e:
            print(f"Amadeus API request failed: {e}")
            return []
        except ValueError as e:
            print(f"Configuration error: {e}")
            return []

class HotelSearchTool(BaseTool):
    name: str = "Hotel Search Tool"
    description: str = "Finds available hotels based on a given destination city name. Returns a list of hotels."

    CITY_TO_HOTELBEDS_CODE = {
        'london': 'LON',
        'paris': 'PAR',
        'madrid': 'MAD',
        'newyork': 'NYC',
        'tokyo': 'TYO',
        'rome': 'ROM',
        'berlin': 'BER',
        'dubai': 'DXB',
        'sydney': 'SYD',
        'losangeles': 'LAX',
        'los angeles': 'LAX',
    }

    def _get_hotelbeds_code(self, city: str) -> str | None:
        return self.CITY_TO_HOTELBEDS_CODE.get(city.lower())

    def _generate_x_signature(self, api_key: str, api_secret: str) -> str:
        timestamp = str(int(time.time()))
        signature_string = api_key + api_secret + timestamp
        return hashlib.sha256(signature_string.encode('utf-8')).hexdigest()

    def _normalize_hotelbeds_response(self, data: list) -> list:
        normalized_hotels = []
        for hotel in data:
            normalized_hotels.append({
                'id': hotel.get('code'),
                'name': hotel.get('name', {}).get('content'),
                'location': hotel.get('destinationName'),
                'pricePerNight': float(hotel.get('minRate', 0.0)),
            })
        return normalized_hotels

    def _run(self, destination_city: str) -> list:
        hotelbeds_code = self._get_hotelbeds_code(destination_city)
        if not hotelbeds_code:
            print(f"No Hotelbeds code found for destination: {destination_city}")
            return []

        try:
            hotelbeds_api_key = os.getenv('HOTELBEDS_API_KEY')
            hotelbeds_api_secret = os.getenv('HOTELBEDS_API_SECRET')

            if not hotelbeds_api_key or not hotelbeds_api_secret:
                raise ValueError('Hotelbeds API key or secret not provided in environment variables.')

            x_signature = self._generate_x_signature(hotelbeds_api_key, hotelbeds_api_secret)

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
            return self._normalize_hotelbeds_response(response.json().get('hotels', {}).get('hotels', []))
        except requests.exceptions.RequestException as e:
            print(f"Hotelbeds API request failed: {e}")
            return []
        except ValueError as e:
            print(f"Configuration error: {e}")
            return []
