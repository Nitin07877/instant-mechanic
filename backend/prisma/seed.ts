import "dotenv/config";
import { PrismaClient, BookingStatus, MechanicStatus } from "../src/generated/prisma/client";
import { faker } from "@faker-js/faker";
import * as process from "process";

const prisma = new PrismaClient();

const SERVICES = [
  { name: "Oil Change", category: "Maintenance" },
  { name: "Brake Inspection", category: "Maintenance" },
  { name: "Battery Replacement", category: "Electrical" },
  { name: "AC Repair", category: "Climate" },
  { name: "Engine Diagnostics", category: "Diagnostics" },
  { name: "Tire Rotation", category: "Maintenance" },
  { name: "Transmission Service", category: "Drivetrain" },
  { name: "Wheel Alignment", category: "Maintenance" },
  { name: "Windshield Repair", category: "Body" },
  { name: "Full Inspection", category: "Diagnostics" },
];

const STATUS_WEIGHTS: { status: BookingStatus; weight: number }[] = [
  { status: "COMPLETED", weight: 45 },
  { status: "PENDING", weight: 15 },
  { status: "ASSIGNED", weight: 10 },
  { status: "ON_THE_WAY", weight: 8 },
  { status: "IN_PROGRESS", weight: 12 },
  { status: "CANCELLED", weight: 10 },
];

function weightedStatus(): BookingStatus {
  const total = STATUS_WEIGHTS.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * total;
  for (const s of STATUS_WEIGHTS) {
    if (roll < s.weight) return s.status;
    roll -= s.weight;
  }
  return "COMPLETED";
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.customer.deleteMany();

  console.log("Seeding services...");
  const services = await Promise.all(
    SERVICES.map((s) => prisma.service.create({ data: s }))
  );

  console.log("Seeding mechanics...");
  const mechanicStatuses: MechanicStatus[] = ["AVAILABLE", "ON_JOB", "OFF_DUTY"];
  const mechanics = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.mechanic.create({
        data: {
          name: faker.person.fullName(),
          status: faker.helpers.arrayElement(mechanicStatuses),
        },
      })
    )
  );

  console.log("Seeding customers...");
  const customers = await Promise.all(
    Array.from({ length: 60 }).map(() =>
      prisma.customer.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
        },
      })
    )
  );

  console.log("Seeding bookings...");
  const bookingsData = Array.from({ length: 550 }).map(() => {
    const status = weightedStatus();
    const scheduledAt = faker.date.between({
      from: "2026-04-01T00:00:00.000Z",
      to: "2026-09-01T00:00:00.000Z",
    });
    const hasMechanic = status !== "PENDING";

    return {
      customerId: faker.helpers.arrayElement(customers).id,
      mechanicId: hasMechanic ? faker.helpers.arrayElement(mechanics).id : null,
      serviceId: faker.helpers.arrayElement(services).id,
      vehicle: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
      status,
      amount: faker.number.float({ min: 40, max: 850, fractionDigits: 2 }),
      scheduledAt,
    };
  });

  // Insert in batches to keep this fast
  const BATCH_SIZE = 50;
  for (let i = 0; i < bookingsData.length; i += BATCH_SIZE) {
    const batch = bookingsData.slice(i, i + BATCH_SIZE);
    await prisma.booking.createMany({ data: batch });
    console.log(`Inserted ${Math.min(i + BATCH_SIZE, bookingsData.length)}/${bookingsData.length} bookings`);
  }

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());