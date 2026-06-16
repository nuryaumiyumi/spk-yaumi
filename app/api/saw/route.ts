import { NextResponse } from 'next/server';
import { getKriteriaFromDB, getAlternatifFromDB, getHasilSAWFromView } from '@/lib/db';
import { hitungSAW } from '@/lib/saw';

export async function GET() {
  try {
    // Opsi 1: Gunakan view dari database (disarankan)
    const hasilView = await getHasilSAWFromView();
    if (hasilView && hasilView.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'database_view',
        data: hasilView.map((item: any) => ({
          id: item.id,
          nama: item.nama,
          skor_akhir: item.skor_akhir,
          peringkat: item.peringkat,
        })),
      });
    }

    // Opsi 2: Fallback ke perhitungan manual
    const kriteria = await getKriteriaFromDB();
    const alternatif = await getAlternatifFromDB();
    
    if (!alternatif.length) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Belum ada data alternatif',
      });
    }

    const hasilManual = hitungSAW(kriteria, alternatif);
    return NextResponse.json({
      success: true,
      source: 'manual',
      data: hasilManual.map((item) => ({
        id: item.alternatif.id,
        nama: item.alternatif.nama,
        skor_akhir: item.totalSkor,
        peringkat: item.rangking,
      })),
    });
  } catch (error: any) {
    console.error('Error in /api/saw:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}