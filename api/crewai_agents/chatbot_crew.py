import os
import json
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from .tools import flight_search_tool, hotel_tool, hotel_selection_tool

# Load environment variables
load_dotenv()

# Configure the language model
llm = ChatOpenAI(
    model="gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0.2,
)

# Define a new Travel Agent for the chatbot
travel_agent = Agent(
    role='Conversational Travel Agent',
    goal='Have a conversation with the user to help them plan their trip. If the user wants to search for flights, you must gather the origin, destination, and dates. If the user wants to search for hotels, you must gather the city, check-in date, and check-out date. Once you have all the necessary information, you can use the available tools to search for flights or hotels.',
    backstory='You are a friendly and helpful travel agent that can chat with users to help them book their travel.',
    tools=[flight_search_tool, hotel_tool, hotel_selection_tool], # Add the tools here
    llm=llm,
    verbose=True,
    allow_delegation=True, # Allow delegation to other agents
)

GUIDELINE_TEXT = """If the user wants to search for a flight and has not provided all the necessary information (origin, destination, and dates), you must ask for the missing information.
If the user wants to search for a hotel and has not provided all the necessary information (city, check-in date, and check-out date), you must ask for the missing information.
Once you have all the necessary information, use the appropriate tool to perform the search.

When you have flight search results, present them as a numbered list. For each flight, include the flight number, airline, price, and departure and arrival airports.
After presenting the flight options, ask the user if they would like to select a flight.
If the user selects a flight by number, confirm the selection with the user, including the flight details.

When you have hotel search results, format them in a user-friendly way. For each hotel, include the name, location, and price per night.
After presenting the hotel options, ask the user if they would like to select a hotel.
If the user selects a hotel by number, use the 'hotel_selection_tool' with the previously presented hotel results and the user's selected number to confirm the selection with the user, including the hotel details."""


def build_conversation_description(user_message: str, history: list) -> str:
    sanitized_message = user_message.replace("'", "\'")
    history_lines = []

    for entry in history or []:
        role = entry.get('role', 'user')
        text = entry.get('text', '')
        speaker = 'User' if role == 'user' else 'Assistant'
        history_lines.append(f"{speaker}: {text}")

    history_section = ''
    if history_lines:
        history_section = "Conversation history:\n" + "\n".join(history_lines) + "\n\n"

    return (
        f"""{history_section}Have a conversation with the user. The user's message is: '{sanitized_message}'.

{GUIDELINE_TEXT}
"""
    )


# Define a placeholder task for the travel agent
conversation_task = Task(
    description=build_conversation_description('', []),
    expected_output="""A helpful and friendly response to the user's message.
If asking for more information, the response should be a clear question.
If providing search results, the response should be a formatted, numbered list of flights or hotels.
For flights, the format should be:
1. Flight [flight number] with [airline] from [origin] to [destination] for $[price].
2. ...

After presenting the flights, ask the user to select a flight by number.
If the user selects a flight, confirm the selection. For example: 'You have selected flight [flight number] from [origin] to [destination].'

For hotels, the format should be:
1. [hotel name] in [location] for $[price] per night.
2. ...

After presenting the hotels, ask the user to select a hotel by number.
If the user selects a hotel, confirm the selection. For example: 'You have selected [hotel name] in [location].'
""",
    agent=travel_agent,
)

# Define the chatbot crew
chatbot_crew = Crew(
    agents=[travel_agent],
    tasks=[conversation_task],
    process=Process.sequential,
    verbose=True,
)

def kickoff_chatbot_crew(user_message: str, history: list | None = None):
    """Initiates the chatbot crew with a user message and optional history."""

    conversation_task.description = build_conversation_description(user_message, history or [])

    result = chatbot_crew.kickoff()
    return result

if __name__ == '__main__':
    import sys
    raw_input = sys.stdin.read().strip()

    parsed_message = ''
    parsed_history = []

    if raw_input:
        try:
            payload = json.loads(raw_input)
            parsed_message = payload.get('message', '')
            parsed_history = payload.get('history', []) or []
        except json.JSONDecodeError:
            parsed_message = raw_input
            parsed_history = []

    response = kickoff_chatbot_crew(parsed_message, parsed_history)
    print(response)
