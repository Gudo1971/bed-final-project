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
import { mapBooking } from "../utils/bookingMapper.js";

// ---------------------------------------------------------
// CREATE BOOKING
// ---------------------------------------------------------
export const createBookingController = async (req, res) => {
  try {
    const {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      propertyId,
    } = req.body;

    const userId = req.user?.id;

    if (
      !checkinDate ||
      !checkoutDate ||
      !numberOfGuests ||
      !totalPrice ||
      !propertyId ||
      !userId
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const booking = await prisma.booking.create({
      data: {
        startDate: new Date(checkinDate),
        endDate: new Date(checkoutDate),
        numberOfGuests,
        totalPrice,
        bookingStatus: "CONFIRMED",
        propertyId,
        userId,
      },
    });

    return res.status(201).json(mapBooking(booking));
  } catch (error) {
    console.error("❌ BOOKING ERROR:", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ---------------------------------------------------------
// GET ALL BOOKINGS
// ---------------------------------------------------------
export const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    return res.status(200).json(bookings.map(mapBooking));
  } catch (error) {
    console.error("❌ ERROR (getAllBookings):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ---------------------------------------------------------
// GET BOOKING BY ID
// ---------------------------------------------------------
export const getBookingByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await getBookingById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json(mapBooking(booking));
  } catch (err) {
    console.error("❌ ERROR (getBookingById):", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ---------------------------------------------------------
// GET BOOKINGS BY USER
// ---------------------------------------------------------
export const getBookingsByUserIdController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await getBookingsByUserId(userId);

    return res.status(200).json(bookings.map(mapBooking));
  } catch (error) {
    console.error("❌ ERROR (getBookingsByUserId):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ---------------------------------------------------------
// GET BOOKINGS BY PROPERTY
// ---------------------------------------------------------
export const getBookingsByPropertyIdController = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const bookings = await getBookingsByPropertyId(propertyId);

    return res.status(200).json(bookings.map(mapBooking));
  } catch (error) {
    console.error("❌ ERROR (getBookingsByPropertyId):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ---------------------------------------------------------
// UPDATE BOOKING
// ---------------------------------------------------------
export const updateBookingController = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
      propertyId,
    } = req.body;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        startDate: checkinDate ? new Date(checkinDate) : existing.startDate,
        endDate: checkoutDate ? new Date(checkoutDate) : existing.endDate,
        numberOfGuests: numberOfGuests ?? existing.numberOfGuests,
        totalPrice: totalPrice ?? existing.totalPrice,
        bookingStatus: bookingStatus ?? existing.bookingStatus,
        propertyId: propertyId ?? existing.propertyId,
      },
    });

    return res.status(200).json({
      message: "Booking updated",
      booking: mapBooking(updated),
    });
  } catch (error) {
    console.error("❌ ERROR (updateBooking):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ---------------------------------------------------------
// DELETE BOOKING
// ---------------------------------------------------------
export const deleteBookingController = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await getBookingById(id);
    if (!existing) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const deleted = await deleteBooking(id);

    return res.status(200).json({
      message: "Booking deleted",
      booking: mapBooking(deleted),
    });
  } catch (error) {
    console.error("❌ ERROR (deleteBooking):", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(500).json({ error: "Something went wrong" });
  }
};

// ---------------------------------------------------------
// GET DISABLED DATES FOR PROPERTY
// ---------------------------------------------------------
export const getDisabledDatesByPropertyIdController = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const bookings = await getBookingsByPropertyId(propertyId);

    const disabledDates = [];

    bookings.forEach(({ startDate, endDate }) => {
      let current = new Date(startDate);
      const end = new Date(endDate);

      while (current <= end) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const d = String(current.getDate()).padStart(2, "0");

        disabledDates.push(`${y}-${m}-${d}`);

        current = new Date(current.getTime() + 86400000);
      }
    });

    return res.status(200).json(disabledDates);
  } catch (error) {
    console.error("❌ ERROR (getDisabledDates):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
