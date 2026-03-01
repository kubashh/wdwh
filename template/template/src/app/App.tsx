import { signal } from "wdwh/signal";
import { useSearchParam } from "wdwh/hooks";

// See wdwh/hooks, wdwh/signal

const counter = signal(0);

function increment() {
  counter.value++;
}

export default function App() {
  counter.bind();
  const [url, setUrl] = useSearchParam(`test`, `Starting value`);

  return (
    <main className="flex flex-col gap-12 mx-16 my-8">
      <div>
        <h2 className="mb-4 text-xl">Test useSearchParam (wdwh/hooks)</h2>
        <input
          type="text"
          className="border-2 border-zinc-600 px-1"
          defaultValue={url}
          onChange={(e: any) => {
            setUrl(e.target.value);
          }}
        />
      </div>

      <div>
        <h2 className="mb-4 text-xl">Test signal (wdwh/signal)</h2>
        <p>Counter: {counter.value}</p>
        <button className="cursor-pointer" onClick={increment}>
          Increment
        </button>
      </div>
    </main>
  );
}
