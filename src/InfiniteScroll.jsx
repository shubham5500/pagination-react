import { useCallback, useEffect, useRef, useState } from "react";

export const InfiniteScroll = ({
  renderListItem,
  getData,
  listData,
  query,
}) => {
  const pageRef = useRef(1);
  const observer = useRef(null);
  const lastElementObserver = useRef(null);

  const [loading, setLoading] = useState(false);

  const fetchAPI = useCallback(() => {
    setLoading(true);
    getData(query, pageRef.current)
      .then((res) => {
        console.log({ res });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getData, query]);

  useEffect(() => {
    console.log("USE EFFECT");
    fetchAPI();
  }, [query, fetchAPI]);

  useEffect(() => {
    if (loading) {
      return;
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchAPI();
      }
    });

    if (listData.length) {
      observer.current.observe(lastElementObserver.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [listData, loading, fetchAPI]);

  const renderList = () =>
    listData.map((item, index) => {
      if (index === listData.length - 1) {
        return renderListItem(item, item.key, lastElementObserver);
      }
      return renderListItem(item, item.key, null);
    });

  return (
    <>
      {renderList()}
      {loading && "LOADING"}
    </>
  );
};
