export interface Kriteria {
  id: string;
  nama: string;
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