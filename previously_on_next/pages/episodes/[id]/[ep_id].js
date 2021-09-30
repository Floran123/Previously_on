import { useRouter } from "next/router";

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps = async ({ params }) => {
  console.log(params);

  let req = {
    headers: {
      "Content-Type": "application/json",
      "X-BetaSeries-Key": "127c16f2788d",
    },
  };

  const [serieReq, episodeReq] = await Promise.all([
    fetch(`https://api.betaseries.com/shows/display?id=${params.id}`, req),
    fetch(
      `https://api.betaseries.com/episodes/display?id=${params.ep_id}`,
      req
    ),
  ]);

  const [serie, episode] = await Promise.all([
    serieReq.json(),
    episodeReq.json(),
  ]);

  return {
    props: { episode: episode.episode, cover: serie.show.images },
  };
};

export default function EpisodeDetails({ episode, cover }) {
  return (
    <div class="movie_card" id="bright">
      <div class="info_section">
        <div class="movie_header">
          <img
            class="locandina" id="img"
            src={cover.poster}
            alt="cover"
          />
          <h1>{episode.title}</h1>
          <h4>{episode.code}</h4>
          <h4>{episode.date}</h4>

          <div class="movie_desc">
            <p class="text">{episode.description}</p>
          </div>
        </div>
        <div></div>
        <h4 class="note">Note: {Math.round( episode.note.mean * 100) / 100} / 5</h4>
      </div>
    </div>
  );
}
