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
    "Ai atins limita de 3 rezumate gratuite. Te rugăm să te abonezi pentru a continua.",
  PRO_DAILY_LIMIT_REACHED:
    "Ai atins limita de 5 rezumate pe zi pentru planul Pro. Te rugăm să încerci mâine sau să alegi la planul Premium.",

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

export const LOG_MESSAGES = {
  // Document Controller
  GET_ALL_DOCUMENTS_ERROR: "Get all documents error",
  GET_DOCUMENT_BY_ID_ERROR: "Get document by id error",
  GET_DOCUMENTS_BY_EMAIL_ERROR: "Get documents by email error",
  GET_DOCUMENTS_BY_USER_ID_ERROR: "Get documents by userId error",
  UPDATE_DOCUMENT_ERROR: "Update document error",
  DELETE_DOCUMENT_ERROR: "Delete document error",
  GET_SUMMARIES_BY_EMAIL_ERROR: "Get summaries by email error",
  GET_SUMMARIES_BY_USER_ID_ERROR: "Get summaries by userId error",
  UPLOAD_DOCUMENT_ERROR: "Upload document error",
  SUMMARIZE_DOCUMENT_ERROR: "Summarize document error",

  // User Controller
  CREATE_USER_ERROR: "Create user error",
  GET_USER_BY_EMAIL_ERROR: "Get user by email error",
  GET_ALL_USERS_ERROR: "Get all users error",
  GET_USER_BY_ID_ERROR: "Get user by id error",
  UPDATE_USER_ERROR: "Update user error",
  DELETE_USER_ERROR: "Delete user error",

  // Subscription Controller
  GET_SUBSCRIPTION_ERROR: "Get subscription error",
  SELECT_PLAN_ERROR: "Select plan error",

  // Clerk Webhook Controller
  CLERK_WEBHOOK_USER_CREATED_ERROR:
    "Error handling Clerk webhook - user created",
  CLERK_WEBHOOK_USER_DELETED_ERROR:
    "Error handling Clerk webhook - user deleted",
  CLERK_WEBHOOK_DELETE_DOCUMENT_ERROR: "Error deleting document in webhook",
  CLERK_WEBHOOK_HANDLE_ERROR: "Error handling webhook",

  // Express Middleware
  UNHANDLED_EXPRESS_ERROR: "Unhandled error in Express",
};
