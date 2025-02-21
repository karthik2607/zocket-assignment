from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os

app = Flask(__name__)
CORS(app)

# Initialize Gemini API
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Sample task data
tasks = [
    {"id": "task-1", "name": "Finalize project proposal", "description": "Complete the final draft of the Q2 marketing strategy proposal for client review", "status": "pending", "dueDate": "2025-03-01T23:59:59Z", "tags": ["work", "high-priority", "documentation"]},
    {"id": "task-2", "name": "Weekly team meeting", "description": "Prepare agenda and host weekly team sync to discuss project progress", "status": "completed", "completedDate": "2025-02-18T15:30:00Z", "tags": ["work", "recurring", "meeting"]},
    {"id": "task-3", "name": "Learn Framer Motion", "description": "Complete the advanced animation tutorial series for React components", "status": "todo", "dueDate": "2025-02-25T23:59:59Z", "tags": ["personal", "learning", "development"]},
    {"id": "task-4", "name": "Refactor authentication flow", "description": "Implement new middleware approach and improve error handling", "status": "pending", "dueDate": "2025-02-23T23:59:59Z", "tags": ["work", "technical", "security"]},
    {"id": "task-5", "name": "Grocery shopping", "description": "Buy ingredients for weekend dinner party", "status": "todo", "dueDate": "2025-02-22T18:00:00Z", "tags": ["personal", "errands"]},
    {"id": "task-6", "name": "Update portfolio website", "description": "Add recent projects and refresh design with new color scheme", "status": "completed", "completedDate": "2025-02-15T20:45:00Z", "tags": ["personal", "design", "career"]},
]

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    
    # Construct prompt with task data
    task_context = "\n".join([f"Task: {t['name']}, Status: {t['status']}, Due: {t.get('dueDate', 'N/A')}, Tags: {', '.join(t['tags'])}" for t in tasks])
    prompt = f"""
    You are a task management assistant. Here are the current tasks:
    {task_context}
    
    User: {user_input}
    PS: Just answer straight to the question. Don't ask me anything. JUST STRAIGHT ANSWER TO THE POINT.
    Assistant:
    """
    
    # Generate response using Gemini API
    response = client.models.generate_content(model="gemini-1.5-flash-8b", contents=prompt)    
    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(debug=True)
