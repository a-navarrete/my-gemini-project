import os
import sys
import json
from dotenv import load_dotenv

from .mock_data import MOCK_FLIGHTS, MOCK_HOTELS, should_use_mocks  # explicit relative import
from .schemas import SearchResults, Flight, Hotel

# Load environment variables from .env file
load_dotenv()

def run_search(query: str):
    if should_use_mocks():
        mock_results = SearchResults(
            flights=[Flight(**flight) for flight in MOCK_FLIGHTS],
            hotels=[Hotel(**hotel) for hotel in MOCK_HOTELS],
        )
        return mock_results.model_dump(by_alias=True)

    from .crew import kickoff_search_crew

    result = kickoff_search_crew(query)
    if hasattr(result, "dict"):
        return result.model_dump(by_alias=True)
    return result

if __name__ == "__main__":
    query = sys.stdin.read()
    result = run_search(query)
    print(json.dumps(result))
