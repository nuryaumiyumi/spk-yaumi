import { Kriteria, Alternatif, HasilPerhitungan, DetailSAW } from '@/types';

export function hitungSAW(
  kriteria: Kriteria[],
  alternatif: Alternatif[]
): HasilPerhitungan[] {
  if (kriteria.length === 0 || alternatif.length === 0) return [];
  
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
  
  hasil.sort((a, b) => b.totalSkor - a.totalSkor);
  hasil.forEach((item, index) => {
    item.rangking = index + 1;
  });
  
  return hasil;
}

export function detailSAW(
  kriteria: Kriteria[],
  alternatif: Alternatif[]
): DetailSAW {
  if (kriteria.length === 0 || alternatif.length === 0) {
    return { ekstrem: {}, hasil: [] };
  }

  const ekstrem: Record<string, { min: number; max: number }> = {};
  for (const k of kriteria) {
    const nilai = alternatif.map((a) => a.nilai[k.id]);
    ekstrem[k.id] = { min: Math.min(...nilai), max: Math.max(...nilai) };
  }

  const hasil = alternatif.map((a) => {
    const rincian = kriteria.map((k) => {
      const nilai = a.nilai[k.id];
      const { min, max } = ekstrem[k.id];
      const pembagi = k.jenis === 'benefit' ? max : min;
      const normalisasi = k.jenis === 'benefit' ? nilai / max : min / nilai;
      return {
        kriteria: k,
        nilai,
        pembagi,
        normalisasi,
        kontribusi: normalisasi * k.bobot,
      };
    });
    const total = rincian.reduce((s, r) => s + r.kontribusi, 0);
    return { alternatif: a, rincian, total, rangking: 0 };
  });

  [...hasil]
    .sort((a, b) => b.total - a.total)
    .forEach((item, i) => {
      item.rangking = i + 1;
    });

  return { ekstrem, hasil };
}