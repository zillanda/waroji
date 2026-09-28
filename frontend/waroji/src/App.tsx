import { useEffect, useState } from "react";

type WordInfo = {
  id: number;
  word: string;
  reading: string;
  meaning: string;
};

function App() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editWord, setEditWord] = useState("");
  const [editReading, setEditReading] = useState("");
  const [editMeaning, setEditMeaning] = useState("");
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

  async function updateWord(id: number) {
    await fetch(`http://localhost:8080/words/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word: editWord,
        reading: editReading,
        meaning: editMeaning,
      }),
    });

    console.log("Новые данные:", editWord, editReading, editMeaning);

    setWords((words) => {
      const newWords = words.map((word) =>
        word.id === id
          ? {
              ...word,
              word: editWord,
              reading: editReading,
              meaning: editMeaning,
            }
          : word,
      );

      console.log("Новый массив:", newWords);

      return newWords;
    });
    setEditingId(null);
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
      <h1 className="text-4xl ">Waroji 和露辞</h1>

      <button onClick={() => setShowWords(!showWords)}>
        {showWords ? "Скрыть слова" : "Показать слова"}
      </button>

      {showWords && (
        <ul>
          {words.map((word) => (
            <li key={word.id}>
              {editingId === word.id ? (
                <div>
                  <input
                    value={editWord}
                    onChange={(event) => setEditWord(event.target.value)}
                  />
                  <input
                    value={editReading}
                    onChange={(event) => setEditReading(event.target.value)}
                  />

                  <input
                    value={editMeaning}
                    onChange={(event) => setEditMeaning(event.target.value)}
                  />

                  <button onClick={() => updateWord(word.id)}>Сохранить</button>
                  <button onClick={() => setEditingId(null)}>Отмена</button>
                </div>
              ) : (
                <div>
                  {word.word} — {word.reading} — {word.meaning}
                  <button
                    onClick={() => {
                      setEditingId(word.id);
                      setEditWord(word.word);
                      setEditReading(word.reading);
                      setEditMeaning(word.meaning);
                    }}
                  >
                    Изменить
                  </button>
                  <button onClick={() => deleteWord(word.id)}>Удалить</button>
                </div>
              )}
            </li>
          ))}{" "}
        </ul>
      )}
      <label>
        Слово:
        <input value={word} onChange={(event) => setWord(event.target.value)} />
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

      <button onClick={addWord}>Добавить</button>
    </div>
  );
}

export default App;
