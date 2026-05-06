import { createSignal } from "wdwh";
import { FileInput } from "wdwh/components";

// See wdwh, wdwh/hooks

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

export default function App() {
  return (
    <main className="flex flex-col gap-12 mx-16 my-8">
      <div className="flex gap-12">
        <div className="flex flex-col border-4 px-6 py-3 text-xl border-amber-400 rounded-xl w-fit">
          <div>Some text</div>
          <div>Text below</div>
        </div>
        <FileInput>
          <div className="flex flex-col border-4 px-6 py-3 text-xl border-amber-400 rounded-xl w-fit">
            <div>Some text</div>
            <div>Text below</div>
          </div>
        </FileInput>
        <FileInput className="flex flex-col border-4 px-6 py-3 text-xl border-amber-400 rounded-xl w-fit">
          <div>Some text</div>
          <div>Text below</div>
        </FileInput>
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
