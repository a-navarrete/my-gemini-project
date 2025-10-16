from crewai import Agent
from crewai_tools import Tool
from langchain_google_genai import ChatGoogleGenerativeAI
import os

# Assuming tools.py is in the same directory
from .tools import NLPParsingTool, FlightSearchTool, HotelSearchTool, BookingPersistenceTool, PaymentProcessingTool

# Initialize the LLM for the agents
# Ensure GEMINI_API_KEY is set in your environment variables
llm = ChatGoogleGenerativeAI(model="gemini-pro", verbose=True, temperature=0.1, google_api_key=os.getenv("GEMINI_API_KEY"))

# Define the NLPAgent
nlp_agent = Agent(
    role='Natural Language Query Analyst',
    goal='Extract structured travel parameters (destination, destinationCode) from a user\'s natural language query.',
    backstory='An AI assistant specialized in understanding and processing human language for travel planning. It meticulously parses queries to identify key travel details.',
    tools=[NLPParsingTool().as_tool()], # Assign the NLPParsingTool
    llm=llm,
    verbose=True,
    allow_delegation=False,
)

# Define the FlightSearchAgent
flight_search_agent = Agent(
    role='Flight Options Specialist',
    goal='Find available flights based on given parameters, specifically a destination IATA code.',
    backstory='An expert in querying flight data, specialized in finding the best flight options from various APIs using IATA codes.',
    tools=[FlightSearchTool().as_tool()], # Assign the FlightSearchTool
    llm=llm,
    verbose=True,
    allow_delegation=False,
)

# Define the HotelSearchAgent
hotel_search_agent = Agent(
    role='Accommodation Specialist',
    goal='Find available hotels based on given parameters, specifically a destination city name.',
    backstory='A seasoned accommodation specialist with deep knowledge of hotel booking systems and finding the best deals.',
    tools=[HotelSearchTool().as_tool()], # Assign the HotelSearchTool
    llm=llm,
    verbose=True,
    allow_delegation=False,
)

# Define the BookingAgent
booking_agent = Agent(
    role='Booking Specialist',
    goal='To persist a validated booking into the database.',
    backstory='A meticulous and reliable AI assistant responsible for validating and persisting booking details to the database.',
    tools=[BookingPersistenceTool().as_tool()], # Assign the BookingPersistenceTool
    llm=llm,
    verbose=True,
    allow_delegation=False,
)

# Define the PaymentAgent
payment_agent = Agent(
    role='Payment Processor',
    goal='To process a payment and return a transaction ID.',
    backstory='A secure and reliable AI component for processing financial transactions.',
    tools=[PaymentProcessingTool().as_tool()], # Assign the PaymentProcessingTool
    llm=llm,
    verbose=True,
    allow_delegation=False,
)
