import styles from "../styles/Friends.module.css";
import { useState } from "react";

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie;

  if (!cookies) {
    return {
      props: {
        response: false,
      },
    };
  }

  let req = {
    headers: {
      "Content-Type": "application/json",
      "X-BetaSeries-Key": "62fb48a491ed",
      Authorization:
        "Bearer " +
        cookies.substring(cookies.indexOf("/^") + 2, cookies.indexOf("$/")),
    },
  };

  const [friendListRes, friendRequestRes, friendBlockedRes] = await Promise.all(
    [
      fetch(`https://api.betaseries.com/friends/list`, req),
      fetch(`https://api.betaseries.com/friends/requests`, req),
      fetch(`https://api.betaseries.com/friends/list?blocked=true`, req),
    ]
  );

  const [friendList, friendRequests, friendBlocked] = await Promise.all([
    friendListRes.json(),
    friendRequestRes.json(),
    friendBlockedRes.json(),
  ]);

  return {
    props: {
      friendList,
      friendRequests,
      friendBlocked,
      response: true,
    },
  };
}

export default function Repo({
  friendList,
  friendRequests,
  friendBlocked,
  response,
}) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  if (!response) {
    return <div>Please login to access this functionnality.</div>;
  }

  console.log(friendList);

  return (
    <div className={styles.friendContainer} style={{ margin: "1em" }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (search === "") {
            setSearchResults(<div className="search_results"></div>);
            return null;
          }
          fetch("///api.betaseries.com/search/all?query=" + search, {
            headers: {
              "Content-Type": "application/json",
              "X-BetaSeries-Key": "62fb48a491ed",
              Authorization:
                "Bearer " +
                document.cookie.substring(
                  document.cookie.indexOf("/^") + 2,
                  document.cookie.indexOf("$/")
                ),
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setSearchResults(
                <div className="search_results">
                  {data.users.map((e, i) => {
                    return <SearchResult login={e.login} key={i} id={e.id} />;
                  })}
                </div>
              );
            });
        }}
      >
        <input
          type="text"
          name="search"
          id="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        {searchResults}
      </form>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-between",
        }}
      >
        <div className={styles.friendList}>
          <h1>Friend List</h1>
          <Friends users={friendList?.users} tri={"list"} />
        </div>
        <div className={styles.friendList}>
          <h1>Friend Requests</h1>
          <Friends users={friendRequests?.users} tri={"request"} />
        </div>
        <div className={styles.friendList}>
          <h1>Users Blocked</h1>
          <Friends users={friendBlocked?.users} tri={"blocked"} />
        </div>
      </div>
    </div>
  );
}

function SearchResult(props) {
  return (
    <div>
      <p>{props.login}</p>
      <button
        onClick={async (e) => {
          fetch("https://api.betaseries.com/friends/friend", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-BetaSeries-Key": "62fb48a491ed",
              Authorization:
                "Bearer " +
                document.cookie.substring(
                  document.cookie.indexOf("/^") + 2,
                  document.cookie.indexOf("$/")
                ),
            },
            body: JSON.stringify({
              id: props.id,
            }),
          });
        }}
      >
        Send Friend Request
      </button>
    </div>
  );
}

function Friends({ users, tri }) {
  if (!users) {
    return <div>Friends not found </div>;
  }
  return (
    <div>
      {users.map((e, i) => {
        switch (tri) {
          case "list":
            return (
              <div key={i} className={styles.friendLI}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.target.nextSibling.style.display = "block";
                  }}
                >
                  {e.login}
                </span>
                <div className="options" style={{ display: "none" }}>
                  <button
                    onClick={async () => {
                      fetch("https://api.betaseries.com/friends/block", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "X-BetaSeries-Key": "127c16f2788d",
                          Authorization:
                            "Bearer " +
                            document.cookie.substring(
                              document.cookie.indexOf("/^") + 2,
                              document.cookie.indexOf("$/")
                            ),
                        },
                        body: JSON.stringify({ id: e.id }),
                      })
                        .then((res) => res.json())
                        .then((data) => console.log(data));
                    }}
                  >
                    Block
                  </button>
                  <button
                    onClick={async () => {
                      fetch("https://api.betaseries.com/friends/friend", {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          "X-BetaSeries-Key": "127c16f2788d",
                          Authorization:
                            "Bearer " +
                            document.cookie.substring(
                              document.cookie.indexOf("/^") + 2,
                              document.cookie.indexOf("$/")
                            ),
                        },
                        body: JSON.stringify({ id: e.id }),
                      })
                        .then((res) => res.json())
                        .then((data) => console.log(data));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
            break;
          case "requests":
            return (
              <div key={i} className={styles.friendLI}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.target.nextSibling.style.display = "block";
                  }}
                >
                  {e.login}
                </span>
              </div>
            );
            break;
          case "blocked":
            return (
              <div key={i} className={styles.friendLI}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.target.nextSibling.style.display = "block";
                  }}
                >
                  {e.login}
                </span>
                <div className="options" style={{ display: "none" }}>
                  <button
                    onClick={async () => {
                      fetch("https://api.betaseries.com/friends/block", {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          "X-BetaSeries-Key": "127c16f2788d",
                          Authorization:
                            "Bearer " +
                            document.cookie.substring(
                              document.cookie.indexOf("/^") + 2,
                              document.cookie.indexOf("$/")
                            ),
                        },
                        body: JSON.stringify({ id: e.id }),
                      })
                        .then((res) => res.json())
                        .then((data) => console.log(data));
                    }}
                  >
                    Unblock
                  </button>
                </div>
              </div>
            );
            break;
          default:
            break;
        }
      })}
    </div>
  );
}
