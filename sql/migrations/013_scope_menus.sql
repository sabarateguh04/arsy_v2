UPDATE role_menu
SET allowed = 1
WHERE menu_key IN ('viewMap', 'viewKeselamatan', 'mobile')
  AND role_name IN ('Eksekutif 1', 'Eksekutif 2', 'Eksekutif 3', 'Operator');
