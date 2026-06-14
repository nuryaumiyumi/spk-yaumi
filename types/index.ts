export interface Kriteria {
  id: string;
  nama: string;
  singkat: string;
  satuan: string;
  bobot: number;
  jenis: 'benefit' | 'cost';
}

export interface Alternatif {
  id: string;
  nama: string;
  nilai: Record<string, number>;
}

export interface HasilPerhitungan {
  alternatif: Alternatif;
  totalSkor: number;
  rangking: number;
}

/** Rincian satu sel kriteria untuk satu alternatif. */
export interface RincianKriteria {
  kriteria: Kriteria;
  nilai: number;       // x_ij (nilai awal)
  pembagi: number;     // max (benefit) atau min (cost) yang dipakai saat normalisasi
  normalisasi: number; // r_ij
  kontribusi: number;  // w_j * r_ij
}

/** Rincian perhitungan SAW lengkap untuk satu alternatif. */
export interface RincianAlternatif {
  alternatif: Alternatif;
  rincian: RincianKriteria[];
  total: number;       // V_i
  rangking: number;
}

export interface DetailSAW {
  ekstrem: Record<string, { min: number; max: number }>;
  hasil: RincianAlternatif[];
}