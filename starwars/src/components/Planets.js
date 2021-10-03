import React, {useState} from 'react';
import {useQuery, usePaginatedQuery} from 'react-query';
import Planet from './Planet';

const fetchPlanets = async (props) => { //key --first item in array; someVar is the second item, page is the third
  console.log('PAGE,', props)
  const keys = [...props.queryKey]
  const res = await fetch(`https://swapi.dev/api/planets/?page=${keys[1]}`); //if you have an error, it will try to fetch three times and then return status error
  return res.json();
}

const Planets = () => {
  const [page, setPage] = useState(1);

  const {data, status, isPreviousData} = useQuery(['planets', page], fetchPlanets, { //use array for first arg if you want to send query parameters to the function, the first item in the array is always the key
    staleTime: 2000, //from fresh to stale in 2 sec
    retry: 3, //how many times to retry after error, 3 default
    cacheTime: 10, //how long stale queries are cached for before they are disposed, 300 000 default(5 min)
    onSuccess: () => console.log('Will fire on success'), // run when success,
    onError: () => console.log("When error")
  }); // 1 key for the name of the data, 2 function(async) to get data; 3. config object
  console.log(data)

  return (
    <div>
      <h2>Planets</h2>


      {status === 'loading' && (
        <div>Loading data...</div>
      )}
      {status === 'error' && (
        <div>Error fetching data </div>
      )}
      {status === 'success' && (
        <>
          <button 
            onClick={() => setPage(old => Math.max(old - 1, 1))} 
            disabled={page === 1}>
            Previous Page
          </button>
          <span>{ page }</span>
          <button
         onClick={() => {
           if (!isPreviousData && data.hasMore) {
             setPage(old => old + 1)
           }
         }}
         // Disable the Next Page button until we know a next page is available
         disabled={isPreviousData || !data?.hasMore}
       > Next page
          </button>
          <div>
            { data.results.map(planet => <Planet key={planet.name} planet={planet} /> ) }
          </div>
        </>
      )} 
    </div>
  );
}
 
export default Planets;