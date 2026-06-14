import { Kriteria, Alternatif, HasilPerhitungan } from '@/types';

export function hitungSAW(
  kriteria: Kriteria[],
  alternatif: Alternatif[]
): HasilPerhitungan[] {
  // 1. Normalisasi matriks
  const normalizedMatrix: Record<string, Record<string, number>> = {};
  
  for (const k of kriteria) {
    const values = alternatif.map(a => a.nilai[k.id]);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    
    for (const a of alternatif) {
      if (!normalizedMatrix[a.id]) normalizedMatrix[a.id] = {};
      
      if (k.jenis === 'benefit') {
        normalizedMatrix[a.id][k.id] = a.nilai[k.id] / maxVal;
      } else {
        normalizedMatrix[a.id][k.id] = minVal / a.nilai[k.id];
      }
    }
  }
  
  // 2. Hitung skor akhir
  const hasil: HasilPerhitungan[] = alternatif.map(a => {
    let totalSkor = 0;
    for (const k of kriteria) {
      totalSkor += normalizedMatrix[a.id][k.id] * k.bobot;
    }
    return {
      alternatif: a,
      totalSkor,
      rangking: 0
    };
  });
  
  // 3. Urutkan berdasarkan skor tertinggi
  hasil.sort((a, b) => b.totalSkor - a.totalSkor);
  
  // 4. Berikan rangking
  hasil.forEach((item, index) => {
    item.rangking = index + 1;
  });
  
  return hasil;
}

// 4 KRITERIA
export const dataKriteria: Kriteria[] = [
  { id: 'hasil', nama: 'Hasil Panen (kg/ha)', bobot: 0.35, jenis: 'benefit' },
  { id: 'ketahanan', nama: 'Ketahanan Hama/Penyakit', bobot: 0.30, jenis: 'benefit' },
  { id: 'harga', nama: 'Harga Bibit (per 1000 biji)', bobot: 0.20, jenis: 'cost' },
  { id: 'umur', nama: 'Umur Panen (hari)', bobot: 0.15, jenis: 'cost' }
];

// 15 ALTERNATIF BIBIT CABAI
export const dataAlternatif: Alternatif[] = [
  { id: 'a1', nama: 'Cabai Merah Besar TM999', nilai: { hasil: 28, ketahanan: 9, harga: 85000, umur: 90 } },
  { id: 'a2', nama: 'Cabai Rawit Genie F1', nilai: { hasil: 25, ketahanan: 8, harga: 75000, umur: 85 } },
  { id: 'a3', nama: 'Cabai Keriting Lado F1', nilai: { hasil: 30, ketahanan: 7, harga: 95000, umur: 95 } },
  { id: 'a4', nama: 'Cabai Rawit Super F1', nilai: { hasil: 26, ketahanan: 9, harga: 80000, umur: 88 } },
  { id: 'a5', nama: 'Cabai Merah Gada F1', nilai: { hasil: 27, ketahanan: 8, harga: 78000, umur: 92 } },
  { id: 'a6', nama: 'Cabai Rawit Bara F1', nilai: { hasil: 29, ketahanan: 8, harga: 82000, umur: 87 } },
  { id: 'a7', nama: 'Cabai Keriting Seloka', nilai: { hasil: 24, ketahanan: 9, harga: 72000, umur: 93 } },
  { id: 'a8', nama: 'Cabai Merah Hot Beauty', nilai: { hasil: 31, ketahanan: 7, harga: 98000, umur: 91 } },
  { id: 'a9', nama: 'Cabai Rawit Pelangi', nilai: { hasil: 23, ketahanan: 8, harga: 68000, umur: 84 } },
  { id: 'a10', nama: 'Cabai Keriting Kencana', nilai: { hasil: 27, ketahanan: 9, harga: 88000, umur: 89 } },
  { id: 'a11', nama: 'Cabai Merah Unggul', nilai: { hasil: 29, ketahanan: 8, harga: 79000, umur: 86 } },
  { id: 'a12', nama: 'Cabai Rawit Mutiara', nilai: { hasil: 26, ketahanan: 9, harga: 77000, umur: 83 } },
  { id: 'a13', nama: 'Cabai Keriting Maksi', nilai: { hasil: 28, ketahanan: 7, harga: 92000, umur: 94 } },
  { id: 'a14', nama: 'Cabai Merah Mega', nilai: { hasil: 32, ketahanan: 8, harga: 89000, umur: 87 } },
  { id: 'a15', nama: 'Cabai Rawit Emas', nilai: { hasil: 27, ketahanan: 9, harga: 73000, umur: 86 } }
];