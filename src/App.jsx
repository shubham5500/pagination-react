import {
  useCallback,
  useRef,
  useState
} from "react";
import { InfiniteScroll } from "./InfiniteScroll";

export default function Main() {
  const [query, setQuery] = useState("");
  const [trash, setTrash] = useState("");

  const [apiData, setApiData] = useState([]);
  const controllerRef = useRef(null);

  const renderItem = ({ title }, key, ref) => (
    <div ref={ref} key={key}>
      {title}
    </div>
  );

  const getData = useCallback((query, pagenumber) => {
    return new Promise(async (res, rej) => {
      try {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const promise = await fetch(
          "https://openlibrary.org/search.json?" +
            new URLSearchParams({
              q: query,
              page: pagenumber,
            }),
          { signal: controllerRef.current.signal }
        );

        const data = await promise.json();
        setApiData((pre) => [...pre, ...data.docs]);
        res(data);
      } catch (error) {
        rej("");
      }
    });
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: '50%',
        padding: 10
      }}
    >
      <input
        value={query}
        style={{
          marginBottom: 20,
          padding: "10px, 5px",
        }}
        placeholder="Search Movie"
        onChange={(e) => setQuery(e.target.value)}
      />
      <InfiniteScroll
        renderListItem={renderItem}
        listData={apiData}
        getData={getData}
        query={query}
      />
    </div>
  );
}