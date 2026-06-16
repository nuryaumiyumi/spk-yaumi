-- ============================================================
--  SPK BIBIT CABAI — Supabase SQL (Lengkap)
--  Metode  : Simple Additive Weighting (SAW)
--  Tabel   : kriteria · alternatif · hasil · rincian_hasil
--  Sumber  : lib/saw.ts & types/index.ts
-- ============================================================


-- ============================================================
-- 0. BERSIHKAN (opsional — hapus komentar jika ingin reset)
-- ============================================================
-- DROP VIEW  IF EXISTS public.v_saw_result;
-- DROP TABLE IF EXISTS public.rincian_hasil CASCADE;
-- DROP TABLE IF EXISTS public.hasil         CASCADE;
-- DROP TABLE IF EXISTS public.alternatif    CASCADE;
-- DROP TABLE IF EXISTS public.kriteria      CASCADE;


-- ============================================================
-- 1. TABEL KRITERIA
--    Sumber: interface Kriteria + dataKriteria (lib/saw.ts)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.kriteria (
  -- id teks sesuai key yang dipakai di kode JS
  -- nilainya: 'hasil', 'ketahanan', 'harga', 'umur'
  id       text         PRIMARY KEY,

  -- Field dari interface Kriteria (types/index.ts)
  nama     text         NOT NULL,
  singkat  text         NOT NULL,
  satuan   text         NOT NULL,
  bobot    numeric(5,4) NOT NULL CHECK (bobot > 0 AND bobot <= 1),
  jenis    text         NOT NULL CHECK (jenis IN ('benefit', 'cost')),

  -- Menjaga urutan tampilan sesuai urutan di dataKriteria
  urutan   smallint     NOT NULL DEFAULT 0
);

-- 4 kriteria persis dari dataKriteria di lib/saw.ts
INSERT INTO public.kriteria (id, nama, singkat, satuan, bobot, jenis, urutan) VALUES
  ('hasil',
   'Hasil Panen (kg/ha)',
   'Hasil',
   'kg/ha',
   0.35,
   'benefit',
   1),
  ('ketahanan',
   'Ketahanan Hama & Penyakit',
   'Ketahanan',
   'skala 1-10',
   0.30,
   'benefit',
   2),
  ('harga',
   'Harga Bibit (per 1000 biji)',
   'Harga',
   'Rp',
   0.20,
   'cost',
   3),
  ('umur',
   'Umur Panen (hari)',
   'Umur',
   'hari',
   0.15,
   'cost',
   4);


