export default async function handler(req, res) {
  fetch("https://api.betaseries.com/members/auth", {
    method: "POST",
    headers: {
      "X-BetaSeries-Key": "62fb48a491ed",
      "Content-Type": "application/json",
    },
    body: req.body,
  })
    .then((response) => {
      return response.json();
    })
    .then((api) => {
      if (api.errors.length !== 0) {
        res.status(400).json(api);
      }
      res.status(200).json(api);
    });
}
