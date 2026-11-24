DELETE FROM role_menu WHERE role_name = 'Editor Berita';
DELETE FROM jabatan WHERE role_name = 'Editor Berita';
DELETE FROM roles WHERE name = 'Editor Berita';

UPDATE role_menu SET allowed = 0 WHERE menu_key = 'aktifitas';
