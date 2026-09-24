package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	connection "waroji/database"
)

type WordInfo struct {
	Word    string `json:"word"`
	Reading string `json:"reading"`
	Meaning string `json:"meaning"`
}

var wordList = make([]WordInfo, 0)

func displayWordList(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Метод:", r.Method)
	fmt.Println("Content-Type:", r.Header.Get("Content-Type"))

	if r.Method == "POST" {
		var word WordInfo

		err := json.NewDecoder(r.Body).Decode(&word)
		if err != nil {
			fmt.Println("Ошибка при чтении JSON:", err)
			return
		}

		fmt.Println(word)

		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Content-Type", "application/json")

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

func main() {

	wordList = append(wordList, WordInfo{
		Word:    "食べる",
		Reading: "たべる",
		Meaning: "кушать",
	})

	wordList = append(wordList, WordInfo{
		Word:    "飲む",
		Reading: "のむ",
		Meaning: "пить",
	})

	wordList = append(wordList, WordInfo{
		Word:    "行く",
		Reading: "いく",
		Meaning: "идти",
	})
	connection.CheckConnection()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Waroji запущен!")
	})

	http.HandleFunc("/words", displayWordList)
	http.HandleFunc("/words/", getWord)

	fmt.Println("Сервер запущен на http://localhost:8080")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Ошибка во время работы HTTP сервера:", err)
	}

}
