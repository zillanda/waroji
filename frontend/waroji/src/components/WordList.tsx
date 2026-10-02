type WordInfo = { id: number; word: string; reading: string; meaning: string };
type WordListProps = {
  words: WordInfo[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onUpdate: (id: number) => void;
  editingId: number | null;
  editWord: string;
  editReading: string;
  editMeaning: string;
  setEditWord: (value: string) => void;
  setEditReading: (value: string) => void;
  setEditMeaning: (value: string) => void;
  onCancelEdit: () => void;
};
function WordList({
  words,
  onDelete,
  onEdit,
  onUpdate,
  editingId,
  editWord,
  editReading,
  editMeaning,
  setEditWord,
  setEditReading,
  setEditMeaning,
  onCancelEdit,
}: WordListProps) {
  return (
    <ul className="w-full space-y-3">
      
      {words.map((word) => {
        const isEditing = editingId === word.id;
        return (
          <li
            key={word.id}
            className="w-full min-w-0 rounded-lg border border-gray-200 p-4 transition hover:shadow-sm"
          >
            
            {isEditing ? (
              <div className="grid w-full gap-3">
                
                <input
                  value={editWord}
                  onChange={(event) => setEditWord(event.target.value)}
                  className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  value={editReading}
                  onChange={(event) => setEditReading(event.target.value)}
                  className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  value={editMeaning}
                  onChange={(event) => setEditMeaning(event.target.value)}
                  className="box-border w-full min-w-0 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <div className="flex w-full flex-col gap-2 sm:flex-row">
                  
                  <button
                    onClick={() => onUpdate(word.id)}
                    className="w-full rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition hover:bg-green-700 sm:w-auto"
                  >
                    
                    Сохранить
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 font-medium transition hover:bg-gray-100 sm:w-auto"
                  >
                    
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                
                <div className="min-w-0 flex-1">
                  
                  <p className="wrap-break-words text-lg font-semibold">
                    
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
                    onClick={() => onEdit(word.id)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-100 sm:w-auto"
                  >
                    
                    Изменить
                  </button>
                  <button
                    onClick={() => onDelete(word.id)}
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 sm:w-auto"
                  >
                    
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
export default WordList;
