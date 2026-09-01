import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

/**
 * @openapi
 * /api/mechanics:
 *   get:
 *     summary: List all mechanics with job counts and current booking
 *     tags: [Mechanics]
 *     responses:
 *       200:
 *         description: List of mechanics
 */
// GET /api/mechanics
router.get("/", async (req, res) => {
  try {
    const mechanics = await prisma.mechanic.findMany({
      include: {
        bookings: {
          select: { id: true, status: true, scheduledAt: true, vehicle: true },
          orderBy: { scheduledAt: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    const result = await Promise.all(
      mechanics.map(async (m) => {
        const jobsCompleted = await prisma.booking.count({
          where: { mechanicId: m.id, status: "COMPLETED" },
        });
        return {
          id: m.id,
          name: m.name,
          status: m.status,
          jobsCompleted,
          currentBooking: m.bookings[0] ?? null,
        };
      })
    );

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load mechanics" });
  }
});

export default router;