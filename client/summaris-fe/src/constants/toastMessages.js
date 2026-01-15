export const ERRORS = {
  UPLOAD_AUTH: "Trebuie să fii autentificat pentru a încărca documente.",
  SELECT_PLAN_AUTH: "Trebuie să fii autentificat pentru a selecta un plan.",
  SELECT_PLAN: "Eroare la selectarea planului.",
  FILE_DIMENSION:
    "Fișierul este prea mare. Dimensiunea maximă permisă este 10MB.",
  FREE_LIMIT:
    "Ai atins limita de 3 rezumate gratuite. Te rugăm să te abonezi pentru a continua.",
  DOCUMENT_EXISTS: "Acest document a fost deja incarcat",
  SINGLE_UPLOAD:
    "Poți încărca doar un singur document. Șterge documentul existent pentru a încărca unul nou.",
  UPLOAD_ERR: "Eroare la încărcarea documentului. Te rugăm să încerci din nou.",
  NO_DOCUMENT_FOR_SUMMARY: "Nu există document pentru care să generezi rezumat.",
  SUMMARY_GENERATION: "Eroare la generarea rezumatului. Te rugăm să încerci din nou.",
};

export const SUCCESS = {
  SELECT_PLAN: "Planul a fost selectat cu succes.",
  SUMMARY_COPIED: "Rezumat copiat în clipboard!",
  SUMMARY_DOWNLOADED: "Rezumat descărcat cu succes!",
  SUMMARY_GENERATED: "Rezumat generat cu succes!",
  UPLOAD_SUCCESS: () => {
    return "Document încărcat cu succes!";
  },
  SUMMARY_SUCCESS: (remainingAttempts) => {
    if (remainingAttempts === -1) {
      return "Rezumat generat cu succes! Ai rezumate nelimitate.";
    }
    return `Rezumat generat cu succes! Mai ai ${remainingAttempts} rezumate rămase.`;
  },
};
