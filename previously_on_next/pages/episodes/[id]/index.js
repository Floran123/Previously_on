import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

// export const getStaticPaths = async () => {
//   const res = await fetch("http://localhost:3000/api/Home", {
//     method: "GET",
//   });

//   const data = await res.json();
//   const paths = data.shows.map((show) => ({
//     params: { id: show.id.toString() },
//   }));

//   return {
//     paths,
//     fallback: "blocking",
//   };
// };

export const getServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie;
  const res = await fetch(
    `https://api.betaseries.com/shows/episodes?id=${context.params.id}`,
    {
      method: "GET",
      headers: {
        "X-BetaSeries-Key": "62fb48a491ed",
        Authorization:
          "Bearer " +
          cookies.substring(cookies.indexOf("/^") + 2, cookies.indexOf("$/")),
      },
    }
  );

  const data = await res.json();

  return {
    props: { episodes: data.episodes },
  };
};

const BlueLink = styled.a`
  color: blue;
`;

export default function infoSeries({ episodes, children, href }) {
  const router = useRouter();
  console.log(episodes, router);
  let lastSeason;
  return (
    <div>
      {episodes.map((e, i) => {
        if (lastSeason !== e.season) {
          lastSeason = e.season;
          return (
            <Episode
              key={i}
              title={e.title}
              season={e.season}
              id={e.id}
              router={router}
            />
          );
        }
        return (
          <Episode
            key={i}
            title={e.title}
            season={false}
            id={e.id}
            router={router}
          />
        );
      })}
    </div>
  );
}

function Episode({ title, season, id, router }) {
  let clickHoldTimer = null;
  if (season) {
    return (
      <div>
        <h3>Season: {season}</h3>
        <button
          style={{
            background: "none",
            color: "inherit",
            border: "none",
            padding: "0",
            font: "inherit",
            cursor: "pointer",
            outline: "inherit",
          }}
          onMouseDown={() =>
            (clickHoldTimer = setTimeout(function () {
              window.location.href = router.asPath + "/" + id.toString();
            }, 1000))
          }
          onMouseUp={(e) => {
            clearTimeout(clickHoldTimer);
            if (e.target.parentElement.nextSibling.style.display === "block") {
              e.target.parentElement.nextSibling.style.display = "none";
              return null;
            }
            e.target.parentElement.nextSibling.style.display = "block";
          }}
        >
          <h4>{title}</h4>
        </button>
        <div style={{ display: "none" }}>
          <ButtonSet id={id} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <button
        style={{
          background: "none",
          color: "inherit",
          border: "none",
          padding: "0",
          font: "inherit",
          cursor: "pointer",
          outline: "inherit",
        }}
        onMouseDown={() =>
          (clickHoldTimer = setTimeout(function () {
            window.location.href = router.asPath + "/" + id.toString();
          }, 1000))
        }
        onMouseUp={(e) => {
          clearTimeout(clickHoldTimer);
          if (e.target.parentElement.nextSibling.style.display === "block") {
            e.target.parentElement.nextSibling.style.display = "none";
            return null;
          }
          e.target.parentElement.nextSibling.style.display = "block";
        }}
      >
        <h4>{title}</h4>
      </button>
      <div style={{ display: "none" }}>
        <ButtonSet id={id} />
      </div>
    </div>
  );
}

function ButtonSet({ id }) {
  const [comment, setComment] = useState("");

  return (
    <div>
      <button
        onClick={async () => {
          fetch("https://api.betaseries.com/episodes/watched", {
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
              id: id,
              bulk: false,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }}
      >
        Mark as seen
      </button>
      <button
        onClick={async () => {
          fetch("https://api.betaseries.com/episodes/watched", {
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
              id: id,
              bulk: true,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }}
      >
        Mark all as seen until this episode
      </button>
      <input
        type="text"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          fetch("https://api.betaseries.com/comments/comment", {
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
              id: id,
              type: "episode",
              text: comment,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }}
      >
        Comment
      </button>
    </div>
  );
}
