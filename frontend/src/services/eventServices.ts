const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import axios from 'axios'

export interface EventData {
  id: string
  title: string
  images: string
  description: string
  posted_at: string
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  status?: number
  // Add any other properties your API might return
}

interface DeleteEventResponse {
  success: boolean;
  message: string;
}

export const fetchEvents = async (page = 1): Promise<ApiResponse<EventData[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.statusText}`)
    }

    const data: ApiResponse<EventData[]> = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch events:", error)
    throw error
  }
}

export const deleteEvents = async (id: string): Promise<ApiResponse<DeleteEventResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error deleting event: ${response.statusText}`)
    }

    const data: ApiResponse<DeleteEventResponse> = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to delete event with id ${id}:`, error)
    throw error
  }
}

export const editEvents = async (id: string, eventData: EventData): Promise<ApiResponse<EventData>> => {
  try {
    // Make sure we're sending the expected fields based on backend requirements
    const { title, images, description } = eventData

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, images, description }),
    })

    if (!response.ok) {
      throw new Error(`Error updating event: ${response.statusText}`)
    }

    const data: ApiResponse<EventData> = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to update event with id ${id}:`, error)
    throw error
  }
}

export const createEvents = async (eventData: Partial<EventData>): Promise<ApiResponse<EventData>> => {
  try {
    // Make sure we're sending the expected fields based on backend requirements
    const { title, images, description } = eventData

    // Validate required fields as the backend does
    if (!title || !description) {
      throw new Error("Title and description are required fields")
    }

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, images, description }),
    })

    if (!response.ok) {
      throw new Error(`Error creating event: ${response.statusText}`)
    }

    const data: ApiResponse<EventData> = await response.json()
    return data
  } catch (error) {
    console.error("Failed to create event:", error)
    throw error
  }
}

export const fetchEventDetails = async (id: string): Promise<ApiResponse<EventData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventDetails/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching event: ${response.statusText}`)
    }

    const data: ApiResponse<EventData> = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to fetch event with id ${id}:`, error)
    throw error
  }
}

export async function likeEvent(eventId: number, userId: number) {
  return axios.post(`${API_BASE_URL}/likeEvent`, {
    event_id: eventId,
    user_id: userId
  }, { withCredentials: true });
}

export async function unlikeEvent(eventId: number, userId: number) {
  return axios.post(`${API_BASE_URL}/unlikeEvent`, {
    event_id: eventId, 
    user_id: userId
  }, { withCredentials: true });
}