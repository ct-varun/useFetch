import { useFetch } from "../hooks/useFetch";
import styles from "./styles.module.css";

function DisplayTodos() {
  const { data, isLoading, error, refetch } = useFetch({
    url: "https://dummyjson.com/todos",
    isAutoFetch: true,
    axiosOptions: {
      timeout: 30000,
    },
  });

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.titleWrapper}>
        <h2>Todos:</h2>
        <button onClick={refetch} disabled={isLoading}>
          fetch
        </button>
      </div>
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <ul>
          {data?.map((item: any) => (
            <li key={item.id}>{item.todo}</li>
          ))}
        </ul>
      )}
      {!!error && <p>{error}</p>}
    </div>
  );
}

export default DisplayTodos;
