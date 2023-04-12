export function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Not found');
      }
      return response.json();
    })
    .then(data =>
      data.map(country => ({
        officialName: country.name.official,
        capital: country.capital,
        population: country.population,
        flag: country.flags.svg,
        languages: country.languages,
      }))
    );
}
