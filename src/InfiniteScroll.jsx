import { useCallback, useEffect, useRef, useState } from "react";

export const InfiniteScroll = ({
  renderListItem,
  getData,
  listData,
  query,
}) => {
  const pageRef = useRef(1);
  const observer = useRef(null);
  const lastElementObserverRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const fetchAPI = useCallback(() => {
    setLoading(true);
    getData(query, pageRef.current).finally(() => {
      setLoading(false);
    });
  }, [getData, query]);

  useEffect(() => {
    fetchAPI();
  }, [query, fetchAPI]);

  useEffect(() => {
    if (loading) {
      return;
    }
    observer.current = new IntersectionObserver((entries) => {
      // if last element comes into the view then fetchApi
      if (entries[0].isIntersecting) {
        fetchAPI();
      }
    });
    // if list has data then put an observer to the lastElementObserverRef
    if (listData.length) {
      observer.current.observe(lastElementObserverRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [listData, loading, fetchAPI]);

  const renderList = () =>
    listData.map((item, index) => {
      // putting observer to the last element in the list
      if (index === listData.length - 1) {
        return renderListItem(item, item.key, lastElementObserverRef);
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
