// ==============================================
// = BOOKING FORM HOOK                           =
// = React Hook Form + Yup validatie             =
// ==============================================

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ==============================================
// = VALIDATIE SCHEMA                            =
// ==============================================
const bookingSchema = yup.object().shape({
  name: yup.string().required("Naam is verplicht"),

  email: yup
    .string()
    .email("Ongeldig e-mailadres")
    .required("E-mail is verplicht"),

  guests: yup
    .number()
    .typeError("Aantal gasten moet een getal zijn")
    .min(1, "Aantal gasten moet minimaal 1 zijn")
    .required("Aantal gasten is verplicht"),

  notes: yup.string().optional(),
});

// ==============================================
// = CUSTOM HOOK                                 =
// = Configureert React Hook Form met Yup        =
// ==============================================
export function useBookingForm() {
  const formMethods = useForm({
    resolver: yupResolver(bookingSchema),
    mode: "onchange",
    defaultValues: {
      name: "",
      email: "",
      guests: 1,
      notes: "",
    },
  });

  return formMethods;
}
