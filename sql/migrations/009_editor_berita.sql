INSERT IGNORE INTO roles (name, cakupan, status) VALUES
('Editor Berita', 'nasional', 'Aktif');

INSERT IGNORE INTO jabatan (name, role_name, status) VALUES
('Editor Berita', 'Editor Berita', 'Aktif');

INSERT INTO role_menu (role_name, menu_key, allowed)
SELECT 'Editor Berita', menu_key,
  CASE WHEN menu_key = 'aktifitas' THEN 1 ELSE 0 END
FROM menus
ON DUPLICATE KEY UPDATE allowed = IF(VALUES(allowed) = 1, 1, allowed);
