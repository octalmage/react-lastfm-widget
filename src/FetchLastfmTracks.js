import 'fetch-everywhere';

const FetchLastfmTracks = (username, apikey) =>
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apikey}&format=json`)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then(response => response.json()).then(repo => Promise.resolve(repo))
    .catch(error => Promise.reject(new Error(error)));

export default FetchLastfmTracks;