-- ============================================================
-- 2. TABEL ALTERNATIF
--    Sumber: AlternatifRow (AppProvider.tsx) +
--            dataAlternatif (lib/saw.ts)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.alternatif (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  nama        text          NOT NULL,

  -- Nilai per kriteria — kolom = id kriteria
  -- Sesuai nilai: Record<string, number> di interface Alternatif
  hasil       numeric(10,2) NOT NULL CHECK (hasil > 0),
  ketahanan   numeric(5,2)  NOT NULL CHECK (ketahanan BETWEEN 1 AND 10),
  harga       numeric(12,2) NOT NULL CHECK (harga > 0),
  umur        numeric(5,2)  NOT NULL CHECK (umur > 0),

  created_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alternatif_created_at
  ON public.alternatif (created_at ASC);

-- 15 alternatif bawaan dari dataAlternatif di lib/saw.ts
INSERT INTO public.alternatif (nama, hasil, ketahanan, harga, umur) VALUES
  ('Cabai Merah Besar TM999',  28, 9,  85000, 90),
  ('Cabai Rawit Genie F1',     25, 8,  75000, 85),
  ('Cabai Keriting Lado F1',   30, 7,  95000, 95),
  ('Cabai Rawit Super F1',     26, 9,  80000, 88),
  ('Cabai Merah Gada F1',      27, 8,  78000, 92),
  ('Cabai Rawit Bara F1',      29, 8,  82000, 87),
  ('Cabai Keriting Seloka',    24, 9,  72000, 93),
  ('Cabai Merah Hot Beauty',   31, 7,  98000, 91),
  ('Cabai Rawit Pelangi',      23, 8,  68000, 84),
  ('Cabai Keriting Kencana',   27, 9,  88000, 89),
  ('Cabai Merah Unggul',       29, 8,  79000, 86),
  ('Cabai Rawit Mutiara',      26, 9,  77000, 83),
  ('Cabai Keriting Maksi',     28, 7,  92000, 94),
  ('Cabai Merah Mega',         32, 8,  89000, 87),
  ('Cabai Rawit Emas',         27, 9,  73000, 86);


-- ============================================================
-- 3. TABEL HASIL
--    Sumber: HasilPerhitungan & RincianAlternatif (types/index.ts)
--
--    Menyimpan snapshot hasil perhitungan SAW per alternatif.
--    Diisi dari frontend setelah perhitungan selesai.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hasil (
  id             uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relasi ke alternatif (HasilPerhitungan.alternatif)
  alternatif_id  uuid          NOT NULL
                   REFERENCES public.alternatif(id) ON DELETE CASCADE,

  -- HasilPerhitungan.totalSkor / RincianAlternatif.total (= V_i)
  total_skor     numeric(10,6) NOT NULL,

  -- HasilPerhitungan.rangking / RincianAlternatif.rangking
  rangking       smallint      NOT NULL CHECK (rangking > 0),

  -- Waktu snapshot dihitung
  dihitung_pada  timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hasil_alternatif_id
  ON public.hasil (alternatif_id);

CREATE INDEX IF NOT EXISTS idx_hasil_dihitung_pada
  ON public.hasil (dihitung_pada DESC);


-- ============================================================
-- 4. TABEL RINCIAN HASIL
--    Sumber: RincianKriteria (types/index.ts)
--
--    Satu baris = satu sel (kriteria x alternatif).
--    Menyimpan x_ij, pembagi, r_ij, dan kontribusi bobot.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rincian_hasil (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relasi ke snapshot hasil
  hasil_id     uuid          NOT NULL
                 REFERENCES public.hasil(id) ON DELETE CASCADE,

  -- Relasi ke kriteria (RincianKriteria.kriteria)
  kriteria_id  text          NOT NULL
                 REFERENCES public.kriteria(id),

  -- RincianKriteria.nilai       -> x_ij (nilai mentah alternatif)
  nilai        numeric(12,4) NOT NULL,

  -- RincianKriteria.pembagi     -> max kolom (benefit) / min kolom (cost)
  pembagi      numeric(12,4) NOT NULL,

  -- RincianKriteria.normalisasi -> r_ij
  normalisasi  numeric(10,6) NOT NULL,

  -- RincianKriteria.kontribusi  -> w_j x r_ij
  kontribusi   numeric(10,6) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rincian_hasil_id
  ON public.rincian_hasil (hasil_id);


-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
--    Saat ini dibuka untuk anon key sesuai pemakaian di proyek.
--    Ganti USING (true) dengan USING (auth.role() = 'authenticated')
--    jika hanya user login yang boleh memodifikasi data.
-- ============================================================

-- kriteria (read-only dari frontend; UPDATE hanya untuk admin)
ALTER TABLE public.kriteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca kriteria"
  ON public.kriteria FOR SELECT USING (true);
CREATE POLICY "Ubah kriteria"
  ON public.kriteria FOR UPDATE USING (true) WITH CHECK (true);

-- alternatif (CRUD penuh)
ALTER TABLE public.alternatif ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca alternatif"
  ON public.alternatif FOR SELECT USING (true);
CREATE POLICY "Tambah alternatif"
  ON public.alternatif FOR INSERT WITH CHECK (true);
CREATE POLICY "Ubah alternatif"
  ON public.alternatif FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Hapus alternatif"
  ON public.alternatif FOR DELETE USING (true);

-- hasil (INSERT dan SELECT; tidak ada UPDATE karena snapshot)
ALTER TABLE public.hasil ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca hasil"
  ON public.hasil FOR SELECT USING (true);
CREATE POLICY "Tambah hasil"
  ON public.hasil FOR INSERT WITH CHECK (true);
CREATE POLICY "Hapus hasil"
  ON public.hasil FOR DELETE USING (true);

-- rincian_hasil
ALTER TABLE public.rincian_hasil ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Baca rincian"
  ON public.rincian_hasil FOR SELECT USING (true);
CREATE POLICY "Tambah rincian"
  ON public.rincian_hasil FOR INSERT WITH CHECK (true);
CREATE POLICY "Hapus rincian"
  ON public.rincian_hasil FOR DELETE USING (true);


-- ============================================================
-- 6. VIEW v_saw_result
--    Menghitung SAW real-time. Bobot diambil dari tabel kriteria
--    (bukan hardcoded) sehingga otomatis update jika bobot diubah.
-- ============================================================
CREATE OR REPLACE VIEW public.v_saw_result AS
WITH
  -- Bobot dinamis dari tabel kriteria
  w AS (
    SELECT
      MAX(bobot) FILTER (WHERE id = 'hasil')     AS w_hasil,
      MAX(bobot) FILTER (WHERE id = 'ketahanan') AS w_ketahanan,
      MAX(bobot) FILTER (WHERE id = 'harga')     AS w_harga,
      MAX(bobot) FILTER (WHERE id = 'umur')      AS w_umur
    FROM public.kriteria
  ),
  -- Nilai ekstrem per kriteria dari seluruh alternatif
  eks AS (
    SELECT
      MAX(hasil)     AS max_hasil,  MIN(hasil)     AS min_hasil,
      MAX(ketahanan) AS max_ket,    MIN(ketahanan) AS min_ket,
      MAX(harga)     AS max_harga,  MIN(harga)     AS min_harga,
      MAX(umur)      AS max_umur,   MIN(umur)      AS min_umur
    FROM public.alternatif
  ),
  -- Normalisasi r_ij untuk setiap alternatif
  norm AS (
    SELECT
      a.id,
      a.nama,
      a.hasil,
      a.ketahanan,
      a.harga,
      a.umur,
      -- BENEFIT: x_ij / max_j
      ROUND((a.hasil     / e.max_hasil)::numeric, 4) AS r_hasil,
      ROUND((a.ketahanan / e.max_ket  )::numeric, 4) AS r_ketahanan,
      -- COST   : min_j / x_ij
      ROUND((e.min_harga / a.harga    )::numeric, 4) AS r_harga,
      ROUND((e.min_umur  / a.umur     )::numeric, 4) AS r_umur,
      w.w_hasil,
      w.w_ketahanan,
      w.w_harga,
      w.w_umur
    FROM public.alternatif a, eks e, w
  )
SELECT
  n.id,
  n.nama,

  -- Nilai awal (x_ij)
  n.hasil,
  n.ketahanan,
  n.harga,
  n.umur,

  -- Nilai ternormalisasi (r_ij)
  n.r_hasil,
  n.r_ketahanan,
  n.r_harga,
  n.r_umur,

  -- Kontribusi per kriteria (w_j x r_ij)
  ROUND((n.r_hasil     * n.w_hasil    )::numeric, 6) AS kontribusi_hasil,
  ROUND((n.r_ketahanan * n.w_ketahanan)::numeric, 6) AS kontribusi_ketahanan,
  ROUND((n.r_harga     * n.w_harga    )::numeric, 6) AS kontribusi_harga,
  ROUND((n.r_umur      * n.w_umur     )::numeric, 6) AS kontribusi_umur,

  -- Skor akhir V_i = Sigma (w_j x r_ij)
  ROUND((
    n.r_hasil     * n.w_hasil     +
    n.r_ketahanan * n.w_ketahanan +
    n.r_harga     * n.w_harga     +
    n.r_umur      * n.w_umur
  )::numeric, 4) AS skor_akhir,

  -- Peringkat (1 = skor tertinggi = rekomendasi terbaik)
  RANK() OVER (
    ORDER BY (
      n.r_hasil     * n.w_hasil     +
      n.r_ketahanan * n.w_ketahanan +
      n.r_harga     * n.w_harga     +
      n.r_umur      * n.w_umur
    ) DESC
  ) AS peringkat

FROM norm n
ORDER BY skor_akhir DESC;



