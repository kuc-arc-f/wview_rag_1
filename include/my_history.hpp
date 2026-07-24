#pragma once
#include "sqlite3.h"
#include <iostream>
#include <string>
#include <sstream>
#include <stdexcept>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

struct Todo {
    int id;
    std::string title;
};

struct History {
    int id;
    std::string input;
    std::string content;
    std::string created_at;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(History, id, input, content, created_at)

// ─────────────────────────────────────────
//  Database helper
// ─────────────────────────────────────────
class HistoryDB {
public:
    explicit HistoryDB(const std::string& path) {
        if (sqlite3_open(path.c_str(), &db_) != SQLITE_OK)
            die("open");
        exec("PRAGMA journal_mode=WAL;");
        exec(R"(
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                input TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT,
                updated_at TEXT
            );            
        )");
    }
    ~HistoryDB() { sqlite3_close(db_); }

    void history_add(const std::string& input, const std::string& content) {
        //std::string now = timestamp();
        std::string now = "";
        sqlite3_stmt* s;
        prepare("INSERT INTO history (input, content, created_at) VALUES (?, ?, ?);", &s);
        sqlite3_bind_text(s, 1, input.c_str(), -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(s, 2, content.c_str(),   -1, SQLITE_TRANSIENT);
        sqlite3_bind_text(s, 3, now.c_str(),   -1, SQLITE_TRANSIENT);
        step_and_finalize(s);
        std::cout << "✓ 追加しました: [" << sqlite3_last_insert_rowid(db_) << "] " << "\n";
    }

    void history_remove(int id) {
        sqlite3_stmt* s;
        prepare("DELETE FROM history WHERE id = ?;", &s);
        sqlite3_bind_int(s, 1, id);
        step_and_finalize(s);
        if (sqlite3_changes(db_) == 0)
            std::cout << "ID " << id << " が見つかりません。\n";
        else
            std::cout << "✓ 削除しました: ID " << id << "\n";
    }

    // ── Read ───────────────────────────────
    std::vector<History> history_list(const std::string& filter = "all") {
        std::string sql = "SELECT id, input, content, created_at FROM history";
        sql += " ORDER BY id DESC LIMIT 100;";

        sqlite3_stmt* s;
        prepare(sql, &s);
        std::vector<History> rows;
        //sqlite3_column_int (s, 0),
        while (sqlite3_step(s) == SQLITE_ROW) {
            rows.push_back({
                sqlite3_column_int (s, 0),
                reinterpret_cast<const char*>(sqlite3_column_text(s, 1)),
                reinterpret_cast<const char*>(sqlite3_column_text(s, 2)),
                reinterpret_cast<const char*>(sqlite3_column_text(s, 3)),
            });
        }
        sqlite3_finalize(s);
        return rows;
    }

private:
    sqlite3* db_ = nullptr;

    void exec(const std::string& sql) {
        char* err = nullptr;
        if (sqlite3_exec(db_, sql.c_str(), nullptr, nullptr, &err) != SQLITE_OK) {
            std::string msg = err ? err : "unknown";
            sqlite3_free(err);
            die(msg);
        }
    }

    void prepare(const std::string& sql, sqlite3_stmt** s) {
        if (sqlite3_prepare_v2(db_, sql.c_str(), -1, s, nullptr) != SQLITE_OK)
            die(sqlite3_errmsg(db_));
    }

    void step_and_finalize(sqlite3_stmt* s) {
        sqlite3_step(s);
        sqlite3_finalize(s);
    }

    [[noreturn]] static void die(const std::string& msg) {
        std::cerr << "DB error: " << msg << "\n";
        std::exit(1);
    }
};

// ─────────────────────────────────────────
//  todo helper
// ─────────────────────────────────────────
class MyTodo {
private:
    std::string m_file_path = "";

public:
    explicit MyTodo(const std::string& path) {
        m_file_path = path;
    }
    ~MyTodo() {
    }
    
    std::string todo_to_json(const Todo& t) {
        std::ostringstream oss;
        oss << "{"
            << "\"id\":"    << t.id           << ","
            << "\"title\":\"" << t.title      << "\""
            << "}";
        return oss.str();
    }

    std::string todos_to_json(const std::vector<Todo>& todos) {
        std::ostringstream oss;
        oss << "[";
        for (size_t i = 0; i < todos.size(); ++i) {
            if (i > 0) oss << ",";
            oss << todo_to_json(todos[i]);
        }
        oss << "]";
        return oss.str();
    }    

    std::string history_json(const std::vector<History>& items) {
        std::ostringstream oss;
        oss << "[";
        for (size_t i = 0; i < items.size(); ++i) {
            History row = items[i];
            if (i > 0) oss << ",";
            History his;
            his.id = row.id;
            his.input = row.input;
            his.content = row.content;
            json j = his;
            std::string json_str = j.dump();            
            //oss << history_row_json(items[i]);
            oss << json_str;
        }
        oss << "]";
        return oss.str();
    }    

};
