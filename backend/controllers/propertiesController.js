import * as propertiesService from '../services/propertiesService.js';
import prisma from "../lib/prisma.js";

export async function getProperties(req, res){
    try{
        const properties = await propertiesService.getAllProperties();
        res.json(properties);

    }catch(error){
        console.error ('Error fetching properties:', error);
        res.status (500).json({ error: 'Failed to fetch properties'});
    }
}

export async function getProperty(req, res){
    try{
        const id  = req.params.id;
        const property = await propertiesService.getPropertyById(id);

        if (!property){
            return res.status(404).json ({error: "Property not found"});
        }
        res.json(property);
    } catch(error){
        console.error("Error fetching propertiey", error);
        res.status(500).json({error: "Failed to fetch property"});

    }
    }
export async function getPropertyBookings(req, res) {
  const { id } = req.params;

  try {
    console.log("Fetching bookings for property:", id);

    const bookings = await prisma.booking.findMany({
      where: { propertyId: id },
      include: { property: true },
    });

    console.log("Bookings found:", bookings);

    res.json(bookings);
  } catch (error) {
    console.error("🔥 Prisma error in getPropertyBookings:", error);
    res.status(500).json({ error: "Failed to fetch property bookings" });
  }
}