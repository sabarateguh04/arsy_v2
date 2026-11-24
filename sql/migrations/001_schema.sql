CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(20) NOT NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Operator', 'Eksekutif 1', 'Eksekutif 2', 'Eksekutif 3') NOT NULL,
  jabatan VARCHAR(160) NOT NULL DEFAULT '',
  provinsi VARCHAR(120) NOT NULL DEFAULT '',
  kota VARCHAR(120) NOT NULL DEFAULT '',
  status ENUM('Aktif', 'Nonaktif', 'Menunggu') NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
