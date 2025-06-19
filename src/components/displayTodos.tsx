import { useFetch } from "../hooks/useFetch";
import styles from "./styles.module.css";

function DisplayTodos() {
  const { data, isLoading, error, refetch, cancel } = useFetch({
    url: "https://dummyjson.com/todos",
    isAutoFetch: true,
    axiosOptions: {
      timeout: 30000,
    },
    transformResponse: (dataResponse) => {
      const todos = [...dataResponse.data.todos];
      const response = todos?.map((item) => ({
        ...item,
        todo: item.todo + " transformed",
      }));

      return {
        ...dataResponse,
        data: { ...dataResponse.data, todos: response },
      };
    },
    onSuccess: () => {
      console.log("on success");
    },
    onError: () => {
      console.log("on error");
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
      <button onClick={cancel} disabled={!isLoading}>
        cancel
      </button>
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
