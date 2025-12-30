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

/* ============================================================
   CREATE BOOKING
============================================================ */
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

    /* ============================================================
       INPUT PARSING
       - numberOfGuests kan als string binnenkomen
    ============================================================ */
    const guests = Number(numberOfGuests);

    /* ============================================================
       INPUT VALIDATION
    ============================================================ */
    if (
      !checkinDate ||
      !checkoutDate ||
      !guests ||
      !totalPrice ||
      !propertyId ||
      !userId
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    /* ============================================================
       PROPERTY FETCH
       - ophalen van maxGuestCount en isActive
    ============================================================ */
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        isActive: true,
        maxGuestCount: true, // correcte veldnaam
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property niet gevonden" });
    }

    if (!property.isActive) {
      return res.status(400).json({
        error: "Deze accommodatie is momenteel niet beschikbaar.",
      });
    }

    /* ============================================================
       MAX GUEST VALIDATION
    ============================================================ */
    if (guests > property.maxGuestCount) {
      return res.status(400).json({
        error: `Maximaal ${property.maxGuestCount} gasten toegestaan.`,
      });
    }

    /* ============================================================
       CREATE BOOKING
    ============================================================ */
    const booking = await prisma.booking.create({
      data: {
        startDate: new Date(checkinDate),
        endDate: new Date(checkoutDate),
        numberOfGuests: guests,
        totalPrice,
        bookingStatus: "PENDING",
        propertyId,
        userId,
      },
    });

    return res.status(201).json(mapBooking(booking));
  } catch (error) {
    console.error("BOOKING ERROR:", error);

    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({ error: "Invalid input" });
    }

    return res.status(500).json({ error: "Something went wrong" });
  }
};

/* ============================================================
   GET ALL BOOKINGS
============================================================ */
export const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    return res.status(200).json(bookings.map(mapBooking));
  } catch (error) {
    console.error("ERROR (getAllBookings):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

/* ============================================================
   GET BOOKING BY ID
============================================================ */
export const getBookingByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await getBookingById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json(mapBooking(booking));
  } catch (err) {
    console.error("ERROR (getBookingById):", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

/* ============================================================
   GET BOOKINGS BY USER
============================================================ */
export const getBookingsByUserIdController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await getBookingsByUserId(userId);

    return res.status(200).json(bookings.map(mapBooking));
  } catch (error) {
    console.error("ERROR (getBookingsByUserId):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

/* ============================================================
   GET BOOKINGS BY PROPERTY
============================================================ */
export const getBookingsByPropertyIdController = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const bookings = await getBookingsByPropertyId(propertyId);

    return res.status(200).json(bookings.map(mapBooking));
  } catch (error) {
    console.error("ERROR (getBookingsByPropertyId):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

/* ============================================================
   UPDATE BOOKING
   - Alleen niet-verlopen, niet-gecancelde bookings mogen worden bewerkt
   - Annuleren werkt via bookingStatus: "CANCELED"
============================================================ */
export const updateBookingController = async (req, res) => {
  try {
    const { id } = req.params;

    /* ============================================================
       FETCH EXISTING BOOKING
    ============================================================ */
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const now = new Date();
    const isCanceled = existing.bookingStatus.toLowerCase() === "canceled";
    const isPast = new Date(existing.endDate) < now;

    if (isCanceled) {
      return res.status(400).json({
        error: "Canceled bookings cannot be edited",
      });
    }

    if (isPast) {
      return res.status(400).json({
        error: "Past bookings cannot be edited",
      });
    }

    /* ============================================================
       INPUT PARSING
    ============================================================ */
    const {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      propertyId,
      bookingStatus,
    } = req.body;

    const newStart = checkinDate ? new Date(checkinDate) : existing.startDate;
    const newEnd = checkoutDate ? new Date(checkoutDate) : existing.endDate;

    if (newEnd <= newStart) {
      return res.status(400).json({
        error: "Checkout date must be after checkin date",
      });
    }

    /* ============================================================
       UPDATE BOOKING
    ============================================================ */
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        startDate: newStart,
        endDate: newEnd,
        numberOfGuests: numberOfGuests ?? existing.numberOfGuests,
        totalPrice: totalPrice ?? existing.totalPrice,
        propertyId: propertyId ?? existing.propertyId,
        bookingStatus: bookingStatus ?? existing.bookingStatus,
      },
    });

    return res.status(200).json({
      message: "Booking updated",
      booking: mapBooking(updated),
    });
  } catch (error) {
    console.error("ERROR (updateBooking):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

/* ============================================================
   DELETE BOOKING
   - Alleen canceled bookings mogen verwijderd worden
============================================================ */
export const deleteBookingController = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await getBookingById(id);
    if (!existing) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isCanceled =
      existing.bookingStatus &&
      existing.bookingStatus.toLowerCase() === "canceled";

    if (!isCanceled) {
      return res.status(400).json({
        error: "Only canceled bookings can be deleted",
      });
    }

    const deleted = await deleteBooking(id);

    return res.status(200).json({
      message: "Booking deleted",
      booking: mapBooking(deleted),
    });
  } catch (error) {
    console.error("ERROR (deleteBooking):", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(500).json({ error: "Something went wrong" });
  }
};

/* ============================================================
   GET DISABLED DATES FOR PROPERTY
============================================================ */
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
    console.error("ERROR (getDisabledDates):", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
