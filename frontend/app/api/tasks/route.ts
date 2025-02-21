// app/api/tasks/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Mock user data store
const userTasksDatabase = {
  "1": [
    {
      id: "task-1",
      name: "Finalize project proposal",
      description:
        "Complete the final draft of the Q2 marketing strategy proposal for client review",
      status: "pending",
      dueDate: "2025-03-01T23:59:59Z",
      tags: ["work", "high-priority", "documentation"],
    },
    {
      id: "task-2",
      name: "Weekly team meeting",
      description:
        "Prepare agenda and host weekly team sync to discuss project progress",
      status: "completed",
      completedDate: "2025-02-18T15:30:00Z",
      tags: ["work", "recurring", "meeting"],
    },
    {
      id: "task-3",
      name: "Learn Framer Motion",
      description:
        "Complete the advanced animation tutorial series for React components",
      status: "todo",
      dueDate: "2025-02-25T23:59:59Z",
      tags: ["personal", "learning", "development"],
    },
    {
      id: "task-4",
      name: "Refactor authentication flow",
      description:
        "Implement new middleware approach and improve error handling",
      status: "pending",
      dueDate: "2025-02-23T23:59:59Z",
      tags: ["work", "technical", "security"],
    },
    {
      id: "task-5",
      name: "Grocery shopping",
      description: "Buy ingredients for weekend dinner party",
      status: "todo",
      dueDate: "2025-02-22T18:00:00Z",
      tags: ["personal", "errands"],
    },
    {
      id: "task-6",
      name: "Update portfolio website",
      description:
        "Add recent projects and refresh design with new color scheme",
      status: "completed",
      completedDate: "2025-02-15T20:45:00Z",
      tags: ["personal", "design", "career"],
    },
  ],
};

function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, process!.env!.JWT_SECRET as string);
    return (decoded as unknown as { id: string }).id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    // Get the session token from cookies
    const cookieManager = await cookies();
    const sessionToken = cookieManager.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user ID from token
    const userId: keyof typeof userTasksDatabase = getUserIdFromToken(
      sessionToken
    ) as keyof typeof userTasksDatabase;

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const tagFilter = searchParams.get("tag");

    // Get user's tasks from mock database
    let tasks = userTasksDatabase[userId] || [];

    // Apply filters if provided
    if (statusFilter) {
      tasks = tasks.filter((task) => task.status === statusFilter);
    }

    if (tagFilter) {
      tasks = tasks.filter((task) => task.tags.includes(tagFilter));
    }

    // Return task statistics along with the filtered tasks
    const statistics = {
      total: userTasksDatabase[userId]?.length || 0,
      completed:
        userTasksDatabase[userId]?.filter((t) => t.status === "completed")
          .length || 0,
      pending:
        userTasksDatabase[userId]?.filter((t) => t.status === "pending")
          .length || 0,
      todo:
        userTasksDatabase[userId]?.filter((t) => t.status === "todo").length ||
        0,
    };

    return NextResponse.json(
      {
        userId,
        statistics,
        tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new task
export async function POST(req: Request) {
  try {
    const cookieManager = await cookies();
    const sessionToken = cookieManager.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = getUserIdFromToken(
      sessionToken
    ) as keyof typeof userTasksDatabase;
    const taskData = await req.json();

    // Validate required fields
    if (!taskData.name) {
      return NextResponse.json(
        { error: "Task name is required" },
        { status: 400 }
      );
    }

    // Create new task with defaults
    const newTask = {
      id: `task-${Date.now()}`,
      name: taskData.name,
      description: taskData.description || "",
      status: taskData.status || "todo",
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
    };

    // In a real implementation, you would save to a database
    // For this mock, we'll just add to our in-memory store
    if (!userTasksDatabase[userId]) {
      userTasksDatabase[userId] = [];
    }

    userTasksDatabase[userId].push(newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
