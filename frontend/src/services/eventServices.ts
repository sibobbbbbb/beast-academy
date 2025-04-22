const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface EventData {
  id: string
  title: string
  images: string
  description: string
  posted_at: string
  imageFile?: File
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
    // Validate required fields as the backend does
    if (!eventData.title || !eventData.description) {
      throw new Error("Title and description are required fields")
    }

    console.log("Event data to be sent:", eventData)
    
    // FORM DATA
    const formData = new FormData();
    formData.append('title', eventData.title || '');
    formData.append('description', eventData.description || '');

    if (eventData.imageFile) {
      formData.append('img_file', eventData.imageFile);
    }

    if (eventData.images) {
      formData.append('images', eventData.images);
    }

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      body: formData,
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
    // Validate required fields as the backend does
    if (!eventData.title || !eventData.description) {
      throw new Error("Title and description are required fields")
    }
    
    // FORM DATA
    const formData = new FormData();
    formData.append('title', eventData.title || '');
    formData.append('description', eventData.description || '');

    if (eventData.imageFile) {
      formData.append('img_file', eventData.imageFile);
    }
    
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      body: formData,
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