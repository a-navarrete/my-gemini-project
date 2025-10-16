import os
from dotenv import load_dotenv
from .crew import kickoff_crew

# Load environment variables from .env file
load_dotenv()

if __name__ == "__main__":
    print("## Welcome to the CrewAI Travel Planner ##")
    print('-----------------------------------------')
    query = input("What kind of trip are you planning? ")
    
    result = kickoff_crew(query)
    print("\n\n########################")
    print("## Here is the Trip Plan")
    print("########################\n")
    print(result)
