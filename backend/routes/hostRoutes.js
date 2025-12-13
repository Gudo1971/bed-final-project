import  express from "express";
import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";    

const router  =  express.Router();

// ✅ GET /users/:id
router.get("/:id", async (req, res)=>{
    const {id} = req.params;

    // ✅ UUID-validatie
    if (!isUuid(id)){
        return res.status(400).json ({ error: "Invalid Host ID Format"});
    }
    try {
        const host =await prisma.host.findUnique({
            where: { id },
        });

        // 404 als host niet bestaat
        if (!host){
            return res.status (404).json ({ error: "Host not found"});
        }

        res.json (host);
    } catch (error){
        console.error("Error fetching host:", error);
        res.status(500).json({ error: "Internal server error"});
    }
});

// ✅ GET /hosts/:id/properties
router.get("/:id/properties", async (req, res) => {
  const { id } = req.params;

  // ✅ UUID-validatie
  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid host ID format" });
  }

  try {
    // ✅ Check of host bestaat
    const host = await prisma.host.findUnique({
      where: { id },
    });

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    // ✅ Haal properties op
    const properties = await prisma.property.findMany({
      where: { hostId: id },
    });

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties for host:", error);
    res.status(500).json({ error: "Internal server error" });
  }

});

export default router;

