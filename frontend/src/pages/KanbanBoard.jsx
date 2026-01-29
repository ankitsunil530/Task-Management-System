import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateTask } from "../features/tasks/taskSlice";
import TaskCard from "../components/TaskCard";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function KanbanBoard() {
  const dispatch = useDispatch();
  const { list: tasks, isLoading } = useSelector((state) => state.tasks);

  const groupedTasks = useMemo(() => {
    const map = { todo: [], "in-progress": [], done: [] };
    tasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [tasks]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    dispatch(updateTask({ id: draggableId, data: { status: newStatus } }));
  };

  if (isLoading) {
    return (
      <div className="p-6 text-gray-400">Loading tasks...</div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold text-white mb-4">Kanban Board</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-gray-950 border border-gray-800 rounded-xl p-3 min-h-[400px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-gray-900" : ""
                  }`}
                >
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">
                    {col.title} ({groupedTasks[col.id].length})
                  </h3>

                  <div className="space-y-3">
                    {groupedTasks[col.id].map((task, index) => (
                      <Draggable
                        draggableId={task._id}
                        index={index}
                        key={task._id}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`$${snapshot.isDragging ? "opacity-80" : ""}`}
                          >
                            <TaskCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
