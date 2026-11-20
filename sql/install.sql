-- ARSY MySQL setup. Safe to run more than once (phpMyAdmin or mysql CLI).
CREATE DATABASE IF NOT EXISTS db_arsy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_arsy;

CREATE TABLE IF NOT EXISTS schema_migrations (
  name VARCHAR(128) NOT NULL,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(20) NOT NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Operator', 'Eksekutif 1', 'Eksekutif 2', 'Eksekutif 3') NOT NULL,
  jabatan VARCHAR(160) NOT NULL DEFAULT '',
  provinsi VARCHAR(120) NOT NULL DEFAULT '',
  kota VARCHAR(120) NOT NULL DEFAULT '',
  status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO users (id, name, email, password_hash, role, jabatan, provinsi, kota, status) VALUES
('USR-2401', 'Dina Saputra', 'admin@arsy.id', '$2b$10$hGsyCYZWpikULlyisea6EOirptVv98K8pDP8YjskzKzEGD1BRKQby', 'Admin', 'Admin', '', '', 'Aktif'),
('USR-2410', 'Komjen Pol. Andika Pratama', 'kapolri@arsy.id', '$2b$10$hGsyCYZWpikULlyisea6EOirptVv98K8pDP8YjskzKzEGD1BRKQby', 'Eksekutif 1', 'Kapolri', '', '', 'Aktif'),
('USR-2411', 'Irjen Pol. Raka Mahendra', 'kapolda.metro@arsy.id', '$2b$10$hGsyCYZWpikULlyisea6EOirptVv98K8pDP8YjskzKzEGD1BRKQby', 'Eksekutif 2', 'Kapolda Metro Jaya', 'DKI Jakarta', '', 'Aktif'),
('USR-2412', 'Kombes Pol. Sari Wulandari', 'kapolres.depok@arsy.id', '$2b$10$hGsyCYZWpikULlyisea6EOirptVv98K8pDP8YjskzKzEGD1BRKQby', 'Eksekutif 3', 'Kapolres Metro Depok', 'DKI Jakarta', 'Depok', 'Aktif'),
('USR-2413', 'Bripka Dimas Putra', 'operator.depok@arsy.id', '$2b$10$hGsyCYZWpikULlyisea6EOirptVv98K8pDP8YjskzKzEGD1BRKQby', 'Operator', 'Operator Depok', 'DKI Jakarta', 'Depok', 'Aktif');

INSERT IGNORE INTO schema_migrations (name) VALUES
('001_schema.sql'),
('002_seed_users.sql');



-- Master data: role, jabatan, provinsi, kota, menu, hak akses

ALTER TABLE users MODIFY role VARCHAR(64) NOT NULL;

CREATE TABLE IF NOT EXISTS roles (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  cakupan ENUM('nasional', 'provinsi', 'kota') NOT NULL DEFAULT 'kota',
  status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY roles_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jabatan (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  role_name VARCHAR(64) NOT NULL DEFAULT '',
  status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY jabatan_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS provinsi (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY provinsi_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS kota (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  provinsi VARCHAR(120) NOT NULL,
  status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY kota_provinsi_name_unique (provinsi, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menus (
  menu_key VARCHAR(64) NOT NULL,
  label VARCHAR(160) NOT NULL,
  grup VARCHAR(64) NOT NULL,
  status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (menu_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_menu (
  role_name VARCHAR(64) NOT NULL,
  menu_key VARCHAR(64) NOT NULL,
  allowed TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (role_name, menu_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO roles (name, cakupan, status) VALUES
('Admin', 'nasional', 'Aktif'),
('Eksekutif 1', 'nasional', 'Aktif'),
('Eksekutif 2', 'provinsi', 'Aktif'),
('Eksekutif 3', 'kota', 'Aktif'),
('Operator', 'kota', 'Aktif');

INSERT IGNORE INTO jabatan (name, role_name, status) VALUES
('Admin', 'Admin', 'Aktif'),
('Kapolri', 'Eksekutif 1', 'Aktif'),
('Kapolda Metro Jaya', 'Eksekutif 2', 'Aktif'),
('Kapolda', 'Eksekutif 2', 'Aktif'),
('Kapolres Metro Depok', 'Eksekutif 3', 'Aktif'),
('Kapolres', 'Eksekutif 3', 'Aktif'),
('Operator Depok', 'Operator', 'Aktif'),
('Operator', 'Operator', 'Aktif');

INSERT IGNORE INTO menus (menu_key, label, grup, status) VALUES
('viewMap', 'Peta Utama', 'Dashboard', 'Aktif'),
('viewKeamanan', 'Keamanan', 'Dashboard', 'Aktif'),
('viewKeselamatan', 'Keselamatan', 'Dashboard', 'Aktif'),
('viewKetertiban', 'Ketertiban', 'Dashboard', 'Aktif'),
('viewKelancaran', 'Kelancaran', 'Dashboard', 'Aktif'),
('sim', 'Surat Izin Mengemudi (SIM)', 'Data Primer', 'Aktif'),
('eri', 'Electronic Registration & Identification', 'Data Primer', 'Aktif'),
('mobilitas', 'Mobilitas Pengguna Jalan', 'Data Primer', 'Aktif'),
('lalulintas', 'Data Lalu Lintas', 'Data Primer', 'Aktif'),
('kontingensi', 'Layanan Kontingensi', 'Data Primer', 'Aktif'),
('operasional', 'Operasional & Pengendalian', 'Data Primer', 'Aktif'),
('laka', 'Kecelakaan', 'Data Primer', 'Aktif'),
('langgar', 'Penindakan Pelanggaran', 'Data Primer', 'Aktif'),
('jalan', 'Data Jalan', 'Data Primer', 'Aktif'),
('blackspot', 'BlackSpot', 'Data Primer', 'Aktif'),
('troublespot', 'TroubleSpot', 'Data Primer', 'Aktif'),
('rawanlaka', 'Rawan Laka', 'Data Primer', 'Aktif'),
('rawanlanggar', 'Rawan Langgar', 'Data Primer', 'Aktif'),
('rawanlambat', 'Rawan Perlambatan', 'Data Primer', 'Aktif'),
('rawanpidana', 'Rawan Tindak Pidana', 'Data Primer', 'Aktif'),
('rawanbencana', 'Rawan Bencana', 'Data Primer', 'Aktif'),
('aktifitas', 'Aktifitas', 'Data Primer', 'Aktif'),
('obv', 'Objek Vital', 'Data Primer', 'Aktif'),
('monitor', 'Monitoring Data', 'Data Primer', 'Aktif'),
('anatomi', 'Anatomi Kecelakaan', 'Data Primer', 'Aktif'),
('populasi', 'Data Populasi', 'Data Sekunder', 'Aktif'),
('laporan', 'Laporan Harian', 'Data Sekunder', 'Aktif'),
('irms', 'Data IRSMS', 'Data Sekunder', 'Aktif'),
('langgarharian', 'Data Langgar', 'Data Sekunder', 'Aktif'),
('kendaraan', 'Data Kendaraan', 'Data Sekunder', 'Aktif'),
('import', 'Import Data', 'Data Master', 'Aktif'),
('edit', 'Edit Data', 'Data Master', 'Aktif'),
('log', 'Log Import', 'Data Master', 'Aktif'),
('mobile', 'Input Gangguan', 'Data Master', 'Aktif'),
('mrole', 'Role', 'Administrasi', 'Aktif'),
('mjabatan', 'Jabatan', 'Administrasi', 'Aktif'),
('mprovinsi', 'Provinsi', 'Administrasi', 'Aktif'),
('mkota', 'Kota', 'Administrasi', 'Aktif');

INSERT IGNORE INTO provinsi (name, status) VALUES
('Aceh', 'Aktif'),
('Sumatera Utara', 'Aktif'),
('Sumatera Barat', 'Aktif'),
('Riau', 'Aktif'),
('Kepulauan Riau', 'Aktif'),
('Jambi', 'Aktif'),
('Sumatera Selatan', 'Aktif'),
('Kepulauan Bangka Belitung', 'Aktif'),
('Bengkulu', 'Aktif'),
('Lampung', 'Aktif'),
('DKI Jakarta', 'Aktif'),
('Banten', 'Aktif'),
('Jawa Barat', 'Aktif'),
('Jawa Tengah', 'Aktif'),
('DI Yogyakarta', 'Aktif'),
('Jawa Timur', 'Aktif'),
('Bali', 'Aktif'),
('Nusa Tenggara Barat', 'Aktif'),
('Nusa Tenggara Timur', 'Aktif'),
('Kalimantan Barat', 'Aktif'),
('Kalimantan Tengah', 'Aktif'),
('Kalimantan Selatan', 'Aktif'),
('Kalimantan Timur', 'Aktif'),
('Kalimantan Utara', 'Aktif'),
('Sulawesi Utara', 'Aktif'),
('Sulawesi Tengah', 'Aktif'),
('Sulawesi Selatan', 'Aktif'),
('Sulawesi Tenggara', 'Aktif'),
('Gorontalo', 'Aktif'),
('Sulawesi Barat', 'Aktif'),
('Maluku', 'Aktif'),
('Maluku Utara', 'Aktif'),
('Papua', 'Aktif'),
('Papua Barat', 'Aktif'),
('Papua Barat Daya', 'Aktif'),
('Papua Selatan', 'Aktif'),
('Papua Tengah', 'Aktif'),
('Papua Pegunungan', 'Aktif');

INSERT IGNORE INTO kota (name, provinsi, status) VALUES
('Banda Aceh', 'Aceh', 'Aktif'),
('Lhokseumawe', 'Aceh', 'Aktif'),
('Langsa', 'Aceh', 'Aktif'),
('Sabang', 'Aceh', 'Aktif'),
('Subulussalam', 'Aceh', 'Aktif'),
('Medan', 'Sumatera Utara', 'Aktif'),
('Binjai', 'Sumatera Utara', 'Aktif'),
('Pematangsiantar', 'Sumatera Utara', 'Aktif'),
('Sibolga', 'Sumatera Utara', 'Aktif'),
('Tanjungbalai', 'Sumatera Utara', 'Aktif'),
('Tebing Tinggi', 'Sumatera Utara', 'Aktif'),
('Padang', 'Sumatera Barat', 'Aktif'),
('Bukittinggi', 'Sumatera Barat', 'Aktif'),
('Padang Panjang', 'Sumatera Barat', 'Aktif'),
('Pariaman', 'Sumatera Barat', 'Aktif'),
('Payakumbuh', 'Sumatera Barat', 'Aktif'),
('Solok', 'Sumatera Barat', 'Aktif'),
('Pekanbaru', 'Riau', 'Aktif'),
('Dumai', 'Riau', 'Aktif'),
('Tanjungpinang', 'Kepulauan Riau', 'Aktif'),
('Batam', 'Kepulauan Riau', 'Aktif'),
('Jambi', 'Jambi', 'Aktif'),
('Sungai Penuh', 'Jambi', 'Aktif'),
('Palembang', 'Sumatera Selatan', 'Aktif'),
('Lubuklinggau', 'Sumatera Selatan', 'Aktif'),
('Pagar Alam', 'Sumatera Selatan', 'Aktif'),
('Prabumulih', 'Sumatera Selatan', 'Aktif'),
('Pangkalpinang', 'Kepulauan Bangka Belitung', 'Aktif'),
('Bengkulu', 'Bengkulu', 'Aktif'),
('Bandar Lampung', 'Lampung', 'Aktif'),
('Metro', 'Lampung', 'Aktif'),
('Jakarta Pusat', 'DKI Jakarta', 'Aktif'),
('Jakarta Utara', 'DKI Jakarta', 'Aktif'),
('Jakarta Barat', 'DKI Jakarta', 'Aktif'),
('Jakarta Selatan', 'DKI Jakarta', 'Aktif'),
('Jakarta Timur', 'DKI Jakarta', 'Aktif'),
('Kepulauan Seribu', 'DKI Jakarta', 'Aktif'),
('Serang', 'Banten', 'Aktif'),
('Cilegon', 'Banten', 'Aktif'),
('Tangerang', 'Banten', 'Aktif'),
('Tangerang Selatan', 'Banten', 'Aktif'),
('Bandung', 'Jawa Barat', 'Aktif'),
('Bekasi', 'Jawa Barat', 'Aktif'),
('Bogor', 'Jawa Barat', 'Aktif'),
('Depok', 'Jawa Barat', 'Aktif'),
('Cimahi', 'Jawa Barat', 'Aktif'),
('Cirebon', 'Jawa Barat', 'Aktif'),
('Sukabumi', 'Jawa Barat', 'Aktif'),
('Tasikmalaya', 'Jawa Barat', 'Aktif'),
('Banjar', 'Jawa Barat', 'Aktif'),
('Semarang', 'Jawa Tengah', 'Aktif'),
('Surakarta', 'Jawa Tengah', 'Aktif'),
('Magelang', 'Jawa Tengah', 'Aktif'),
('Pekalongan', 'Jawa Tengah', 'Aktif'),
('Salatiga', 'Jawa Tengah', 'Aktif'),
('Tegal', 'Jawa Tengah', 'Aktif'),
('Yogyakarta', 'DI Yogyakarta', 'Aktif'),
('Surabaya', 'Jawa Timur', 'Aktif'),
('Malang', 'Jawa Timur', 'Aktif'),
('Kediri', 'Jawa Timur', 'Aktif'),
('Madiun', 'Jawa Timur', 'Aktif'),
('Mojokerto', 'Jawa Timur', 'Aktif'),
('Pasuruan', 'Jawa Timur', 'Aktif'),
('Probolinggo', 'Jawa Timur', 'Aktif'),
('Blitar', 'Jawa Timur', 'Aktif'),
('Batu', 'Jawa Timur', 'Aktif'),
('Denpasar', 'Bali', 'Aktif'),
('Mataram', 'Nusa Tenggara Barat', 'Aktif'),
('Bima', 'Nusa Tenggara Barat', 'Aktif'),
('Kupang', 'Nusa Tenggara Timur', 'Aktif'),
('Pontianak', 'Kalimantan Barat', 'Aktif'),
('Singkawang', 'Kalimantan Barat', 'Aktif'),
('Palangka Raya', 'Kalimantan Tengah', 'Aktif'),
('Banjarmasin', 'Kalimantan Selatan', 'Aktif'),
('Banjarbaru', 'Kalimantan Selatan', 'Aktif'),
('Samarinda', 'Kalimantan Timur', 'Aktif'),
('Balikpapan', 'Kalimantan Timur', 'Aktif'),
('Bontang', 'Kalimantan Timur', 'Aktif'),
('Tanjung Selor', 'Kalimantan Utara', 'Aktif'),
('Tarakan', 'Kalimantan Utara', 'Aktif'),
('Manado', 'Sulawesi Utara', 'Aktif'),
('Bitung', 'Sulawesi Utara', 'Aktif'),
('Kotamobagu', 'Sulawesi Utara', 'Aktif'),
('Tomohon', 'Sulawesi Utara', 'Aktif'),
('Palu', 'Sulawesi Tengah', 'Aktif'),
('Makassar', 'Sulawesi Selatan', 'Aktif'),
('Palopo', 'Sulawesi Selatan', 'Aktif'),
('Parepare', 'Sulawesi Selatan', 'Aktif'),
('Kendari', 'Sulawesi Tenggara', 'Aktif'),
('Baubau', 'Sulawesi Tenggara', 'Aktif'),
('Gorontalo', 'Gorontalo', 'Aktif'),
('Mamuju', 'Sulawesi Barat', 'Aktif'),
('Ambon', 'Maluku', 'Aktif'),
('Tual', 'Maluku', 'Aktif'),
('Ternate', 'Maluku Utara', 'Aktif'),
('Tidore Kepulauan', 'Maluku Utara', 'Aktif'),
('Jayapura', 'Papua', 'Aktif'),
('Manokwari', 'Papua Barat', 'Aktif'),
('Sorong', 'Papua Barat Daya', 'Aktif'),
('Merauke', 'Papua Selatan', 'Aktif'),
('Nabire', 'Papua Tengah', 'Aktif'),
('Wamena', 'Papua Pegunungan', 'Aktif');

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

INSERT IGNORE INTO schema_migrations (name) VALUES
('003_schema_master.sql'),
('004_seed_roles.sql'),
('005_seed_wilayah.sql'),
('006_seed_grants.sql');

UPDATE menus
SET grup = 'Administrasi'
WHERE menu_key IN ('mrole', 'mjabatan', 'mprovinsi', 'mkota', 'maccess');

INSERT IGNORE INTO schema_migrations (name) VALUES
('007_menu_administrasi.sql');

DELETE FROM role_menu WHERE menu_key = 'maccess';
DELETE FROM menus WHERE menu_key = 'maccess';

INSERT IGNORE INTO schema_migrations (name) VALUES
('008_drop_maccess.sql');
