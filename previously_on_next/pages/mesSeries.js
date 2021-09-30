import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import nocover from "../public/nocover.png";

export const getServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie;

  const res = await fetch("https://api.betaseries.com/shows/member", {
    method: "GET",
    headers: {
      "X-BetaSeries-Key": "62fb48a491ed",
      "Content-Type": "application/json",
      Authorization:
        "Bearer " +
        cookies.substring(cookies.indexOf("/^") + 2, cookies.indexOf("$/")),
    },
  });

  const data = await res.json();

  return {
    props: { series: data },
  };
};

function mesSeries({ series }) {
  console.log(series);
  return (
    <div>
      <h2>
        <strong>Mes séries</strong>
      </h2>
      <div id="main">
        {series?.shows?.map((data, i) => {
          if (data.user.archived === true) {
            return null;
          }
          return (
            <div key={i} class="wrapper">
              <div class="cards">
                <figure class="card">
                  <img
                    src={
                      data.images.poster ? data.images.poster : "nocover.png"
                    }
                    alt=""
                  />

                  <figcaption>{data.title}</figcaption>
                </figure>
              </div>
              <button
                id="button"
                onClick={async (e) => {
                  console.log(
                    "Bearer " +
                      document.cookie.substring(
                        document.cookie.indexOf("/^") + 2,
                        document.cookie.indexOf("$/")
                      )
                  );
                  fetch("https://api.betaseries.com/shows/archive", {
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
                    .then((res) => res.text())
                    .then((data) => console.log(data));
                    e.target.parentElement.remove();
                }} 
              >
                Archiver
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default mesSeries;
