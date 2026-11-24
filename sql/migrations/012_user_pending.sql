ALTER TABLE users
  MODIFY status ENUM('Aktif', 'Nonaktif', 'Menunggu') NOT NULL DEFAULT 'Aktif';
