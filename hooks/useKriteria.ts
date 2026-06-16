import { useEffect, useState } from 'react';
import type { Kriteria } from '@/types';

export function useKriteria() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/kriteria')
      .then(res => res.json())
      .then(data => {
        if (data.success) setKriteria(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return { kriteria, loading };
}