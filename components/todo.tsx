"use client";

import { Checkbox, IconButton, Spinner } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { updateTodo, deleteTodo } from "actions/todo-actions";
import { queryClient } from "config/ReactQueryClientProvider";
import { format } from "date-fns";
import { useState } from "react";

export default function Todo({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(todo.completed);
  const [title, setTitle] = useState(todo.title);
  const [created_at] = useState(todo.created_at);
  const [updated_at] = useState(todo.updated_at);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
  };

  // todo 수정
  const updateTodoMutation = useMutation({
    mutationFn: () =>
      updateTodo({
        id: todo.id,
        title,
        completed,
      }),
    onSuccess: (updatedTodo) => {
      setIsEditing(false); // editing mode off
      queryClient.refetchQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  //todo 삭제
  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="flex items-center w-full gap-2">
      <Checkbox
        checked={completed}
        onChange={async (e) => {
          // completed 상태를 변경하고, 서버에 업데이트 요청
          await setCompleted(e.target.checked);
          await updateTodoMutation.mutate();
        }}
      />
      {isEditing ? (
        <input
          className="flex-1 border-b-black border-b pb-1"
          placeholder="New Todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <p className={`flex-1 ${completed && "line-through"}`}>{title}</p>
      )}
      <span className="text-sm text-gray-500">
        {updated_at
          ? "수정됨: " + formatDate(updated_at)
          : formatDate(created_at)}
      </span>
      {isEditing ? (
        <IconButton
          onClick={async () => {
            await updateTodoMutation.mutate();
          }}
        >
          {updateTodoMutation.isPending ? (
            <Spinner />
          ) : (
            <i className="fas fa-check" />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={() => setIsEditing(true)}>
          <i className="fas fa-pen" />
        </IconButton>
      )}
      <IconButton onClick={() => deleteTodoMutation.mutate()}>
        {deleteTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className="fas fa-trash" />
        )}
      </IconButton>
    </div>
  );
}
