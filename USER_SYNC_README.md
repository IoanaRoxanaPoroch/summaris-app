# Sincronizare Utilizatori în Baza de Date

Această aplicație oferă două metode pentru a adăuga utilizatorii care își creează cont în baza de date:

## Metoda 1: Webhook Clerk (Recomandat)

Cea mai bună metodă este să folosești webhook-urile Clerk pentru a sincroniza automat utilizatorii în baza de date când se înregistrează.

### Configurare Webhook în Clerk Dashboard:

1. Mergi la [Clerk Dashboard](https://dashboard.clerk.com)
2. Selectează aplicația ta
3. Mergi la **Webhooks** în meniul lateral
4. Click pe **Add Endpoint**
5. Adaugă URL-ul: `http://your-server-url:8080/webhooks/clerk`
6. Selectează evenimentele:
   - `user.created` (obligatoriu pentru sincronizare)
   - Opțional: `user.updated`, `user.deleted`
7. Salvează webhook-ul

### Cum funcționează:

Când un utilizator se înregistrează prin Clerk, Clerk trimite automat un request POST la endpoint-ul `/webhooks/clerk` cu informațiile utilizatorului. Serverul tău va crea automat utilizatorul în baza de date.

## Metoda 2: Apel API Direct

Dacă vrei să creezi utilizatori manual sau să sincronizezi după înregistrare, poți folosi endpoint-ul API.

### Endpoint API:

```
POST http://localhost:8080/users/api
Content-Type: application/json

{
  "first_name": "Ion",
  "last_name": "Popescu",
  "email": "ion@example.com",
  "password": "parola123"
}
```

### Exemplu de utilizare în React:

```javascript
import { userAPI } from "./services/api";

// După ce utilizatorul se înregistrează prin Clerk
const syncUserToDatabase = async (clerkUser) => {
  try {
    const userData = {
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      email: clerkUser.emailAddresses[0].emailAddress,
      password: "", // Clerk gestionează autentificarea
    };
    
    const result = await userAPI.createUser(userData);
    console.log("User synced:", result);
  } catch (error) {
    console.error("Error syncing user:", error);
  }
};
```

### Exemplu în SignUpPage (opțional):

Dacă vrei să sincronizezi manual după înregistrare în Clerk:

```javascript
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { userAPI } from "../services/api";

export const SignUpPage = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sincronizează utilizatorul în baza de date
      userAPI.createUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0].emailAddress,
        password: "",
      }).catch(console.error);
    }
  }, [user, isLoaded]);

  return (
    // ... component JSX
  );
};
```

## Structura Bazei de Date

Utilizatorii sunt salvați în tabelul `User` cu următoarele câmpuri:
- `id` (String, auto-generat)
- `first_name` (String)
- `last_name` (String)
- `email` (String, unique)
- `password` (String) - lăsat gol pentru utilizatorii Clerk
- `number_of_attempts` (Int, default: 0)
- `created_at` (DateTime, auto-generat)

## Testare

### Testare Webhook (folosind ngrok sau similar):

1. Rulează serverul: `cd server && node index.js`
2. Expune serverul local cu ngrok: `ngrok http 8080`
3. Adaugă URL-ul ngrok în Clerk Dashboard ca webhook endpoint
4. Creează un cont nou prin aplicație
5. Verifică în baza de date că utilizatorul a fost creat

### Testare API Direct:

```bash
curl -X POST http://localhost:8080/users/api \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

## Note Importante

1. **CORS**: Serverul este configurat să accepte request-uri de la orice origine în development. Pentru producție, actualizează configurația CORS în `server/index.js`.

2. **Securitate**: Webhook-urile Clerk ar trebui să fie verificate cu signature-ul lor. Consideră adăugarea verificării în `clerkWebhookController.js`.

3. **Parolă**: Pentru utilizatorii care se înregistrează prin Clerk, câmpul `password` este lăsat gol deoarece Clerk gestionează autentificarea.

4. **Email Unic**: Baza de date are constrângere de unicitate pe email. Dacă un utilizator există deja, vei primi eroare 409.

