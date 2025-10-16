import os
from dotenv import load_dotenv
from crewai import Agent
from langchain_openai import ChatOpenAI

from .tools import nlp_tool, flight_tool, hotel_tool

load_dotenv()

# Configure ChatOpenAI to route through OpenRouter.
llm = ChatOpenAI(
    model="gpt-4o",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0.2,
)

# Define the NLPAgent
nlp_agent = Agent(
    role='Natural Language Query Analyst',
    goal='Extract destination and IATA code from travel queries.',
    backstory='Purpose-built to map natural language requests to structured search parameters.',
    tools=[nlp_tool],
    llm=llm,
    verbose=False,
    allow_delegation=False,
)

# Define the FlightSearchAgent
flight_search_agent = Agent(
    role='Flight Options Specialist',
    goal='Find viable flights for a supplied destination code.',
    backstory='Optimized for querying flight data sources and returning concise options.',
    tools=[flight_tool],
    llm=llm,
    verbose=False,
    allow_delegation=False,
)

# Define the HotelSearchAgent
hotel_search_agent = Agent(
    role='Accommodation Specialist',
    goal='Retrieve hotel options for a given destination city.',
    backstory='Trained to source hotel availability and surface the most relevant listings.',
    tools=[hotel_tool],
    llm=llm,
    verbose=False,
    allow_delegation=False,
)

# Define the ResultsCombinerAgent
results_combiner_agent = Agent(
    role='Travel Search Results Synthesizer',
    goal='Merge flight and hotel search output into structured JSON.',
    backstory='Designed to keep responses brief while preserving key booking details.',
    llm=llm,
    verbose=False,
    allow_delegation=False,
)
