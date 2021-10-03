import React from 'react';
import {useQuery} from 'react-query';
import Planet from './Planet';

const fetchPlanets = async () => {
  const res = await fetch('https://swapi.dev/api/planets'); //if you have an error, it will try to fetch three times and then return status error
  return res.json();
}

const Planets = () => {
  const {data, status} = useQuery('planets', fetchPlanets); //key for the name of the data, function(async) to get data
  console.log(data, status)
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
        <div>
          {data.results.map(planet => <Planet planet={planet}/> )}
        </div>
      )}
    </div>
  );
}
 
export default Planets;