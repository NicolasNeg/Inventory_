insert into warehouses (name, location, is_active)
values ('Principal', 'MEX', true)
on conflict do nothing;
