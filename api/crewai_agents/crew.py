import json
import json
import re
from crewai import Task, Crew, Process
from .agents import (
    nlp_agent,
    flight_search_agent,
    hotel_search_agent,
    results_combiner_agent,
)
from .schemas import Flight, Hotel, SearchResults
from .tools import MOCK_FLIGHTS, MOCK_HOTELS, should_use_mocks

def kickoff_search_crew(query: str):
    """
    Initiates the CrewAI search workflow with a user query.
    """
    if should_use_mocks():
        flights = [Flight(**f) for f in MOCK_FLIGHTS]
        hotels = [Hotel(**h) for h in MOCK_HOTELS]
        return SearchResults(flights=flights, hotels=hotels)

    parse_query_task = Task(
        description=(
            "Analyze the user's natural language query below to extract key travel parameters "
            "such as destination city and potential IATA codes. "
            "Return only the structured JSON.\n\n"
            f"User query: ```{query}```"
        ),
        expected_output=(
            "Return a compact JSON object with only two keys: "
            "'destination' (city name or null) and 'destinationCode' (IATA code or null). "
            "Do not include any extra prose or fields."
        ),
        agent=nlp_agent,
    )

    search_flights_task = Task(
        description=(
            "Search for available flights to the specified destination using the extracted IATA code. "
            "Consider current date for departure and a single adult passenger. "
            "If the parsed data does not include a usable IATA code, respond with an empty JSON list."
        ),
        expected_output=(
            "Produce a JSON list with at most 5 flight objects, each containing only "
            "'airline', 'flightNumber', 'from', 'to', and 'price'. "
            "Omit explanations and discard extra entries."
        ),
        agent=flight_search_agent,
        context=[parse_query_task],
    )

    search_hotels_task = Task(
        description=(
            "Search for available hotels in the specified destination city. "
            "Use the parsed destination city name; if unavailable, return an empty list."
        ),
        expected_output=(
            "Produce a JSON list with at most 5 hotel objects, each containing only "
            "'id', 'name', 'location', and 'pricePerNight'. "
            "Omit commentary and trim long descriptions."
        ),
        agent=hotel_search_agent,
        context=[parse_query_task],
    )

    combine_results_task = Task(
        description=(
            "Combine the flight and hotel search results into a single JSON object with keys 'flights' and 'hotels'. "
            "Ensure the output is valid JSON. Do not add extra commentary."
        ),
        expected_output=(
            "A JSON object with two keys: 'flights' and 'hotels'. Each key must map to the already trimmed lists. "
            "If either list was empty in the prior step, keep it as an empty list. Do not wrap the response in code fences."
        ),
        agent=results_combiner_agent,
        context=[search_flights_task, search_hotels_task],
    )

    dynamic_crew = Crew(
        agents=[nlp_agent, flight_search_agent, hotel_search_agent, results_combiner_agent],
        tasks=[parse_query_task, search_flights_task, search_hotels_task, combine_results_task],
        verbose=False,
        process=Process.sequential,
    )

    raw_output = dynamic_crew.kickoff()
    cleaned_output = _strip_code_fences(raw_output)
    try:
        data = json.loads(cleaned_output)
        return SearchResults(**data)
    except (json.JSONDecodeError, TypeError):
        raise ValueError(f"Unable to parse crew output: {raw_output!r}")

def _strip_code_fences(text: str) -> str:
    """
    Removes leading/trailing Markdown code fences (``` or ```json) from output.
    """
    if not isinstance(text, str):
        return text

    cleaned = text.strip()
    fence_pattern = r"^```(?:json)?\s*([\s\S]*?)\s*```$"
    match = re.match(fence_pattern, cleaned, flags=re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return cleaned
