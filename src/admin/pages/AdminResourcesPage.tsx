import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Plus, Trash2, Save, ChevronDown, ChevronRight, User,
  FileText, Video, ExternalLink, X, ArrowUpRight, Sparkles,
} from 'lucide-react';
import type { IntentType, PathwayStageResource } from '../../types/admin';
import { INTENT_OPTIONS } from '../../types/admin';
import { StageTreeSelect } from '../components/StageTreeSelect';
import { useAdminAuth } from '../AdminAuthContext';
import stageData from '../../wireframes/data/stage_hierarchy.json';

interface StageInfo {
  display_name: string;
  child_stage_ids: string[];
}

const allStages = stageData.stages as Record<string, StageInfo>;
const rootStageIds = stageData.root_stage_ids as string[];

interface ResourceRow {
  localId: string;
  id?: string;
  pathway_stage_ids: string[];
  description: string;
  title: string;
  url: string;
  type: 'pdf' | 'video' | 'link';
  intents: IntentType[];
  _dirty?: boolean;
}

function newRow(presetStageIds?: string[]): ResourceRow {
  return {
    localId: `row_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    pathway_stage_ids: presetStageIds || [],
    description: '',
    title: '',
    url: '',
    type: 'pdf',
    intents: [],
    _dirty: true,
  };
}

function detectTypeFromUrl(url: string): 'pdf' | 'video' | 'link' | null {
  if (!url.trim()) return null;
  const lower = url.toLowerCase();
  if (
    lower.includes('youtube.com') || lower.includes('youtu.be') ||
    lower.includes('vimeo.com') || lower.endsWith('.mp4') || lower.endsWith('.webm')
  ) return 'video';
  if (lower.endsWith('.pdf') || lower.includes('/pdf')) return 'pdf';
  return null;
}

const MOCK_ROWS: ResourceRow[] = [
  {
    localId: 'demo-1',
    id: 'demo-1',
    pathway_stage_ids: ['2', '2.1', '2.1.1', '2.1.1.1', '2.1.1.2', '2.1.1.2.1', '2.1.1.2.2'],
    description: 'Information about breast surgery procedures',
    title: 'Information on the procedure',
    url: 'https://youtu.be/zeMr6XaoTEM',
    type: 'video',
    intents: ['surgery_procedures', 'post_surgery_recovery'],
  },
  {
    localId: 'demo-2',
    id: 'demo-2',
    pathway_stage_ids: ['2', '2.1', '2.1.1', '2.1.1.1', '2.1.1.2', '2.1.1.2.1', '2.1.1.2.2'],
    description: 'Chest wall perforator flap patient leaflet',
    title: 'Barts chest wall perforator flap PIF',
    url: 'https://drive.google.com/file/d/1TcJlT72dojrOCe8Z3OIxsfTSga4-tYF_/view',
    type: 'pdf',
    intents: ['surgery_procedures'],
  },
];

const stagesSummary = (ids: string[]) => {
  if (ids.length === 0) return 'Select stages (required)…';
  const topLevel = ids.filter((id) => !id.includes('.') || !ids.includes(id.split('.').slice(0, -1).join('.')));
  const first = allStages[topLevel[0]]?.display_name || topLevel[0];
  if (ids.length === 1) return first;
  return `${first} + ${ids.length - 1} more`;
};

const TYPE_META = {
  pdf: { icon: FileText, label: 'PDF', color: 'var(--rose-400)' },
  video: { icon: Video, label: 'Video', color: 'var(--lavender-300)' },
  link: { icon: ExternalLink, label: 'Link', color: 'var(--sage-400)' },
} as const;

function pathWayResourcesToRows(resources: PathwayStageResource[]): ResourceRow[] {
  const flatRows: ResourceRow[] = [];
  for (const item of resources) {
    for (const r of item.resources) {
      flatRows.push({
        localId: `row_${item.id}_${flatRows.length}`,
        id: item.id,
        pathway_stage_ids: [...item.pathway_stage_ids],
        description: item.description || '',
        title: r.title,
        url: r.url,
        type: r.type,
        intents: [...item.intents],
      });
    }
  }
  return flatRows;
}

export function AdminResourcesPage() {
  const { adminUser } = useAdminAuth();
  const [rows, setRows] = useState<ResourceRow[]>([newRow()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveToastError, setSaveToastError] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<{ rowId: string; kind: 'stages' | 'intents' } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [expandedCov, setExpandedCov] = useState<Set<string>>(new Set());
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const newCardRef = useRef<HTMLDivElement>(null);

  const coverage = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of rows) {
      if (!row.title.trim() && !row.url.trim()) continue;
      for (const sid of row.pathway_stage_ids) {
        map.set(sid, (map.get(sid) || 0) + 1);
      }
    }
    return map;
  }, [rows]);

  const ancestorsWithCoverage = useMemo(() => {
    const ancestors = new Set<string>();
    for (const stageId of coverage.keys()) {
      const parts = stageId.split('.');
      while (parts.length > 1) {
        parts.pop();
        ancestors.add(parts.join('.'));
      }
    }
    return ancestors;
  }, [coverage]);

  useEffect(() => {
    const toExpand = new Set<string>();
    for (const stageId of coverage.keys()) {
      const parts = stageId.split('.');
      while (parts.length > 1) {
        parts.pop();
        toExpand.add(parts.join('.'));
      }
    }
    if (toExpand.size > 0) {
      setExpandedCov((prev) => {
        const merged = new Set(prev);
        for (const id of toExpand) merged.add(id);
        return merged;
      });
    }
  }, [coverage]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { getPathwayResources } = await import('../../services/adminApi');
        const data = await getPathwayResources();
        if (!cancelled && data.resources.length > 0) {
          const flatRows = pathWayResourcesToRows(data.resources);
          if (flatRows.length > 0) setRows(flatRows);
        }
      } catch {
        setRows(MOCK_ROWS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (openDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown]);

  const addRow = () => {
    const row = newRow(activeStage ? [activeStage] : undefined);
    setRows((prev) => [...prev, row]);
    setTimeout(() => newCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const addRowForStage = (stageId: string) => {
    const row = newRow([stageId]);
    setRows((prev) => [...prev, row]);
    setActiveStage(stageId);
    setTimeout(() => newCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const removeRow = async (localId: string) => {
    const row = rows.find((r) => r.localId === localId);
    if (!row) return;

    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.localId !== localId) : prev));

    if (row.id) {
      try {
        const { deletePathwayResource } = await import('../../services/adminApi');
        await deletePathwayResource(row.id);
      } catch (err) {
        console.error('Backend delete failed:', err);
      }
    }
  };

  const updateRow = useCallback((localId: string, updates: Partial<ResourceRow>) => {
    setRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, ...updates, _dirty: true } : r)));
  }, []);

  const handleUrlChange = useCallback((localId: string, url: string) => {
    const detected = detectTypeFromUrl(url);
    const updates: Partial<ResourceRow> = { url, _dirty: true };
    if (detected) updates.type = detected;
    setRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, ...updates } : r)));
  }, []);

  const toggleIntent = (localId: string, intent: IntentType) => {
    setRows((prev) =>
      prev.map((r) =>
        r.localId === localId
          ? { ...r, _dirty: true, intents: r.intents.includes(intent) ? r.intents.filter((i) => i !== intent) : [...r.intents, intent] }
          : r,
      ),
    );
  };

  const handleSaveAll = async () => {
    const validRows = rows.filter(
      (r) =>
        r.title.trim() &&
        r.url.trim() &&
        r.description.trim() &&
        r.intents.length > 0 &&
        r.pathway_stage_ids.length > 0,
    );
    if (validRows.length === 0) return;

    setSaving(true);
    setSaveMessage(null);
    setSaveToastError(false);

    const localData = validRows.map((row) => ({
      pathway_stage_ids: row.pathway_stage_ids,
      description: row.description,
      intents: row.intents,
      resources: [{ title: row.title, url: row.url, type: row.type }],
    }));
    localStorage.setItem('admin_pathway_resources', JSON.stringify(localData));

    try {
      for (const row of validRows) {
        const payload = {
          clinician_name: adminUser?.name || '',
          clinician_id: adminUser?.id || '',
          pathway_stage_ids: row.pathway_stage_ids,
          description: row.description,
          intents: row.intents,
          resources: [{ title: row.title, url: row.url, type: row.type }],
        };
        if (row.id) {
          const { updatePathwayResource } = await import('../../services/adminApi');
          await updatePathwayResource(row.id, payload);
          setRows((prev) =>
            prev.map((r) => (r.localId === row.localId ? { ...r, _dirty: false } : r)),
          );
        } else {
          const { createPathwayResource } = await import('../../services/adminApi');
          const created = await createPathwayResource(payload);
          setRows((prev) =>
            prev.map((r) =>
              r.localId === row.localId
                ? {
                    ...r,
                    id: created.id,
                    _dirty: false,
                    description: created.description,
                    intents: [...created.intents],
                    pathway_stage_ids: [...created.pathway_stage_ids],
                  }
                : r,
            ),
          );
        }
      }

      setSaveMessage('All resources saved successfully.');
      setSaveToastError(false);
      try {
        const { getPathwayResources } = await import('../../services/adminApi');
        const data = await getPathwayResources();
        if (data.resources.length > 0) {
          const next = pathWayResourcesToRows(data.resources);
          if (next.length > 0) setRows(next);
        }
      } catch (re) {
        console.warn('[AdminResources] Refetch after save failed', re);
        setSaveMessage('Saved, but the list could not be refreshed. Reload the page to see the latest data.');
        setSaveToastError(false);
      }
    } catch (err) {
      console.error('[AdminResources] Save failed', err);
      setSaveMessage(err instanceof Error ? err.message : 'Save failed. Please try again.');
      setSaveToastError(true);
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSaveMessage(null);
        setSaveToastError(false);
      }, 5000);
    }
  };

  const isDropdownOpen = (rowId: string, kind: 'stages' | 'intents') =>
    openDropdown?.rowId === rowId && openDropdown?.kind === kind;

  const toggleDropdown = (rowId: string, kind: 'stages' | 'intents') =>
    setOpenDropdown(isDropdownOpen(rowId, kind) ? null : { rowId, kind });

  const toggleCovExpand = (stageId: string) => {
    setExpandedCov((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  };

  const totalCovered = coverage.size;
  const totalStages = Object.keys(allStages).length;
  const hasDirty = rows.some((r) => r._dirty);

  const filteredRows = activeStage
    ? rows.filter((r) => r.pathway_stage_ids.includes(activeStage))
    : rows;

  function renderCovNode(stageId: string, depth: number): React.ReactNode {
    const stage = allStages[stageId];
    if (!stage) return null;
    const count = coverage.get(stageId) || 0;
    const hasChildren = stage.child_stage_ids.length > 0;
    const isExpanded = expandedCov.has(stageId);
    const hasCoveredChild = ancestorsWithCoverage.has(stageId);
    const isActive = activeStage === stageId;

    return (
      <div key={stageId}>
        <div
          className={`admin-cov-node${count > 0 ? ' covered' : ''}${hasCoveredChild && !count ? ' ancestor' : ''}${isActive ? ' active' : ''}`}
          style={{ paddingLeft: depth * 14 + 10 }}
        >
          {hasChildren ? (
            <button
              type="button"
              className="admin-cov-chevron"
              onClick={(e) => { e.stopPropagation(); toggleCovExpand(stageId); }}
            >
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          ) : (
            <span className="admin-cov-chevron-spacer" />
          )}
          <span className={`admin-cov-dot${count > 0 ? ' active' : ''}`} />
          <span
            className="admin-cov-label"
            onClick={() => setActiveStage(isActive ? null : stageId)}
            role="button"
            tabIndex={0}
          >
            {stage.display_name}
          </span>
          {count > 0 && <span className="admin-cov-badge">{count}</span>}
          <button
            type="button"
            className="admin-cov-add"
            onClick={(e) => { e.stopPropagation(); addRowForStage(stageId); }}
            title={`Add resource for ${stage.display_name}`}
          >
            <Plus size={12} />
          </button>
        </div>
        {isExpanded && hasChildren && stage.child_stage_ids.map((cid) => renderCovNode(cid, depth + 1))}
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="admin-page-header">
          <h1>Pathway Resources</h1>
        </div>
        <div className="admin-loading">Loading resources…</div>
      </>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Pathway Resources</h1>
        <p>Associate leaflets, videos, and links with treatment pathway stages.</p>
      </div>

      <div className="admin-clinician-bar">
        <User size={18} />
        <div>
          <span className="admin-clinician-bar-name">{adminUser?.name || 'Clinician'}</span>
          <span className="admin-clinician-bar-id">{adminUser?.id || ''}</span>
        </div>
      </div>

      <div className="admin-resources-layout">
        {/* Left: Stage coverage panel */}
        <aside className="admin-stage-panel">
          <div className="admin-stage-panel-header">
            <h3>Stage Coverage</h3>
            <span className="admin-stage-panel-stat">
              {totalCovered}/{totalStages}
            </span>
          </div>
          <div className="admin-stage-panel-progress">
            <div
              className="admin-stage-panel-progress-bar"
              style={{ width: `${totalStages > 0 ? (totalCovered / totalStages) * 100 : 0}%` }}
            />
          </div>
          <div className="admin-stage-panel-tree">
            {rootStageIds.map((rid) => renderCovNode(rid, 0))}
          </div>
        </aside>

        {/* Right: Resource cards */}
        <main className="admin-resources-main">
          {/* Filter header */}
          {activeStage && (
            <div className="admin-filter-bar">
              <span>
                Showing resources for <strong>{allStages[activeStage]?.display_name}</strong>
              </span>
              <button type="button" onClick={() => setActiveStage(null)}>
                <X size={14} /> Clear filter
              </button>
            </div>
          )}

          {filteredRows.length === 0 && activeStage && (
            <div className="admin-empty-card">
              <Sparkles size={28} />
              <p>No resources for <strong>{allStages[activeStage]?.display_name}</strong> yet.</p>
              <button type="button" className="admin-btn admin-btn-primary" onClick={() => addRowForStage(activeStage)}>
                <Plus size={16} /> Add first resource
              </button>
            </div>
          )}

          {filteredRows.length === 0 && !activeStage && rows.length <= 1 && !rows[0]?.title && (
            <div className="admin-empty-card">
              <Sparkles size={28} />
              <p>Start by clicking a <strong>stage</strong> on the left, or add a resource below.</p>
              <p className="admin-empty-hint">Tip: Paste a URL and the type will be auto-detected.</p>
            </div>
          )}

          {filteredRows.map((row, idx) => {
            const typeMeta = TYPE_META[row.type];
            const isLast = idx === filteredRows.length - 1;
            const isValid =
              row.title.trim() &&
              row.url.trim() &&
              row.description.trim() &&
              row.intents.length > 0 &&
              row.pathway_stage_ids.length > 0;
            const hasContent = !!(
              row.title ||
              row.url ||
              row.description ||
              row.intents.length > 0 ||
              row.pathway_stage_ids.length > 0
            );
            const showRequired = hasContent && !isValid;
            return (
              <div
                key={row.localId}
                className={`admin-res-card${row._dirty ? ' dirty' : ''}${showRequired ? ' incomplete' : ''}`}
                data-type={row.type}
                ref={isLast ? newCardRef : undefined}
              >
                <div className="admin-res-card-accent" style={{ background: typeMeta.color }} />
                <div className="admin-res-card-body">
                  {/* Row 1: type toggle + title + delete */}
                  <div className="admin-res-card-row1">
                    <div className="admin-type-toggle">
                      {(['pdf', 'video', 'link'] as const).map((t) => {
                        const Icon = TYPE_META[t].icon;
                        return (
                          <button
                            key={t}
                            type="button"
                            className={`admin-type-btn${row.type === t ? ' active' : ''}`}
                            onClick={() => updateRow(row.localId, { type: t })}
                            title={TYPE_META[t].label}
                            style={row.type === t ? { color: TYPE_META[t].color } : undefined}
                          >
                            <Icon size={15} />
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      className={`admin-res-card-title-input${showRequired && !row.title.trim() ? ' admin-field-required' : ''}`}
                      placeholder="Resource title (required)"
                      value={row.title}
                      onChange={(e) => updateRow(row.localId, { title: e.target.value })}
                    />
                    {row._dirty && <span className="admin-dirty-dot" title="Unsaved" />}
                    {rows.length > 1 && (
                      <button
                        type="button"
                        className="admin-resource-remove"
                        onClick={() => removeRow(row.localId)}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Row 2: description + url */}
                  <div className="admin-res-card-row2">
                    <input
                      type="text"
                      className={showRequired && !row.description.trim() ? 'admin-field-required' : ''}
                      placeholder="Description (required)"
                      value={row.description}
                      onChange={(e) => updateRow(row.localId, { description: e.target.value })}
                    />
                    <div className="admin-url-field">
                      <input
                        type="url"
                        className={showRequired && !row.url.trim() ? 'admin-field-required' : ''}
                        placeholder="Paste URL (required) — type is auto-detected"
                        value={row.url}
                        onChange={(e) => handleUrlChange(row.localId, e.target.value)}
                      />
                      {row.url.trim() && (
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-url-preview"
                          title="Open link"
                        >
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Row 3: stages + intents */}
                  <div className="admin-res-card-row3">
                    <div
                      className="admin-rtbl-dropdown-cell"
                      ref={isDropdownOpen(row.localId, 'stages') ? dropdownRef : undefined}
                    >
                      <button
                        type="button"
                        className={`admin-grid-dropdown-trigger${showRequired && row.pathway_stage_ids.length === 0 ? ' admin-field-required' : ''}`}
                        onClick={() => toggleDropdown(row.localId, 'stages')}
                      >
                        <span className={row.pathway_stage_ids.length === 0 ? 'placeholder' : ''}>
                          {stagesSummary(row.pathway_stage_ids)}
                        </span>
                        <ChevronDown size={14} />
                      </button>
                      {isDropdownOpen(row.localId, 'stages') && (
                        <div className="admin-grid-dropdown-panel">
                          <StageTreeSelect
                            selectedStageIds={row.pathway_stage_ids}
                            onChange={(ids) => updateRow(row.localId, { pathway_stage_ids: ids })}
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className="admin-rtbl-dropdown-cell"
                      ref={isDropdownOpen(row.localId, 'intents') ? dropdownRef : undefined}
                    >
                      <button
                        type="button"
                        className={`admin-grid-dropdown-trigger${showRequired && row.intents.length === 0 ? ' admin-field-required' : ''}`}
                        onClick={() => toggleDropdown(row.localId, 'intents')}
                      >
                        <span className={row.intents.length === 0 ? 'placeholder' : ''}>
                          {row.intents.length === 0
                            ? 'Select intents (required)…'
                            : row.intents
                                .slice(0, 2)
                                .map((i) => INTENT_OPTIONS.find((o) => o.value === i)?.label || i)
                                .join(', ') + (row.intents.length > 2 ? ` +${row.intents.length - 2}` : '')}
                        </span>
                        <ChevronDown size={14} />
                      </button>
                      {isDropdownOpen(row.localId, 'intents') && (
                        <div className="admin-grid-dropdown-panel admin-intent-dropdown">
                          {INTENT_OPTIONS.map((opt) => (
                            <label key={opt.value} className="admin-intent-dropdown-item">
                              <input
                                type="checkbox"
                                checked={row.intents.includes(opt.value)}
                                onChange={() => toggleIntent(row.localId, opt.value)}
                              />
                              <span>{opt.label}</span>
                              <span className="admin-intent-dropdown-cat">{opt.category}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Footer */}
          <div className="admin-grid-footer">
            <button type="button" className="admin-btn admin-btn-secondary" onClick={addRow}>
              <Plus size={16} /> Add resource
            </button>
            <div className="admin-grid-footer-right">
              {hasDirty && <span className="admin-unsaved-label">Unsaved changes</span>}
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                disabled={saving || !rows.some((r) => r.title.trim() && r.url.trim() && r.description.trim() && r.intents.length > 0)}
                onClick={handleSaveAll}
              >
                <Save size={16} /> {saving ? 'Saving…' : 'Save All'}
              </button>
            </div>
          </div>
        </main>
      </div>

      {saveMessage && (
        <div className={`admin-save-toast${saveToastError ? ' admin-save-toast--error' : ''}`}>
          {saveMessage}
        </div>
      )}
    </>
  );
}
