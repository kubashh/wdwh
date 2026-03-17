import { createSignal } from "wdwh/signal";
import { useSearchParam } from "wdwh/hooks";

// See wdwh/hooks, wdwh/signal

const countSignal = createSignal(0);
// countSignal.use() is same that useSignal(countSignal)

// global function
function increment() {
  countSignal.set((prev) => prev + 1);

  // same as
  // countSignal.set(countSignal.get() + 1);
}

function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="min-w-24 px-2 py-1 border-2 rounded-xl border-zinc-300 cursor-pointer"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Counter() {
  const count = countSignal.use();
  return <Button label={`Count: ${count}`} onClick={increment} />;
}

function UrlInput({ param, defaultValue = `` }: { param: string; defaultValue?: string }) {
  const [url, setUrl] = useSearchParam(param, defaultValue);
  return (
    <input
      type="text"
      className="border-2 px-2 py-1 rounded-lg border-zinc-600"
      defaultValue={url}
      onChange={(e: any) => {
        setUrl(e.target.value);
      }}
    />
  );
}

export default function App() {
  return (
    <main className="flex flex-col gap-12 mx-16 my-8">
      <div>
        <h2 className="mb-4 text-2xl">Test useSearchParam (wdwh/hooks)</h2>
        <div className="m-4 flex gap-8">
          <UrlInput param="test" defaultValue="Starting Value" />
          <UrlInput param="apple" defaultValue="apple" />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl">Test signal (wdwh/signal)</h2>
        <div className="m-4 flex gap-8">
          <Button label="Reset" onClick={() => countSignal.set(0)} />
          <Counter />
          <Counter />
        </div>
      </div>
    </main>
  );
}
