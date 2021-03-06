import React from 'react';
import {useQuery} from 'react-query';
import Person from './Person';

const fetchPeople = async () => {
  const res = await fetch('https://swapi.dev/api/people/'); //if you have an error, it will try to fetch three times and then return status error
  return res.json();
}

const People = () => {
  const {data, status} = useQuery('people', fetchPeople); //key for the name of the data, function(async) to get data

  //after the data is fetch it is cached and every time we open the page the data is fetched again but it is compared to the cache
  //if there are changes in the cache the data will be updated
  console.log(data, status)
  return (
    <div>
      <h2>People</h2>

      {status === 'loading' && (
        <div>Loading data...</div>
      )}
      {status === 'error' && (
        <div>Error fetching data </div>
      )}
       {status === 'success' && (
        <div>
          {data.results.map(person => <Person person={person}/> )}
        </div>
      )}
    </div>
  );
}
 
export default People;