# Nocera Web

Etapa 1 de la plataforma web de Nocera: sitio institucional, catalogo inicial, pedido rapido, carrito local y preparacion para administracion futura.

## Comandos

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
```

## Alcance de esta etapa

- Plataforma unica para Nocera Distribuidora, Nocera Birra y Franquicias.
- Nocera Bar queda fuera del alcance por decision del cliente.
- Datos iniciales semilla basados en la lista de precios `L1.19.9 (1).pdf`, fecha 19/09/2026.
- WhatsApp, redes y datos de contacto centralizados en `lib/config.ts`.
- Importador local en `/admin/importar-lista` para CSV, XLS y XLSX.
- Esquema inicial de Supabase en `supabase/schema.sql`.
- Sin credenciales Supabase cargadas todavia.

## Supabase

Copiar `.env.example` como `.env.local` cuando el proyecto Supabase este creado y completar:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
