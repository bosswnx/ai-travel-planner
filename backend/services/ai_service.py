from http import HTTPStatus
import dashscope
import json
import os
from typing import Dict, Any

# Ensure API Key is set
dashscope.api_key = os.getenv("DASHSCOPE_API_KEY")

class AIService:
    @staticmethod
    def generate_itinerary(user_input: str) -> Dict[str, Any]:
        """
        Calls Alibaba DashScope (Qwen) to generate a travel itinerary based on user input.
        Returns a parsed JSON dictionary.
        """
        
        system_prompt = """
        You are an expert AI Travel Planner. Your goal is to create detailed, personalized travel itineraries based on user requests.
        
        CRITICAL INSTRUCTION: You must return ONLY valid JSON. Do not include markdown formatting like ```json ... ```. Just the raw JSON object.
        
        The JSON structure must be exactly as follows:
        {
            "title": "A short, catchy title for the trip",
            "destination_city": "The main city name for this trip (e.g., 'Beijing', 'Tokyo'). Used for map scoping.",
            "summary": "A brief summary of the trip style and highlights",
            "total_budget_estimate": "Estimated total cost string (e.g., '15000 CNY')",
            "itinerary": [
                {
                    "day": 1,
                    "date": "YYYY-MM-DD (if provided, else 'Day 1')",
                    "activities": [
                        {
                            "time": "09:00",
                            "location": "Name of the place. Must be a specific, searchable place name for map geocoding (e.g., 'The Palace Museum'). Do NOT include descriptive text, notes, parentheses, or actions like 'Lunch at...'.",
                            "description": "What to do here",
                            "cost_estimate": "Estimated cost for this activity",
                            "type": "sightseeing|food|transport|accommodation"
                        }
                    ]
                }
            ],
            "budget_breakdown": {
                "accommodation": "Estimated cost",
                "transport": "Estimated cost",
                "food": "Estimated cost",
                "activities": "Estimated cost",
                "misc": "Estimated cost"
            }
        }
        
        If the user input is vague, make reasonable assumptions but prioritize popular and highly-rated options.
        User Input: 
        """

        try:
            response = dashscope.Generation.call(
                model=dashscope.Generation.Models.qwen_plus,
                messages=[
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_input}
                ],
                result_format='message',  # set the result to be "message" format.
            )

            if response.status_code == HTTPStatus.OK:
                content = response.output.choices[0].message.content
                # Clean up potential markdown fences if the model ignores the instruction
                clean_content = content.replace("```json", "").replace("```", "").strip()
                try:
                    return json.loads(clean_content)
                except json.JSONDecodeError:
                    return {
                        "error": "Failed to parse AI response as JSON",
                        "raw_content": content
                    }
            else:
                return {
                    "error": f"API Error: {response.code} - {response.message}"
                }

        except Exception as e:
            return {"error": str(e)}
