import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

export const getStaticPaths = async () => {
  const res = await fetch("http://localhost:3000/api/Home", {
    method: "GET",
  });

  const data = await res.json();
  const paths = data.shows.map((show) => ({
    params: { id: show.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }) => {
  const res = await fetch(
    `https://api.betaseries.com/shows/display?id=${params.id}`,
    {
      method: "GET",
      headers: { "X-BetaSeries-Key": "62fb48a491ed" },
    }
  );

  const data = await res.json();

  return {
    props: { series: data },
  };
};

const BlueLink = styled.a`
  color: blue;
`;

function infoSeries({ series }) {
  return (
    <div>
      <div class="movie_card" id="bright">
        <div class="info_section">
          <div class="movie_header">
            
            <img class="locandina" src={series.show.images.poster} alt="" />
            <div>{series.show.title}</div>
            <h4>Nombre de saisons : {series.show.seasons}</h4>
            <span class="minutes">{series.show.length} minutes</span>
            <p class="type">
              {Object.values(series.show.genres).map((e, i) => {
                return e + " ";
              })}
            </p>
          </div>

          <div class="movie_desc">
            <p class="text">{series.show.description}</p>
          </div>
          <div class="movie_social">
            <ul>
              <li>
                Nombre d'épisodes par saisons :{" "}
                {series.show.seasons_details.map((e, i) => {
                  return e.episodes + "/ ";
                })}
              </li>
              <li>total episodes : {series.show.episodes}</li>
              <li>notes : {Math.round(series.show.notes.mean * 100) / 100} / 5 </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default infoSeries;
