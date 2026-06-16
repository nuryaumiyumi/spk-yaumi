// lib/db.ts
import { supabase } from './supabaseClient';
import type { Alternatif, Kriteria } from '@/types';

export async function getKriteriaFromDB(): Promise<Kriteria[]> {
  const { data, error } = await supabase
    .from('kriteria')
    .select('*')
    .order('urutan', { ascending: true });
  if (error) throw new Error(`Gagal mengambil kriteria: ${error.message}`);
  return data.map((k: any) => ({
    id: k.id,
    nama: k.nama,
    singkat: k.singkat,
    satuan: k.satuan,
    bobot: Number(k.bobot),
    jenis: k.jenis,
  }));
}

export async function getAlternatifFromDB(): Promise<Alternatif[]> {
  const { data, error } = await supabase
    .from('alternatif')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(`Gagal mengambil alternatif: ${error.message}`);
  return data.map((a: any) => ({
    id: a.id,
    nama: a.nama,
    nilai: {
      hasil: Number(a.hasil),
      ketahanan: Number(a.ketahanan),
      harga: Number(a.harga),
      umur: Number(a.umur),
    },
  }));
}

// View hasil SAW
export async function getHasilSAWFromView() {
  const { data, error } = await supabase
    .from('v_saw_result')
    .select('*')
    .order('peringkat', { ascending: true });
  if (error) {
    // Jika view tidak ada, return null
    console.warn('View v_saw_result tidak tersedia:', error.message);
    return null;
  }
  return data;
}