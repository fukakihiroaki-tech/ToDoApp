"use client";

import { useState, useEffect, useRef } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <main className="min-h-screen bg-[#f8f7f4] flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            ToDo
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {activeCount > 0 ? `残り ${activeCount} 件` : "すべて完了！"}
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition"
          />
          <button
            onClick={addTodo}
            className="px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 active:scale-95 transition"
          >
            追加
          </button>
        </div>

        {/* フィルター */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
          {(["all", "active", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了"}
            </button>
          ))}
        </div>

        {/* タスクリスト */}
        <ul className="space-y-2">
          {filteredTodos.length === 0 && (
            <li className="text-center text-gray-300 text-sm py-12">
              タスクがありません
            </li>
          )}
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 group hover:border-gray-200 transition"
            >
              {/* チェックボックス */}
              <button
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                  todo.completed
                    ? "bg-gray-900 border-gray-900"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                {todo.completed && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* テキスト */}
              <span
                className={`flex-1 text-sm leading-relaxed ${
                  todo.completed
                    ? "line-through text-gray-300"
                    : "text-gray-700"
                }`}
              >
                {todo.text}
              </span>

              {/* 削除ボタン */}
              <button
                onClick={() => deleteTodo(todo.id)}
                aria-label="削除"
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {/* 完了済みクリアボタン */}
        {todos.some((t) => t.completed) && (
          <div className="mt-4 text-right">
            <button
              onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
              className="text-xs text-gray-300 hover:text-red-400 transition"
            >
              完了済みをすべて削除
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
