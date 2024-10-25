const prisma = require("../db.js"); // Import Prisma Client
const logger = require("../config/logger"); // Import logger

// Function to get all buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await prisma.Buses.findMany({
      include: {
        route: {
          include: {
            departure_city: { select: { city_name: true } },
            arrival_city: { select: { city_name: true } },
          },
        },
      },
    });

    const formattedBuses = buses.map((bus) => ({
      id: bus.bus_id,
      name: bus.bus_name,
      departureTime: bus.departure_time,
      origin: bus.route.departure_city.city_name,
      destination: bus.route.arrival_city.city_name,
      price: bus.price,
      available_seat: bus.available_seats,
      seat_capacity: bus.seat_capacity,
    }));

    logger.info("Successfully fetched all buses");
    res.status(200).json(formattedBuses);
  } catch (error) {
    logger.error(`Error fetching buses: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await prisma.Buses.findUnique({
      where: { bus_id: parseInt(req.params.id) },
    });

    if (!bus) {
      logger.warn(`Bus not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Bus not found" });
    }

    logger.info(`Successfully fetched bus with ID: ${req.params.id}`);
    res.status(200).json(bus);
  } catch (error) {
    logger.error(`Error fetching bus by ID: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get all cities
exports.getCities = async (req, res) => {
  try {
    const cities = await prisma.Cities.findMany();
    logger.info("Successfully fetched all cities");
    res.status(200).json(cities);
  } catch (error) {
    logger.error(`Error fetching cities: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to create a new ticket
exports.createTicket = async (req, res) => {
  const { user_id, bus_id, no_seat, total_price, ticket_code } = req.body;

  try {
    logger.info(`Attempting to create ticket for bus_id: ${bus_id}`);
    const bus = await prisma.Buses.findUnique({
      where: { bus_id: parseInt(bus_id) },
    });

    if (!bus) {
      logger.warn(`Bus with id ${bus_id} not found`);
      return res.status(404).json({ error: "Bus not found" });
    }

    const newTicket = await prisma.Tickets.create({
      data: {
        user_id,
        bus_id,
        no_seat,
        total_price,
        ticket_code,
      },
    });

    logger.info(`New ticket created with ticket code: ${ticket_code}`);
    res.status(201).json(newTicket);
  } catch (error) {
    logger.error(`Error creating ticket: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get all tickets by user_id
exports.getTicketsByUserId = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const tickets = await prisma.Tickets.findMany({
      where: { user_id: parseInt(userId) },
      include: {
        bus: {
          select: {
            bus_name: true,
            departure_time: true,
            price: true,
            route: {
              include: {
                departure_city: { select: { city_name: true } },
                arrival_city: { select: { city_name: true } },
              },
            },
          },
        },
      },
    });

    logger.info(`Successfully fetched tickets for user ID: ${userId}`);
    res.status(200).json(tickets);
  } catch (error) {
    logger.error(`Error fetching tickets: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get ticket by ticket_id
exports.getTicketById = async (req, res) => {
  const ticketId = req.params.ticket_id;

  try {
    const ticket = await prisma.Tickets.findUnique({
      where: { ticket_id: parseInt(ticketId) },
      include: {
        bus: {
          select: {
            bus_name: true,
            departure_time: true,
            price: true,
          },
        },
      },
    });

    if (!ticket) {
      logger.warn(`Ticket not found with ID: ${ticketId}`);
      return res.status(404).json({ error: "Ticket not found" });
    }

    logger.info(`Successfully fetched ticket with ID: ${ticketId}`);
    res.status(200).json(ticket);
  } catch (error) {
    logger.error(`Error fetching ticket: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookedSeatsByBusId = async (req, res) => {
  const { bus_id } = req.params;

  try {
    // Ensure bus_id is a number
    const busId = parseInt(bus_id, 10);
    if (isNaN(busId)) {
      return res.status(400).json({ error: "Invalid bus_id parameter" });
    }

    // Fetch all tickets where the bus_id matches
    const tickets = await prisma.Tickets.findMany({
      where: { bus_id: busId },
      select: { no_seat: true }, // Only select the 'no_seat' field
    });

    // Extract the seat numbers from the tickets
    const bookedSeats = tickets.map((ticket) => ticket.no_seat);

    // Log and send response
    logger.info(`Successfully fetched booked seats for bus ID: ${busId}`);
    res.status(200).json({ bookedSeats });
  } catch (error) {
    logger.error(
      `Error fetching booked seats for bus ID ${bus_id}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Failed to fetch booked seats. Please try again." });
  }
};
