import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  getBookingsByPropertyId,
  deleteBooking,
  updateBooking,
} from "../services/booking.service.js";
import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

// CREATE BOOKING
export const createBookingController = async (req, res) => {
  try {
    const {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      propertyId,
      userId,
    } = req.body;

    if (
      !checkinDate ||
      !checkoutDate ||
      numberOfGuests == null ||
      totalPrice == null ||
      !propertyId ||
      !userId
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const booking = await prisma.booking.create({
      data: {
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        numberOfGuests: Number(numberOfGuests),
        totalPrice: Number(totalPrice),
        bookingStatus: "CONFIRMED",
        propertyId,
        userId,
      },
    });

    return res.status(201).json(booking);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// GET ALL BOOKINGS
export const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// GET BOOKING BY ID
export const getBookingByIdController = async (req, res) => {
  try {
    const id = req.params.id;

    const booking = await getBookingById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    return res.status(200).json(booking);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// GET BOOKINGS BY USER
export const getBookingsByUserIdController = async (req, res) => {
  try {
    const bookings = await getBookingsByUserId(req.params.userId);
    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// GET BOOKINGS BY PROPERTY
export const getBookingsByPropertyIdController = async (req, res) => {
  try {
    const bookings = await getBookingsByPropertyId(req.params.propertyId);
    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// UPDATE BOOKING
export const updateBookingController = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Booking not found" });

    const data = {};

    if (req.body.checkinDate !== undefined)
      data.checkinDate = new Date(req.body.checkinDate);

    if (req.body.checkoutDate !== undefined)
      data.checkoutDate = new Date(req.body.checkoutDate);

    if (req.body.numberOfGuests !== undefined)
      data.numberOfGuests = Number(req.body.numberOfGuests);

    if (req.body.totalPrice !== undefined)
      data.totalPrice = Number(req.body.totalPrice);

    if (req.body.bookingStatus !== undefined)
      data.bookingStatus = req.body.bookingStatus;

    if (req.body.propertyId !== undefined)
      data.propertyId = req.body.propertyId;

    const updated = await prisma.booking.update({
      where: { id },
      data,
    });

    return res.status(200).json(updated);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// DELETE BOOKING
export const deleteBookingController = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await getBookingById(id);
    if (!existing) return res.status(404).json({ error: "Booking not found" });

    const deleted = await deleteBooking(id);

    return res.status(200).json({
      message: "Booking deleted",
      booking: deleted,
    });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// DISABLED DATES
export const getDisabledDatesByPropertyIdController = async (req, res) => {
  try {
    const bookings = await getBookingsByPropertyId(req.params.propertyId);

    const disabledDates = [];

    bookings.forEach(({ checkinDate, checkoutDate }) => {
      let current = new Date(checkinDate);
      const end = new Date(checkoutDate);

      while (current <= end) {
        disabledDates.push(current.toISOString().split("T")[0]);
        current = new Date(current.getTime() + 86400000);
      }
    });

    return res.status(200).json(disabledDates);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
