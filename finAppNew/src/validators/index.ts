import {
  extend,
  setInteractionMode,
  localize
} from "vee-validate/dist/vee-validate.full";
import { isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import translations from "../translations/index";

setInteractionMode("eager");

localize("hr", {
  code: "hr",
  ...translations.hr.validation
});

extend("numberWithComma", {
  validate: value => {
    if (value == null) {
      return true;
    }
    return /^\d+((,|\.)\d{1,4})?$/.test(value);
  }
});

extend("differentFrom", {
  params: ["target"],
  validate: (value, { target }) => {
    if (target == null) {
      return true;
    }
    return value !== target;
  },
  message: "Polje {_field_} mora biti različito od polja {target}!"
});

extend("samePassword", {
  params: ["target"],
  validate: (value, { target }) => {
    if (target == null) {
      return true;
    }
    if (value !== target) {
      return "Lozinke se ne podudaraju!";
    } else {
      return true;
    }
  }
});

extend("dateMustBeBefore", {
  params: ["target"],
  message: "Datum {_field_} mora biti prije datuma {target}!",
  validate: (value, { target }) => {
    if (target == null) {
      return true;
    }

    const valueDate: Date = parseISO(value);
    const targetDate: Date = parseISO(target);

    return isBefore(valueDate, targetDate) || isSameDay(valueDate, targetDate);
  }
});

extend("dateMustBeAfter", {
  params: ["target"],
  message: "Datum {_field_} mora biti poslije datuma {target}!",
  validate: (value, { target }) => {
    if (target == null) {
      return true;
    }

    const valueDate: Date = parseISO(value);
    const targetDate: Date = parseISO(target);

    return isAfter(valueDate, targetDate) || isSameDay(valueDate, targetDate);
  }
});
