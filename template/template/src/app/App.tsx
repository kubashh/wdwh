import { signal } from "wdwh/signal"

const counter = signal(0)

function increment() {
  counter.value++
}

export default function App() {
  counter.bind()

  return (
    <main>
      <p>Counter: {counter.value}</p>
      <button className="cursor-pointer" onClick={increment}>
        Increment
      </button>
    </main>
  )
}
