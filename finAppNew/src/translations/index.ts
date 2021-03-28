export default {
  en: {
    appTitle: "FinApp"
  },
  hr: {
    appTitle: "FinApp",
    $vuetify: {
      carousel: {
        next: "",
        prev: ""
      },
      close: "x",
      timePicker: {
        am: "",
        pm: ""
      },
      fileInput: {
        counter: "{0} datoteke"
      },
      datePicker: {
        prevMonthAriaLabel: "Prošli mjesec",
        nextMonthAriaLabel: "Sljedeći mjesec",
        prevYearAriaLabel: "Prošla godina",
        nextYearAriaLabel: "Sljedeća godina"
      },
      dataIterator: {
        loadingText: "",
        pageText: "{0}-{1} od {2}",
        noResultsText: "Nema podataka",
        nextPage: "Sljedeća stranica",
        prevPage: "Prošla stranica"
      },
      dataFooter: {
        itemsPerPageText: "Broj zapisa po stranici:",
        itemsPerPageAll: "Svi",
        pageText: "{0}-{1} od {2}",
        nextPage: "Sljedeća stranica",
        prevPage: "Prošla stranica"
      },
      dataTable: {
        itemsPerPageText: "Zapisa po stranici:",
        sortBy: "Sortiraj prema",
        ariaLabel: {
          sortNone: "",
          sortAscending: "Sortiraj uzlazno",
          sortDescending: "Sortiraj silazno"
        }
      },
      noDataText: "Nema podataka",
      badge: "Značka"
    },
    validation: {
      messages: {
        alpha: "{_field_} može sadržavati samo abecedne znakove",
        alpha_num: "{_field_} može sadržavati samo alfanumeričke znakove",
        alpha_dash:
          "{_field_} može sadržavati alfanumeričke znakove kao i crtice i podvlake",
        alpha_spaces:
          "{_field_} može sadržavati samo abecedne znakove kao i razmake",
        between: "{_field_} mora biti između {min} i {max}",
        confirmed: "Potvrda {_field_} ne odgovara",
        digits:
          "{_field_} mora biti numerički i točno sadrživati {length} znamenke",
        dimensions: "{_field_} mora biti {width} piksela za {height} piksela",
        email: "{_field_} mora biti važeća e-pošta",
        excluded: "Vrijednost {_field_} mora biti važeća vrijednost",
        ext: "{_field_} mora biti važeća datoteka",
        image: "{_field_} mora biti slika",
        max_value: "Vrijednost {_field_} mora biti {max} ili manje",
        max: "{_field_} ne smije biti veći od {length} znakova",
        mimes: "{_field_} mora imati valjanu vrstu datoteke",
        min_value: "Vrijednost {_field_} mora biti {min} ili više",
        min: "{_field_} mora biti barem {length} znakova",
        numeric: "{_field_} može sadrživati samo numeričke znakove",
        oneOf: "Vrijednost {_field_} mora biti važeća vrijednost",
        regex: "Oblik {_field_} nije važeći",
        required: "Polje {_field_} je obavezno",
        required_if: "Polje {_field_} je obavezno",
        size: "{_field_} mora biti manje od {size}KB",
        numberWithComma: "Polje {_field_} mora biti brojčani zapis",
        integer: "Polje {_field_} mora biti cjelobrojan"
      }
    }
  }
};
