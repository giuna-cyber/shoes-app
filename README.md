# Shoes App - XCodeLab

Progetto Next.js white-label per negozio di scarpe.

## Percorso locale consigliato

`D:\0. PROGRAMMAZIONE\scarpe-app`

## Dominio

`https://shoes.xcodelab.it`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- Vercel
- Resend per recupero password
- PWA manifest di base

## Installazione

1. Estrarre il progetto.
2. Aprire PowerShell nella cartella.
3. Eseguire:

```powershell
npm.cmd install
```

4. Copiare `.env.example` in `.env.local`.
5. Inserire i valori reali di:
   - `DATABASE_URL`
   - `ADMIN_JWT_SECRET`
   - `RESEND_API_KEY`
   - `MAIL_FROM`
   - `NEXT_PUBLIC_APP_URL`

6. Eseguire:

```powershell
npm.cmd run build
npm.cmd run dev
```

## Database

Il file `database/schema.sql` contiene lo schema completo, inclusa la tabella `admin_password_reset`.

Se il database esiste già, non serve rieseguire tutto. Verificare soltanto che esista:

`admin_password_reset`

## Primo Admin

Aprire:

`/admin/setup`

La pagina funziona solo se la tabella `utenti_admin` è vuota.

## Login

`/admin/login`

## Recupero password

`/admin/forgot-password`

Per l'invio email occorre configurare Resend e autorizzare il dominio mittente.

## Sicurezza

- La password admin è hashata con bcrypt.
- Il JWT admin è salvato in cookie httpOnly.
- Il token di reset password viene salvato nel database solo come SHA-256.
- I link di reset scadono dopo 30 minuti e sono monouso.
- `.env.local` non deve mai essere inviato a GitHub.

## Nota

Il progetto non contiene segreti reali, `node_modules`, `.next` o credenziali.
