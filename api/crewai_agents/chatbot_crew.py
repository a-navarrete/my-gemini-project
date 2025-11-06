import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from .tools import flight_tool, hotel_tool

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
    tools=[flight_tool, hotel_tool], # Add the tools here
    llm=llm,
    verbose=True,
    allow_delegation=True, # Allow delegation to other agents
)

# Define a placeholder task for the travel agent
conversation_task = Task(
    description="""Have a conversation with the user. The user's message is: '{user_message}'.

If the user wants to search for a flight and has not provided all the necessary information (origin, destination, and dates), you must ask for the missing information.
If the user wants to search for a hotel and has not provided all the necessary information (city, check-in date, and check-out date), you must ask for the missing information.
Once you have all the necessary information, use the appropriate tool to perform the search.

When you have flight search results, present them as a numbered list. For each flight, include the flight number, airline, price, and departure and arrival airports.
After presenting the flight options, ask the user if they would like to select a flight.
If the user selects a flight by number, confirm the selection with the user, including the flight details.

When you have hotel search results, format them in a user-friendly way. For each hotel, include the name, location, and price per night.
""",
    expected_output="""A helpful and friendly response to the user's message.
If asking for more information, the response should be a clear question.
If providing search results, the response should be a formatted, numbered list of flights or hotels.
For flights, the format should be:
1. Flight [flight number] with [airline] from [origin] to [destination] for $[price].
2. ...

After presenting the flights, ask the user to select a flight by number.
If the user selects a flight, confirm the selection. For example: 'You have selected flight [flight number] from [origin] to [destination].'

For hotels, the format should be:
- [hotel name] in [location] for $[price] per night.
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

def kickoff_chatbot_crew(user_message: str):
    """
    Initiates the chatbot crew with a user message.
    """
    # Set the user message in the task description
    conversation_task.description = f"Have a conversation with the user. The user's message is: '{user_message}'."
    
    # Kick off the crew
    result = chatbot_crew.kickoff()
    return result

if __name__ == '__main__':
    import sys
    user_message = sys.stdin.read().strip()
    response = kickoff_chatbot_crew(user_message)
    print(response)
