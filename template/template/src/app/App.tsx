import { createSignal, useSignal } from "wdwh/signal";
import { useSearchParam } from "wdwh/hooks";

// See wdwh/hooks, wdwh/signal

// global signal. use with useSignal(signal)
const countSignal = createSignal(0);

// global function
function increment() {
  countSignal.set(countSignal.get() + 1);
}

function Counter() {
  const count = useSignal(countSignal);

  return (
    <div className="flex gap-8">
      <p>Counter: {count}</p>
      <button className="cursor-pointer" onClick={increment}>
        Increment
      </button>
      <button className="cursor-pointer" onClick={() => countSignal.set(0)}>
        Reset
      </button>
    </div>
  );
}

export default function App() {
  const count = useSignal(countSignal);
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
        <div>Count: {count}</div>
        <Counter />
        <Counter />
      </div>
    </main>
  );
}
