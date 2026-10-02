import { useEffect, useState } from "react";
import WordList from "../components/WordList";

type WordInfo = { id: number; word: string; reading: string; meaning: string };
function Home() {
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
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 px-4 pb-5 sm:px-6 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mt-2 grid w-full gap-4 sm:gap-6">
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
              <WordList
                words={words}
                onDelete={deleteWord}
                onEdit={(id) => {
                  const word = words.find((word) => word.id === id);

                  if (!word) return;

                  setEditingId(id);
                  setEditWord(word.word);
                  setEditReading(word.reading);
                  setEditMeaning(word.meaning);
                }}
                onUpdate={updateWord}
                editingId={editingId}
                editWord={editWord}
                editReading={editReading}
                editMeaning={editMeaning}
                setEditWord={setEditWord}
                setEditReading={setEditReading}
                setEditMeaning={setEditMeaning}
                onCancelEdit={() => setEditingId(null)}
              />
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
export default Home;
