import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

export const getStaticProps = async () => {
  const res = await fetch("http://localhost:3000/api/Home", {
    method: "GET",
  });

  const data = await res.json();

  return {
    props: { series: data },
  };
};

const BlueLink = styled.a`
  color: blue;
`;

function Series({ series }) {
  const router = useRouter();
  let clickHoldTimer = null;
  return (
    <div>
      <h2>
        <strong>Series</strong>
      </h2>
      <div id="main">
        {series.shows.map((data, i) => {
          const link = "/episodes/" + data.id;
          return (
            <div key={i}>
              <div className="wrapper">
                <div className="cards">
                  <Link href={`/episodes/${encodeURIComponent(data.id)}`}>
                    <div className="card" style={{ cursor: "pointer" }}>
                      {/* Images take time to load, work around */}
                      <img src={data.images?.poster} alt="" />
                      <figcaption>{data.title}</figcaption>
                    </div>
                  </Link>
                </div>
                <button
                  id="button"
                  onMouseDown={() =>
                    (clickHoldTimer = setTimeout(function () {
                      window.location.href = "/series/" + data.id;
                    }, 2000))
                  }
                  onMouseUp={() => {
                    clearTimeout(clickHoldTimer);
                  }}
                  onClick={async () => {
                    fetch("https://api.betaseries.com/shows/show", {
                      method: "POST",
                      headers: {
                        "X-BetaSeries-Key": "62fb48a491ed",
                        "Content-Type": "application/json",
                        Authorization:
                          "Bearer " +
                          document.cookie.substring(
                            document.cookie.indexOf("/^") + 2,
                            document.cookie.indexOf("$/")
                          ),
                      },
                      body: JSON.stringify({
                        id: data.id,
                      }),
                    })
                      .then((res) => res.json())
                      .then((json) => console.log(json));
                  }}
                >
                  ＋
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Series;
