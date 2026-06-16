// app/api/kriteria/route.ts
import { NextResponse } from 'next/server';
import { getKriteriaFromDB } from '@/lib/db';

export async function GET() {
  try {
    const kriteria = await getKriteriaFromDB();
    return NextResponse.json({ success: true, data: kriteria });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}