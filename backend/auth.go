package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

func registerHandler(w http.ResponseWriter, r *http.Request, conn *pgx.Conn) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		http.Error(w, "Password processing failed", http.StatusInternalServerError)
		return
	}

	_, err = conn.Exec(context.Background(),
		`INSERT INTO users (username, email, password_hash)
		 VALUES ($1, $2, $3)`,
		req.Username, req.Email, string(passwordHash),
	)
	if err != nil {
		http.Error(w, "Could not register user", http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"message": "Registration successful",
	})
}

func loginHandler(w http.ResponseWriter, r *http.Request, conn *pgx.Conn) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var userID int
	var passwordHash string

	err := conn.QueryRow(context.Background(),
		`SELECT id, password_hash
		 FROM users
		 WHERE username = $1 OR email = $1`,
		req.Login,
	).Scan(&userID, &passwordHash)

	if err != nil {
		http.Error(w, "Invalid login or password", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(passwordHash),
		[]byte(req.Password),
	); err != nil {
		http.Error(w, "Invalid login or password", http.StatusUnauthorized)
		return
	}

	sessionID := uuid.New()

	expiresAt := time.Now().Add(30 * 24 * time.Hour)

	_, err = conn.Exec(context.Background(),
		`INSERT INTO sessions (id, user_id, expires_at)
	 VALUES ($1, $2, $3)`,
		sessionID, userID, expiresAt,
	)
	if err != nil {
		http.Error(w, "Could not create session", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    sessionID.String(),
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   false,
		Expires:  expiresAt,
	})

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{
		"message": "Login successful",
	})
}

func meHandler(w http.ResponseWriter, r *http.Request, conn *pgx.Conn) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("session_id")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	sessionID, err := uuid.Parse(cookie.Value)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var username string
	var email string

	err = conn.QueryRow(context.Background(),
		`SELECT users.username, users.email
		 FROM sessions
		 JOIN users ON users.id = sessions.user_id
		 WHERE sessions.id = $1
		   AND sessions.expires_at > NOW()`,
		sessionID,
	).Scan(&username, &email)

	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{
		"username": username,
		"email":    email,
	})
}

func logoutHandler(w http.ResponseWriter, r *http.Request, conn *pgx.Conn) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("session_id")
	if err == nil {
		sessionID, parseErr := uuid.Parse(cookie.Value)
		if parseErr == nil {
			_, err = conn.Exec(context.Background(),
				`DELETE FROM sessions WHERE id = $1`,
				sessionID,
			)
			if err != nil {
				http.Error(w, "Could not logout", http.StatusInternalServerError)
				return
			}
		}
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	})

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]string{
		"message": "Logout successful",
	})
}
