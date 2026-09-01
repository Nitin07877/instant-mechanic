import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     summary: Get aggregated dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard stats object
 */
router.get("/", async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      todaysBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      revenueAgg,
      activeMechanics,
      newCustomers,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { scheduledAt: { gte: startOfToday } } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }),
      prisma.mechanic.count({ where: { status: "AVAILABLE" } }),
      prisma.customer.count({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
    ]);

    res.json({
      totalBookings,
      todaysBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue: revenueAgg._sum.amount ?? 0,
      activeMechanics,
      newCustomers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

export default router;