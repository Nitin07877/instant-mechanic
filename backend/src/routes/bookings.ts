import { Router } from "express";
import { prisma } from "../db/prisma";
import type { Prisma } from "../generated/prisma/client";

const router = Router();

/**
 * @openapi
 * /api/bookings:
 *   get:
 *     summary: List bookings with pagination, search, filter, and sort
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, ASSIGNED, ON_THE_WAY, IN_PROGRESS, COMPLETED, CANCELLED] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [scheduledAt, amount, status, createdAt] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated list of bookings
 */
// GET /api/bookings?page=1&limit=20&status=COMPLETED&search=john&sortBy=scheduledAt&sortOrder=desc
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || "scheduledAt";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

    const allowedSortFields = ["scheduledAt", "amount", "status", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "scheduledAt";

    const where: Prisma.BookingWhereInput = {
      ...(status ? { status: status as Prisma.EnumBookingStatusFilter["equals"] } : {}),
      ...(search
        ? {
            OR: [
              { vehicle: { contains: search, mode: "insensitive" } },
              { customer: { name: { contains: search, mode: "insensitive" } } },
              { customer: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: { select: { name: true, email: true } },
          mechanic: { select: { name: true } },
          service: { select: { name: true, category: true } },
        },
        orderBy: { [safeSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

/**
 * @openapi
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a single booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Booking detail
 *       404:
 *         description: Booking not found
 */
// GET /api/bookings/:id
router.get("/:id", async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        mechanic: true,
        service: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load booking" });
  }
});

/**
 * @openapi
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update a booking's status
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [PENDING, ASSIGNED, ON_THE_WAY, IN_PROGRESS, COMPLETED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Updated booking
 *       400:
 *         description: Invalid status
 */
// PATCH /api/bookings/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "PENDING",
      "ASSIGNED",
      "ON_THE_WAY",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        customer: true,
        mechanic: true,
        service: true,
      },
    });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

/**
 * @openapi
 * /api/bookings/export/csv:
 *   get:
 *     summary: Export bookings as a CSV file
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, ASSIGNED, ON_THE_WAY, IN_PROGRESS, COMPLETED, CANCELLED] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema: { type: string }
 */
// GET /api/bookings/export/csv
router.get("/export/csv", async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const where: Prisma.BookingWhereInput = {
      ...(status ? { status: status as Prisma.EnumBookingStatusFilter["equals"] } : {}),
      ...(search
        ? {
            OR: [
              { vehicle: { contains: search, mode: "insensitive" } },
              { customer: { name: { contains: search, mode: "insensitive" } } },
              { customer: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: { select: { name: true, email: true } },
        mechanic: { select: { name: true } },
        service: { select: { name: true, category: true } },
      },
      orderBy: { scheduledAt: "desc" },
    });

    const header = [
      "Booking ID",
      "Customer",
      "Email",
      "Vehicle",
      "Service",
      "Category",
      "Mechanic",
      "Status",
      "Amount",
      "Scheduled At",
    ];

    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

    const rows = bookings.map((b) =>
      [
        b.id,
        b.customer.name,
        b.customer.email,
        b.vehicle,
        b.service.name,
        b.service.category,
        b.mechanic?.name ?? "",
        b.status,
        b.amount.toFixed(2),
        b.scheduledAt.toISOString(),
      ]
        .map((v) => escapeCsv(String(v)))
        .join(",")
    );

    const csv = [header.map(escapeCsv).join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=bookings-export.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export bookings" });
  }
});

export default router;