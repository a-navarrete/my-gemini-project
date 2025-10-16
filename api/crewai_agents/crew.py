from crewai import Task, Crew, Process
from .agents import nlp_agent, flight_search_agent, hotel_search_agent, booking_agent, payment_agent

# Define Tasks
parse_query_task = Task(
    description=(
        "Analyze the user's natural language query to extract key travel parameters "
        "such as destination city and potential IATA codes. "
        "Focus on identifying the primary destination for flight and hotel searches."
    ),
    expected_output="A JSON object containing 'destination' (city name) and 'destinationCode' (IATA code) or null if not found.",
    agent=nlp_agent,
)

search_flights_task = Task(
    description=(
        "Search for available flights to the specified destination using the extracted IATA code. "
        "Consider current date for departure and a single adult passenger."
    ),
    expected_output="A list of available flights, each with airline, flightNumber, from, to, and price. Return an empty list if no flights are found.",
    agent=flight_search_agent,
)

search_hotels_task = Task(
    description=(
        "Search for available hotels in the specified destination city. "
        "Consider current date for check-in and one night stay for a single adult."
    ),
    expected_output="A list of available hotels, each with id, name, location, and pricePerNight. Return an empty list if no hotels are found.",
    agent=hotel_search_agent,
)

book_trip_task = Task(
    description=(
        "Persist the selected flight, hotel, user information, and payment details into the database. "
        "Ensure all required fields are present and valid before saving."
    ),
    expected_output="A JSON object indicating success or failure of the booking, including a transactionId if successful.",
    agent=booking_agent,
)

process_payment_task = Task(
    description=(
        "Process the payment for the booking. This involves simulating a payment gateway interaction "
        "and generating a unique transaction ID upon successful processing."
    ),
    expected_output="A JSON object indicating success or failure of the payment, including a transactionId if successful.",
    agent=payment_agent,
)

# Define the Crew
travel_crew = Crew(
    agents=[nlp_agent, flight_search_agent, hotel_search_agent, booking_agent, payment_agent],
    tasks=[parse_query_task, search_flights_task, search_hotels_task, book_trip_task, process_payment_task],
    verbose=2, # You can set it to 1 or 2 for different verbosity levels
    process=Process.sequential,
)

def kickoff_crew(query: str):
    """
    Initiates the CrewAI workflow with a user query.
    """
    inputs = {"query": query}
    result = travel_crew.kickoff(inputs=inputs)
    return result
