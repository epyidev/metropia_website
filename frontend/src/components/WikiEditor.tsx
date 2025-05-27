import React from "react";
import MDEditor from "@uiw/react-md-editor";

const WikiEditor: React.FC<{
  pageId?: string,
  initialContent?: string,
  onSave: (content: string) => void,
  tags?: any[],
  allTags?: any[],
  onAddTag?: (tagId: number) => void,
  onRemoveTag?: (tagId: number) => void,
  onCreateTag?: () => void,
  tagError?: string | null,
  setNewTag?: (v: string) => void,
  newTag?: string
}> = ({ initialContent = "", onSave, tags = [], allTags = [], onAddTag, onRemoveTag, onCreateTag, tagError, setNewTag, newTag }) => {
  const [content, setContent] = React.useState<string>(initialContent);

  React.useEffect(() => {
    setContent(initialContent || "");
  }, [initialContent]);

  return (
    <div>
      <div data-color-mode="dark">
        <MDEditor value={content} onChange={v => setContent(v || "")} height={350} />
      </div>
      <div className="mbutton small" onClick={() => onSave(content || "")}>Enregistrer</div>
      {onAddTag && onRemoveTag && setNewTag && onCreateTag !== undefined && (
        <div className="wiki-tags-edit">
          <b>Tags :</b>
          {tags.length === 0 && <span> Aucun</span>}
          {tags.map((tag: any) => (
            <span key={tag.id} style={{ marginLeft: 8, background: '#333', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>
              {tag.name}
              <span style={{ marginLeft: 4, color: '#ff4d4d', cursor: 'pointer' }} onClick={() => onRemoveTag(tag.id)}>×</span>
            </span>
          ))}
          <select onChange={e => onAddTag(Number(e.target.value))} value="">
            <option value="">+ Ajouter un tag</option>
            {allTags.filter(t => !tags.some((pt: any) => pt.id === t.id)).map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nouveau tag"
            value={newTag || ""}
            onChange={e => setNewTag(e.target.value)}
            style={{ marginLeft: 10, padding: '2px 6px', borderRadius: 4, border: '1px solid #444', background: '#181818', color: '#fff', fontSize: 13 }}
          />
          <span className="mbutton small" style={{ marginLeft: 5 }} onClick={onCreateTag}>Créer</span>
          {tagError && <span style={{ color: 'red', marginLeft: 10 }}>{tagError}</span>}
        </div>
      )}
    </div>
  );
};

export default WikiEditor;
