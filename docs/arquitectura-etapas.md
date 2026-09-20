# Arquitectura y etapas

## Decision de alcance

Nocera Bar queda excluido del alcance inicial. No se crea ruta, acceso de navegacion ni modulo admin para el bar.

## Rutas

- `/`: home institucional y comercial.
- `/catalogo`: ecommerce visual.
- `/pedido-rapido`: interfaz para carga rapida de productos.
- `/nocera-birra`: productos propios y futura ficha cervecera.
- `/franquicias`: landing y formulario de interesados.
- `/historia`: linea de tiempo editable.
- `/contacto`: consultas generales.
- `/admin`: vista prevista del panel, todavia sin autenticacion.
- `/admin/importar-lista`: importador local de CSV/Excel con vista previa.

## Tablas Supabase previstas

- `categories`: id, name, description, sort_order, active, created_at, updated_at.
- `products`: id, code, name, description, brand, category_id, presentation, unit, pack_quantity, price, promotional_price, promotion_starts_at, promotion_ends_at, stock_status, active, featured, nocera_product, image_path, updated_at.
- `orders`: id, number, customer_id, customer_snapshot, delivery_mode, address_snapshot, status, total, notes, created_at.
- `order_items`: id, order_id, product_id, product_snapshot, quantity, unit_price, subtotal.
- `customers`: id, first_name, last_name, phone, email, address, city, created_at.
- `contacts`: id, name, phone, email, reason, message, status, created_at.
- `franchise_leads`: id, first_name, last_name, phone, email, city, province, message, status, created_at.
- `site_settings`: key, value, updated_at.
- `price_imports`: id, filename, summary, status, created_at, applied_at.
- `price_import_rows`: id, import_id, code, payload, action, warnings, errors.

## Etapas propuestas

1. Base web, identidad, catalogo semilla, carrito local y WhatsApp configurado.
2. Importador CSV/Excel local y normalizacion del modelo de productos. Implementado como vista previa local.
3. Supabase: base de datos, storage, variables de entorno y persistencia de formularios.
4. Panel admin protegido para productos, categorias, precios y pedidos.
5. Clientes, historial y repetir pedido con precios actuales.
6. SEO, sitemap, Open Graph final, performance y preparacion Vercel.

## Pendientes del cliente

- Textos institucionales definitivos.
- Datos confirmados de franquicias, sin cifras inventadas.
- Redes sociales adicionales si aparecen mas adelante.

## Limitaciones actuales del importador

- El importador analiza CSV, XLS y XLSX desde el navegador.
- Compara por codigo comercial contra los productos semilla actuales.
- Muestra productos nuevos, cambios de precio, productos sin cambio, errores y advertencias.
- La confirmacion queda guardada solo en localStorage hasta conectar Supabase.
- No modifica todavia la base real de productos porque la base de datos aun no existe.

## Supabase preparado

- `.env.example` define las variables publicas necesarias para el cliente anonimo.
- `lib/supabase.ts` crea el cliente solo cuando las variables existen.
- `supabase/schema.sql` contiene el esquema inicial, indices, triggers `updated_at`, RLS y politicas publicas minimas.
- No se usa `service_role` en el frontend.
