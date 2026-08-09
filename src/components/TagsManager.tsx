import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTags, createTag, getTaskTags, addTaskTag, removeTaskTag } from "../services/tagService";
import type { Tag } from "../types";

interface TagsManagerProps {
  taskId: number;
  onTagsChange?: (tags: Tag[]) => void;
}

function TagsManager({ taskId, onTagsChange }: TagsManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [taskTags, setTaskTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#FC563C");

  const loadTaskTags = useCallback(async () => {
    const { data } = await getTaskTags(taskId);
    if (data) {
      const taskTagList = data.map((tt) => tt.tags);
      setTaskTags(taskTagList);
      onTagsChange?.(taskTagList);
    }
    setLoading(false);
  }, [taskId, onTagsChange]);

  useEffect(() => {
    loadTags();
    loadTaskTags();
  }, [taskId, loadTaskTags]);

  async function loadTags() {
    const { data } = await getTags("");
    if (data) setTags(data);
  }

  async function handleCreateTag() {
    if (!newTagName.trim()) return;

    const { data } = await createTag("", newTagName.trim(), newTagColor);
    if (data && data[0] && data[0].id) {
      setTags([...tags, data[0]]);
      await handleAddTaskTag(data[0].id);
      setNewTagName("");
      setNewTagColor("#FC563C");
      setShowCreate(false);
    }
  }

  async function handleAddTaskTag(tagId: number) {
    await addTaskTag(taskId, tagId);
    await loadTaskTags();
  }

  async function handleRemoveTaskTag(tagId: number) {
    await removeTaskTag(taskId, tagId);
    await loadTaskTags();
  }

  const availableTags = tags.filter(
    (tag) => !taskTags.some((tt) => tt.id === tag.id)
  );

  return (
    <div className="tags-manager">
      <div className="tags-header">
        <h4>Tags</h4>
        <button
          className="tags-add-btn"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? "Cancel" : "+ Add Tag"}
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="tags-create-form"
          >
            <input
              type="text"
              placeholder="Tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="tags-input"
            />
            <div className="tags-color-picker">
              {["#FC563C", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4", "#84CC16"].map((color) => (
                <button
                  key={color}
                  className={`tags-color-btn ${newTagColor === color ? "active" : ""}`}
                  style={{ background: color }}
                  onClick={() => setNewTagColor(color)}
                />
              ))}
            </div>
            <button
              className="tags-create-btn"
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
            >
              Create
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {taskTags.length > 0 && (
        <div className="tags-list">
          <AnimatePresence>
            {taskTags.map((tag) => (
              <motion.span
                key={tag.id}
                className="tag-badge"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  borderColor: `${tag.color}40`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {tag.name}
                <button
                  className="tag-remove"
                  onClick={() => handleRemoveTaskTag(tag.id)}
                >
                  ✕
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {availableTags.length > 0 && (
        <div className="tags-available">
          <p className="tags-available-label">Available tags:</p>
          <div className="tags-available-list">
            {availableTags.slice(0, 8).map((tag) => (
              <button
                key={tag.id}
                className="tag-available-btn"
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color,
                  borderColor: `${tag.color}30`,
                }}
                onClick={() => handleAddTaskTag(tag.id)}
              >
                + {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {tags.length === 0 && !loading && (
        <p className="tags-empty">No tags yet. Create one to get started.</p>
      )}
    </div>
  );
}

export default TagsManager;
