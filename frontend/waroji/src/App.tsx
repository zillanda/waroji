import { useEffect, useState } from "react";
import { Title } from "./components/Title";
type WordInfo = { id: number; word: string; reading: string; meaning: string };
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
  const [search, setSearch] = useState("");
  async function addWord() {
    await fetch("http://localhost:8080/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, reading, meaning }),
    });
    await getWords();
  }
  async function deleteWord(id: number) {
    await fetch(`http://localhost:8080/words/${id}`, { method: "DELETE" });
    setWords((words) => words.filter((word) => word.id !== id));
  }
  async function updateWord(id: number) {
    await fetch(`http://localhost:8080/words/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        word: editWord,
        reading: editReading,
        meaning: editMeaning,
      }),
    });
    setWords((words) => {
      return words.map((word) =>
        word.id === id
          ? {
              ...word,
              word: editWord,
              reading: editReading,
              meaning: editMeaning,
            }
          : word,
      );
    });
    setEditingId(null);
  }
  async function getWords(search = "") {
    const response = await fetch(
      `http://localhost:8080/words?search=${search}`,
    );
    const data = await response.json();
    setWords(data);
  }
  useEffect(() => {
    getWords();
  }, []);
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 px-3 py-5 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <Title />
        <div className="mt-6 grid w-full gap-4 sm:mt-8 sm:gap-6">
          {/* Поиск */}
          <section className="w-full rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">
              Поиск слов
            </h2>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Поиск..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={() => getWords(search)}
                className="w-full shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 active:bg-blue-800 sm:w-auto"
              >
                Найти
              </button>
            </div>
          </section>
          {/* Список слов */}
          <section className="w-full rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold sm:text-xl">Слова</h2>
              <button
                onClick={() => setShowWords(!showWords)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 sm:w-auto"
              >
                {showWords ? "Скрыть слова" : "Показать слова"}
              </button>
            </div>
            {showWords && (
              <ul className="w-full space-y-3">
                {words.map((word) => (
                  <li
                    key={word.id}
                    className="w-full min-w-0 rounded-lg border border-gray-200 p-4 transition hover:shadow-sm"
                  >
                    {editingId === word.id ? (
                      <div className="grid w-full gap-3">
                        <input
                          value={editWord}
                          onChange={(event) => setEditWord(event.target.value)}
                          className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <input
                          value={editReading}
                          onChange={(event) =>
                            setEditReading(event.target.value)
                          }
                          className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <input
                          value={editMeaning}
                          onChange={(event) =>
                            setEditMeaning(event.target.value)
                          }
                          className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <div className="flex w-full flex-col gap-2 sm:flex-row">
                          <button
                            onClick={() => updateWord(word.id)}
                            className="w-full rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition hover:bg-green-700 sm:w-auto"
                          >
                            Сохранить
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 font-medium transition hover:bg-gray-100 sm:w-auto"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="wrap-break-words text-2xl font-medium">
                            {word.word}
                          </p>
                          <p className="wrap-break-words text-sm text-gray-500">
                            {word.reading}
                          </p>
                          <p className="mt-1 wrap-break-words text-gray-700">
                            {word.meaning}
                          </p>
                        </div>
                        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
                          <button
                            onClick={() => {
                              setEditingId(word.id);
                              setEditWord(word.word);
                              setEditReading(word.reading);
                              setEditMeaning(word.meaning);
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-100 sm:w-auto"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => deleteWord(word.id)}
                            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 sm:w-auto"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
          {/* Добавление слова */}
          <section className="w-full rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-5 text-lg font-semibold sm:text-xl">
              Добавить слово
            </h2>
            <div className="grid w-full gap-4">
              <label className="grid w-full gap-1">
                <span className="text-sm font-medium text-gray-700">Слово</span>
                <input
                  value={word}
                  onChange={(event) => setWord(event.target.value)}
                  className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="grid w-full gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Чтение
                </span>
                <input
                  value={reading}
                  onChange={(event) => setReading(event.target.value)}
                  className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="grid w-full gap-1">
                <span className="text-sm font-medium text-gray-700">
                  Перевод
                </span>
                <input
                  value={meaning}
                  onChange={(event) => setMeaning(event.target.value)}
                  className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <button
                onClick={addWord}
                className="mt-1 w-full rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 active:bg-blue-800 sm:w-auto"
              >
                Добавить слово
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
export default App;
