import { useEffect, useState } from "react";

type WordInfo = {
  id: number;
  word: string;
  reading: string;
  meaning: string;
};



function App() {
const [words, setWords] = useState<WordInfo[]>([]);
const [word, setWord] = useState("");
const [reading, setReading] = useState("");
const [meaning, setMeaning] = useState("");
const [showWords, setShowWords] = useState(true);

async function addWord() {
  await fetch("http://localhost:8080/words", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      word,
      reading,
      meaning,
    }),
  });
    await getWords();
}

async function deleteWord(id: number) {
  await fetch(`http://localhost:8080/words/${id}`, {
    method: "DELETE",
  });

  console.log("Удаляем из React:", id);

  setWords((words) => words.filter((word) => word.id !== id));
}

async function getWords() {
  const response = await fetch("http://localhost:8080/words");
  const data = await response.json();

  console.log(data);

  setWords(data);
}

  useEffect(() => {
  getWords();
}, []);

  return (
    <div>
      <h1>Waroji 和露辞</h1>

      <button onClick={() => setShowWords(!showWords)}>
        {showWords ? "Скрыть слова" : "Показать слова"}
      </button>
      
      {showWords && (
        <ul>
{words.map((word) => (
  <li key={word.id}>
    {word.word} — {word.reading} — {word.meaning}
    <button onClick={() => deleteWord(word.id)}>
      Удалить
    </button>
  </li>
))}        </ul>
      )}
<label>
  Слово:
  <input
    value={word}
    onChange={(event) => setWord(event.target.value)}
  />
</label>

<label>
  Чтение:
  <input
    value={reading}
    onChange={(event) => setReading(event.target.value)}
  />
</label>

<label>
  Перевод:
  <input
    value={meaning}
    onChange={(event) => setMeaning(event.target.value)}
  />
</label>

<button onClick={addWord}>
  Добавить
</button>
    </div>

  );
}

export default App;