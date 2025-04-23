import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export const createEventController = async (req, res) => {

    const {title, images, description} = req.body;

    if (!title){
        return res.status(400).json({
            success: false,
            message: 'Title and description are requried fields'
        })
    };

    try{
        const newevent  = await prisma.events.create({
            data :{
                title,
                images : images || "",
                description : description || "",
                posted_at: new Date(),
            }
        })

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            data : newevent
        });

    } catch(error) {
        console.error('Error creating event:', error);

        return res.status(500).json({
            success : false,
            message: 'Failed to create event',
            error: error.message
        })
    }

}

export const readEventController = async (req, res) => {
    try {
        // Get page parameter from query string, default to 1 if not provided
        const page = parseInt(req.query.page) || 1;
        
        const pageSize = page === 1 ? 20 : 5;
        
        
        const skip = page === 1 ? 0 : 20 + (page - 2) * 5;
        
        // Get total count for pagination metadata
        const totalCount = await prisma.events.count();
        
        // Fetch events with pagination
        const events = await prisma.events.findMany({
            skip,
            take: pageSize,
            orderBy: {
                posted_at: 'desc' // Most recent events first
            }
        });
        
        // Calculate if there are more items to load
        const loadedSoFar = page === 1 ? 20 : 20 + (page - 1) * 5;
        const hasMore = totalCount > loadedSoFar;
        
        // Return paginated response
        res.status(200).json({
            success: true,
            message: "Success fetching data",
            data: events,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                hasMore
            }
        });
    } catch (error) {
        console.log("Error getting data:", error);
        
        res.status(500).json({
            success: false,
            message: "Failed to get data",
            error: error.message
        });
    }
};

export const updateEventController = async (req, res) => {
    const {id} = req.params;
    const {title, images, description} = req.body

    try{
        const event = await prisma.events.update({
            where : {id : parseInt(id)},
            data : {
                title,
                images: images || "",
                description,
            }
        })
        
        res.status(201).json({
            success: true,
            message: "sucessfully to update event",
            data : event
        })

    }catch(error){
        console.log("Error Update event")

        res.status(500).json({
            success:false,
            message:"Failed to update event",
            error : error.message
        })
    }
    
}
export const deleteEventContorller = async (req, res) => {
    const {id} = req.params;
    try{
        await prisma.events.delete({
            where : {id : parseInt(id)},
        })
        res.status(200).json({
            success: true,
            message: "event deleted successfully"
        });
    }catch(error){
        console.log("error delete")
        res.status(500).json({
            success: false,
            message: "failed to delete event"
        })
    } 
}

export const readEventControllerId = async (req, res) => {
    const {id} = req.params;
    try{

        const event = await prisma.events.findUnique({
            where : {id : parseInt(id)}
        })

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Event found",
            data : event
        })
    }catch(error){
        console.log("error get event")
        res.status(500).json({
            success: false,
            message: "Failed to get event",
            error: error.message
        })
    }
}

export const likeEventController = async (req, res) => {
    try {
        const { event_id, user_id } = req.body;

        const result = await prisma.liked_by.create({
        data: {
            u_id: user_id,
            e_id: event_id
        }
        });

        res.status(201).json({
        success: true,
        message: "Event liked successfully",
        data: result
        });
    } catch (error) {
        console.error("Error liking event:", error);
        res.status(500).json({
        success: false,
        message: "Failed to like event",
        error: error.message
        });
    }
};

export const unlikeEventController = async (req, res) => {
    try {
        const { event_id, user_id } = req.body;

        const result = await prisma.liked_by.deleteMany({
            where: {
                e_id: event_id,
                u_id: user_id
            }
        });

        res.status(200).json({
            success: true,
            message: "Event unliked successfully",
            data: result
        });
    } catch (error) {
        console.error("Error unliking event:", error);
        res.status(500).json({
            success: false,
            message: "Failed to unlike event",
            error: error.message
        });
    }
};

export const readLikedEventControllerId = async (req, res) => {
    const { userId } = req.params;
    try {
        const likedEvents = await prisma.liked_by.findMany({
            where: {
                u_id: parseInt(userId)
            }
        });

        if (likedEvents.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No liked events found for this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Liked events fetched successfully",
            data: likedEvents
        });
    } catch (error) {
        console.error("Error fetching liked events:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch liked events",
            error: error.message
        });
    }
}