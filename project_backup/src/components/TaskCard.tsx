import React, { useState } from 'react';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  onUpdate: (id: string, updates: Partial<TaskCardProps>) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description = '',
  status,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSave = () => {
    onUpdate(id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedDescription(description);
    setIsEditing(false);
  };

  return (
    <div className="task-card" data-testid={`task-card-${id}`}>
      {isEditing ? (
        <div className="task-card-edit">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            data-testid="task-title-input"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            data-testid="task-description-input"
          />
          <div className="task-card-actions">
            <button onClick={handleSave} data-testid="save-button">保存</button>
            <button onClick={handleCancel} data-testid="cancel-button">キャンセル</button>
          </div>
        </div>
      ) : (
        <div className="task-card-view">
          <h3 data-testid="task-title">{title}</h3>
          {description && <p data-testid="task-description">{description}</p>}
          <div className="task-card-actions">
            <button onClick={() => setIsEditing(true)} data-testid="edit-button">編集</button>
            <button onClick={() => onDelete(id)} data-testid="delete-button">削除</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;