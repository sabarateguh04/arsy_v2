INSERT IGNORE INTO role_menu (role_name, menu_key, allowed)
SELECT r.name, m.menu_key,
  CASE
    WHEN r.name = 'Eksekutif 1' AND m.grup <> 'Data Master' THEN 1
    WHEN r.name = 'Eksekutif 2' AND (m.menu_key IN ('viewMap', 'viewKeselamatan', 'viewKetertiban', 'viewKelancaran') OR m.grup = 'Data Sekunder') THEN 1
    WHEN r.name = 'Eksekutif 3' AND m.menu_key IN ('viewMap', 'viewKeselamatan', 'viewKeamanan') THEN 1
    WHEN r.name = 'Operator' AND m.menu_key IN ('viewMap', 'viewKeselamatan') THEN 1
    ELSE 0
  END
FROM roles r
CROSS JOIN menus m
WHERE r.name <> 'Admin';
