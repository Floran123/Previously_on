export default async function handler(req, res) {
  await fetch(
    "https://api.betaseries.com/shows/list?fields=title,id,images.poster,description,genres,seasons,seasons_details,episodes,length,notes.mean&order=popularity",
    {
      method: "GET",
      headers: { "X-BetaSeries-Key": "62fb48a491ed" },
    }
  )
    .then((response) => {
      // console.log(response);
      return response.json();
    })
    .then((api) => {
      res.status(200).json(api);
    });
}
