import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronDown, X } from 'lucide-react';
import stageData from '../../wireframes/data/stage_hierarchy.json';

interface StageNode {
  stage_id: string;
  name: string;
  display_name: string;
  child_stage_ids: string[];
}

interface Props {
  selectedStageIds: string[];
  onChange: (ids: string[]) => void;
}

type CheckState = 'checked' | 'unchecked' | 'indeterminate';

const stages = stageData.stages as Record<string, StageNode>;
const rootIds = stageData.root_stage_ids as string[];

function getAllDescendants(stageId: string): string[] {
  const node = stages[stageId];
  if (!node || node.child_stage_ids.length === 0) return [];
  const result: string[] = [];
  for (const childId of node.child_stage_ids) {
    result.push(childId);
    result.push(...getAllDescendants(childId));
  }
  return result;
}

function getAncestors(stageId: string): string[] {
  const parts = stageId.split('.');
  const ancestors: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    ancestors.push(parts.slice(0, i).join('.'));
  }
  return ancestors;
}

// Individual tree node component (needed so hooks are called properly)
function TreeNode({
  stageId,
  depth,
  checkState,
  expanded,
  onToggleCheck,
  onToggleExpand,
  children,
}: {
  stageId: string;
  depth: number;
  checkState: CheckState;
  expanded: boolean;
  onToggleCheck: () => void;
  onToggleExpand: () => void;
  children?: React.ReactNode;
}) {
  const node = stages[stageId];
  const checkboxRef = useRef<HTMLInputElement>(null);
  const hasChildren = node && node.child_stage_ids.length > 0;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = checkState === 'indeterminate';
    }
  }, [checkState]);

  if (!node) return null;

  return (
    <div>
      <div className="stage-tree-node" style={{ paddingLeft: 14 + depth * 22 }}>
        <button
          type="button"
          className={`stage-tree-toggle ${!hasChildren ? 'invisible' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggleExpand();
          }}
        >
          {hasChildren && (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </button>
        <input
          ref={checkboxRef}
          type="checkbox"
          className="stage-tree-checkbox"
          checked={checkState === 'checked'}
          onChange={onToggleCheck}
        />
        <span className="stage-tree-label" onClick={onToggleCheck}>
          <span className="stage-tree-label-name">{node.display_name}</span>
        </span>
      </div>
      {hasChildren && expanded && children}
    </div>
  );
}

export function StageTreeSelect({ selectedStageIds, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const selectedSet = useMemo(() => new Set(selectedStageIds), [selectedStageIds]);

  const getCheckState = useCallback(
    (stageId: string): CheckState => {
      const node = stages[stageId];
      if (!node) return 'unchecked';

      if (node.child_stage_ids.length === 0) {
        return selectedSet.has(stageId) ? 'checked' : 'unchecked';
      }

      const descendants = getAllDescendants(stageId);
      const allIds = [stageId, ...descendants];
      const checkedCount = allIds.filter((id) => selectedSet.has(id)).length;

      if (checkedCount === 0) return 'unchecked';
      if (checkedCount === allIds.length) return 'checked';
      return 'indeterminate';
    },
    [selectedSet]
  );

  const handleToggle = useCallback(
    (stageId: string) => {
      const state = getCheckState(stageId);
      const descendants = getAllDescendants(stageId);
      const allIds = [stageId, ...descendants];
      const newSet = new Set(selectedSet);

      if (state === 'checked') {
        for (const id of allIds) newSet.delete(id);
      } else {
        for (const id of allIds) newSet.add(id);
      }

      const ancestors = getAncestors(stageId);
      for (const ancestorId of ancestors) {
        const anc = stages[ancestorId];
        if (!anc) continue;
        const ancDescendants = getAllDescendants(ancestorId);
        const allChecked = ancDescendants.every((id) => newSet.has(id));

        if (allChecked) {
          newSet.add(ancestorId);
        } else {
          newSet.delete(ancestorId);
        }
      }

      onChange([...newSet]);
    },
    [selectedSet, getCheckState, onChange]
  );

  const handleRemoveChip = useCallback(
    (stageId: string) => {
      const descendants = getAllDescendants(stageId);
      const toRemove = new Set([stageId, ...descendants]);
      const ancestors = getAncestors(stageId);
      for (const a of ancestors) toRemove.add(a);
      onChange(selectedStageIds.filter((id) => !toRemove.has(id)));
    },
    [selectedStageIds, onChange]
  );

  const toggleExpand = (stageId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  };

  const chipItems = useMemo(() => {
    if (selectedStageIds.length === 0) return [];
    const chips: { id: string; label: string }[] = [];
    const covered = new Set<string>();

    for (const rootId of rootIds) {
      const state = getCheckState(rootId);
      if (state === 'unchecked') continue;

      const node = stages[rootId];
      if (!node) continue;

      const descendants = getAllDescendants(rootId);
      const selectedDescCount = descendants.filter((d) => selectedSet.has(d)).length;

      if (state === 'checked') {
        chips.push({ id: rootId, label: `${node.display_name} + all sub-stages` });
      } else {
        chips.push({
          id: rootId,
          label: `${node.display_name} — ${selectedDescCount} sub-stage${selectedDescCount !== 1 ? 's' : ''}`,
        });
      }
      covered.add(rootId);
      for (const d of descendants) covered.add(d);
    }

    for (const id of selectedStageIds) {
      if (!covered.has(id) && stages[id]) {
        chips.push({ id, label: stages[id].display_name });
      }
    }

    return chips;
  }, [selectedStageIds, selectedSet, getCheckState]);

  const renderNode = (stageId: string, depth: number): JSX.Element | null => {
    const node = stages[stageId];
    if (!node) return null;

    return (
      <TreeNode
        key={stageId}
        stageId={stageId}
        depth={depth}
        checkState={getCheckState(stageId)}
        expanded={expanded.has(stageId)}
        onToggleCheck={() => handleToggle(stageId)}
        onToggleExpand={() => toggleExpand(stageId)}
      >
        {node.child_stage_ids.map((childId) => renderNode(childId, depth + 1))}
      </TreeNode>
    );
  };

  return (
    <div className="stage-tree-wrapper">
      <div className="stage-tree-header" onClick={() => setIsOpen(!isOpen)}>
        <span>
          {selectedStageIds.length === 0
            ? 'Select pathway stages...'
            : `${selectedStageIds.length} stage${selectedStageIds.length !== 1 ? 's' : ''} selected`}
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>

      {chipItems.length > 0 && (
        <div className="stage-tree-chips">
          {chipItems.map((chip) => (
            <span key={chip.id} className="stage-chip">
              {chip.label}
              <button type="button" onClick={() => handleRemoveChip(chip.id)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="stage-tree-body">{rootIds.map((rootId) => renderNode(rootId, 0))}</div>
      )}
    </div>
  );
}
