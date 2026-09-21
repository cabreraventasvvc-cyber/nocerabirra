-- Optional stock quantity and automatic discount for WhatsApp orders.
-- Run this once in Supabase SQL Editor.

alter table public.products
add column if not exists stock_quantity numeric(12, 2);

create or replace function public.decrement_product_stock(items_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  requested_product_id uuid;
  requested_quantity numeric;
  product_row public.products%rowtype;
begin
  if jsonb_typeof(items_payload) <> 'array' then
    return jsonb_build_object('ok', false, 'message', 'Pedido invalido.');
  end if;

  for item in select * from jsonb_array_elements(items_payload)
  loop
    requested_product_id := (item ->> 'product_id')::uuid;
    requested_quantity := (item ->> 'quantity')::numeric;

    if requested_quantity <= 0 then
      return jsonb_build_object('ok', false, 'message', 'Cantidad invalida.');
    end if;

    select *
    into product_row
    from public.products
    where id = requested_product_id
    for update;

    if not found or not product_row.active then
      return jsonb_build_object('ok', false, 'message', 'Producto no disponible.');
    end if;

    if product_row.stock_quantity is not null and product_row.stock_quantity < requested_quantity then
      return jsonb_build_object(
        'ok', false,
        'message', 'No hay stock suficiente para ' || product_row.name || '. Stock actual: ' || product_row.stock_quantity
      );
    end if;
  end loop;

  for item in select * from jsonb_array_elements(items_payload)
  loop
    requested_product_id := (item ->> 'product_id')::uuid;
    requested_quantity := (item ->> 'quantity')::numeric;

    update public.products
    set
      stock_quantity = stock_quantity - requested_quantity,
      stock_status = case
        when stock_quantity - requested_quantity <= 0 then 'out_of_stock'
        else stock_status
      end
    where id = requested_product_id
      and stock_quantity is not null;
  end loop;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.decrement_product_stock(jsonb) to anon, authenticated;
