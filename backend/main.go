package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	connection "waroji/database"

	"github.com/jackc/pgx/v5"
)

type WordInfo struct {
	ID      int    `json:"id"`
	Word    string `json:"word"`
	Reading string `json:"reading"`
	Meaning string `json:"meaning"`
}

var wordList = make([]WordInfo, 0)

func displayWordList(w http.ResponseWriter, r *http.Request, conn *pgx.Conn) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5174")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	fmt.Println("Метод:", r.Method)
	fmt.Println("Content-Type:", r.Header.Get("Content-Type"))

	if r.Method == "POST" {
		var word WordInfo

		err := json.NewDecoder(r.Body).Decode(&word)
		if err != nil {
			fmt.Println("Ошибка при чтении JSON:", err)
			return
		}

		_, err = conn.Exec(
			context.Background(),
			"INSERT INTO words (word, reading, meaning) VALUES ($1, $2, $3)",
			word.Word,
			word.Reading,
			word.Meaning,
		)
		if err != nil {
			fmt.Println("Ошибка при добавлении слова:", err)
			return
		}

		fmt.Println("Слово добавлено!")
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5174")
	w.Header().Set("Content-Type", "application/json")

	rows, err := conn.Query(
		context.Background(),
		"SELECT ID, word, reading, meaning FROM words",
	)
	if err != nil {
		fmt.Println("Ошибка при получении слов:", err)
		return
	}
	defer rows.Close()

	wordList = make([]WordInfo, 0)

	for rows.Next() {
		var word WordInfo

		err := rows.Scan(&word.ID, &word.Word, &word.Reading, &word.Meaning)
		if err != nil {
			fmt.Println("Ошибка при чтении слова:", err)
			return
		}

		wordList = append(wordList, word)
	}

	data, err := json.Marshal(wordList)
	if err != nil {
		fmt.Println("Ошибка при создании JSON:", err)
		return
	}

	w.Write(data)
}

func getWord(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL.Path)
}

func deleteWord(w http.ResponseWriter, r *http.Request, conn *pgx.Conn) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5174")

	idString := strings.TrimPrefix(r.URL.Path, "/words/")

	id, err := strconv.Atoi(idString)
	if err != nil {
		fmt.Println("Ошибка при удалении слова:", err)
		return
	}
	_, err = conn.Exec(
		context.Background(),
		"DELETE FROM words WHERE id = $1",
		id,
	)
	if err != nil {
		fmt.Println("Некорректный ID:", idString)
		return
	}

	fmt.Println("ID для удаления:", id)
}

func main() {

	conn := connection.GetConnection()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Waroji запущен!")
	})

	http.HandleFunc("/words", func(w http.ResponseWriter, r *http.Request) {
		displayWordList(w, r, conn)
	})
	http.HandleFunc("/words/", func(w http.ResponseWriter, r *http.Request) {
		deleteWord(w, r, conn)
	})
	fmt.Println("Сервер запущен на http://localhost:8080")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Ошибка во время работы HTTP сервера:", err)
	}

}
