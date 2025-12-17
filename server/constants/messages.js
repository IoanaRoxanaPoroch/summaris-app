export const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email-ul este obligatoriu",
  USER_ID_REQUIRED: "ID-ul utilizatorului este obligatoriu",
  DOCUMENT_ID_REQUIRED: "ID-ul documentului este obligatoriu",
  NAME_REQUIRED: "Numele este obligatoriu",
  SIZE_REQUIRED: "Dimensiunea este obligatorie",
  NAME_AND_SIZE_REQUIRED: "Numele și dimensiunea sunt obligatorii",
  REQUIRED_FIELDS_MISSING: "Toate câmpurile sunt obligatorii",

  USER_NOT_FOUND: "Utilizatorul nu a fost găsit",
  USER_ALREADY_EXISTS: "Utilizatorul există deja",
  USER_ALREADY_EXISTS_EMAIL: "Email-ul există deja",
  USER_WITH_EMAIL_NOT_EXISTS: "Utilizatorul cu acest email nu există",
  USER_WITH_EMAIL_EXISTS: "Un utilizator cu acest email există deja",

  DOCUMENT_NOT_FOUND: "Documentul nu a fost găsit",
  DOCUMENT_PERMISSION_DENIED: "Nu ai permisiunea de a accesa acest document",

  PLAN_REQUIRED: "Planul este obligatoriu",
  PLAN_NOT_FOUND: "Planul selectat nu există",
  INVALID_PLAN_EN: "Invalid plan",

  FREE_ATTEMPTS_LIMIT_REACHED:
    "Ai atins limita de 3 încercări gratuite. Te rugăm să te abonezi pentru a continua.",

  WEBHOOK_EMAIL_NOT_FOUND_IN_PAYLOAD:
    "Email-ul utilizatorului nu a fost găsit în payload-ul webhook-ului",
  WEBHOOK_USER_ID_NOT_FOUND_IN_PAYLOAD:
    "ID-ul utilizatorului nu a fost găsit în payload-ul webhook-ului",

  USER_CREATE_FAILED: "Nu s-a putut crea utilizatorul",
  USER_FETCH_FAILED: "Nu s-a putut obține utilizatorul",
  DOCUMENTS_FETCH_FAILED: "Nu s-au putut obține documentele",
  SUMMARIES_FETCH_FAILED: "Nu s-au putut obține rezumatele",
  DOCUMENT_UPLOAD_FAILED: "Nu s-a putut încărca documentul",
  SUMMARY_GENERATION_FAILED: "Nu s-a putut genera rezumatul",
  USER_SYNC_FAILED_DB: "Nu s-a putut sincroniza utilizatorul în baza de date",
  USER_DELETE_FAILED_DB: "Nu s-a putut șterge utilizatorul din baza de date",
  WEBHOOK_PROCESS_FAILED: "Nu s-a putut procesa webhook-ul",
  SUBSCRIPTION_FETCH_FAILED: "Nu s-a putut obține planul",
  SUBSCRIPTION_SAVE_FAILED: "Nu s-a putut salva planul",

  UNAUTHORIZED: "Neautorizat",
};

export const SUCCESS_MESSAGES = {
  USER_CREATED: "Utilizator creat cu succes",
  USER_ALREADY_EXISTS: "Utilizatorul există deja",
  USER_EXISTS_DB: "Utilizatorul există deja în baza de date",
  USER_SYNCED_DB: "Utilizatorul a fost sincronizat cu succes în baza de date",
  USER_DELETED_DB: "Utilizatorul a fost șters cu succes din baza de date",

  DOCUMENT_UPLOADED: "Documentul a fost încărcat cu succes",
  SUMMARY_GENERATED: "Rezumatul a fost generat cu succes",

  PLAN_SELECTED: "Plan selectat cu succes",

  USER_UPDATE_WEBHOOK_RECEIVED: "Actualizare utilizator primită",
  WEBHOOK_EVENT_UNHANDLED: "Eveniment webhook neprelucrat",
  USER_NOT_FOUND_NOTHING_TO_DELETE:
    "Utilizatorul nu a fost găsit în baza de date, nu există nimic de șters",

  API_SERVER_NAME: "Summaris API Server",
};

export const DETAIL_MESSAGES = {
  EMAIL_REQUIRED_FOR_DOCUMENTS:
    "Email-ul este necesar pentru a obține documentele",
  EMAIL_REQUIRED_FOR_SUMMARIES:
    "Email-ul este necesar pentru a obține rezumatele",
  EMAIL_REQUIRED_FOR_OWNERSHIP_CHECK:
    "Email-ul este necesar pentru a verifica proprietatea documentului",
  EMAIL_PLEASE_PROVIDE: "Te rugăm să furnizezi o adresă de email",
  USER_WITH_EMAIL_NOT_EXISTS: "Utilizatorul cu acest email nu există",
  USER_WITH_ID_NOT_EXISTS: "Utilizatorul cu acest ID nu există",
  DOCUMENT_WITH_ID_NOT_EXISTS: "Documentul cu acest ID nu există",
  USER_ID_REQUIRED_FOR_DOCUMENTS:
    "ID-ul utilizatorului este necesar pentru a obține documentele",
  USER_ID_REQUIRED_FOR_SUMMARIES:
    "ID-ul utilizatorului este necesar pentru a obține rezumatele",
  REQUIRED_FIELDS_EMAIL_NAME_SIZE:
    "Email-ul, numele și dimensiunea sunt obligatorii",
  REQUIRED_FIELDS_NAME_LASTNAME_EMAIL:
    "Prenumele, numele și emailul sunt obligatorii",
  REQUIRED_FIELDS_EMAIL_PLAN: "Email și plan sunt necesare",
};
