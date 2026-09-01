import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

/**
 * @openapi
 * /api/analytics:
 *   get:
 *     summary: Get aggregated analytics data for charts
 *     tags: [Analytics]
 *     description: Returns bookings/revenue over time, status breakdown, and service category breakdown
 *     responses:
 *       200:
 *         description: Analytics data object
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        scheduledAt: true,
        amount: true,
        status: true,
        service: { select: { category: true } },
      },
    });

    // Bookings + revenue over time (grouped by day)
    const byDate = new Map<string, { bookings: number; revenue: number }>();
    for (const b of bookings) {
      const key = b.scheduledAt.toISOString().slice(0, 10); // YYYY-MM-DD
      const entry = byDate.get(key) ?? { bookings: 0, revenue: 0 };
      entry.bookings += 1;
      if (b.status === "COMPLETED") entry.revenue += b.amount;
      byDate.set(key, entry);
    }
    const overTime = Array.from(byDate.entries())
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Status breakdown
    const statusCounts = new Map<string, number>();
    for (const b of bookings) {
      statusCounts.set(b.status, (statusCounts.get(b.status) ?? 0) + 1);
    }
    const statusBreakdown = Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    // Category breakdown
    const categoryCounts = new Map<string, number>();
    for (const b of bookings) {
      const cat = b.service.category;
      categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
    }
    const categoryBreakdown = Array.from(categoryCounts.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    res.json({ overTime, statusBreakdown, categoryBreakdown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

export default router;