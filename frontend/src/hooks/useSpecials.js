import { useEffect, useState } from 'react';
import { fetchSpecials } from '../services/specials';

// The live wedding specials, or null while they load. The Weddings page and the wedding enquiry form
// share one request, and the answer is reused for a minute so moving between pages doesn't refetch.
const FRESH_FOR = 60 * 1000;
let cache = null;
let cachedAt = 0;
let pending = null;

const load = () => {
  pending ??= fetchSpecials()
    .then((list) => {
      cache = list;
      cachedAt = Date.now();
      return list;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
};

export default function useSpecials(enabled = true) {
  const fresh = cache && Date.now() - cachedAt < FRESH_FOR;
  const [specials, setSpecials] = useState(fresh ? cache : null);

  useEffect(() => {
    if (!enabled || fresh) return undefined;
    let active = true;
    load().then((list) => active && setSpecials(list));
    return () => {
      active = false;
    };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return specials;
}
