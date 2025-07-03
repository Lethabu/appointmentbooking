// components/Search/GlobalSearch.jsx
'use client'
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function GlobalSearch() {
  const supabase = useSupabaseClient()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      return
    }
    
    const search = async () => {
      setIsSearching(true)
      
      try {
        const { data } = await supabase
          .rpc('global_search', {
            search_term: query,
            salon_id: currentSalonId // From context
          })
        
        setResults(data || [])
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsSearching(false)
      }
    }
    
    const timer = setTimeout(search, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search appointments, clients, products..."
        className="w-full p-2 border rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {query.length > 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          {isSearching ? (
            <div className="p-4 text-center">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((item) => (
                <SearchResultItem key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <div className="p-4 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}

// PostgreSQL search function
CREATE OR REPLACE FUNCTION global_search(search_term text, salon_id uuid)
RETURNS TABLE(id uuid, type text, title text, subtitle text) AS $$
BEGIN
  RETURN QUERY 
    -- Appointments
    SELECT 
      a.id, 
      'appointment' AS type,
      c.name AS title,
      CONCAT('Service: ', s.name, ' • ', TO_CHAR(a.start_time, 'DD Mon HH24:MI')) AS subtitle
    FROM appointments a
    JOIN clients c ON c.id = a.client_id
    JOIN services s ON s.id = a.service_id
    WHERE a.salon_id = salon_id
      AND (c.name ILIKE '%' || search_term || '%' OR s.name ILIKE '%' || search_term || '%')
    
    UNION ALL
    
    -- Clients
    SELECT 
      id, 
      'client' AS type,
      name AS title,
      CONCAT('Phone: ', COALESCE(phone, 'N/A'), ' • Email: ', COALESCE(email, 'N/A')) AS subtitle
    FROM clients
    WHERE salon_id = salon_id
      AND (name ILIKE '%' || search_term || '%' OR phone ILIKE '%' || search_term || '%')
    
    UNION ALL
    
    -- Products
    SELECT 
      id, 
      'product' AS type,
      name AS title,
      CONCAT('Stock: ', stock, ' • Price: R', (price/100)::money) AS subtitle
    FROM products
    WHERE salon_id = salon_id
      AND name ILIKE '%' || search_term || '%'
    
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;