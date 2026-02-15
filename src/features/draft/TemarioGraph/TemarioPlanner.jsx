/**
 * TemarioPlanner — Usability-focused temario view for draft testing.
 * Prioritizes: next recommended tema, unlock clarity, and quick practice actions.
 */

import { useMemo, useState } from 'react';
import { AlertTriangle, Lock, Play, Search, Target } from 'lucide-react';
import { getTemarioNodes, BLOQUES, STATUS_COLORS } from './temarioData';
import { getRecommendedOrder, getUnlockMessage, isTopicUnlocked } from '../../../data/topicPrerequisites';

const STATUS_LABELS = {
  dominado: 'Dominado',
  avanzando: 'Avanzando',
  progreso: 'En progreso',
  nuevo: 'Nuevo',
  riesgo: 'En riesgo'
};

const STATUS_PRIORITY = {
  riesgo: 0,
  progreso: 1,
  avanzando: 2,
  nuevo: 3,
  dominado: 4
};

const MODE_LABELS = {
  all: 'Todos',
  recommended: 'Recomendados',
  risk: 'En riesgo',
  unlocked: 'Desbloqueados',
  locked: 'Bloqueados'
};

function getStatusBadge(status) {
  return STATUS_COLORS[status] || STATUS_COLORS.nuevo;
}

function getPracticeTopicPayload(topic) {
  if (topic.topicData) {
    return {
      id: topic.topicData.id ?? topic.id,
      number: topic.topicData.number ?? topic.id,
      name: topic.topicData.name ?? topic.name,
      code: topic.topicData.code ?? `T${topic.id}`
    };
  }

  return {
    id: topic.id,
    number: topic.id,
    name: topic.name,
    code: `T${topic.id}`
  };
}

function TopicRow({ topic, onStartTopic }) {
  const canPractice = topic.unlocked && topic.questionCount > 0;
  const statusColor = getStatusBadge(topic.status);
  const statusLabel = STATUS_LABELS[topic.status] || topic.status;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: topic.bloqueColor }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">T{topic.id}</span>
            {topic.recommendedRank && (
              <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[11px] font-semibold text-brand-200">
                #{topic.recommendedRank} recomendado
              </span>
            )}
          </div>

          <p className="mt-0.5 text-sm text-gray-100">{topic.name}</p>
          <p className="mt-0.5 text-xs text-gray-400">{topic.bloqueLabel}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ color: statusColor, backgroundColor: `${statusColor}22` }}
            >
              {statusLabel}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                topic.unlocked ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'
              }`}
            >
              {topic.unlocked ? 'Desbloqueado' : 'Bloqueado'}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-gray-300">
            <span>Precisión: {Math.round(topic.accuracy)}%</span>
            <span>Sesiones: {topic.sessions}</span>
            <span>Preguntas: {topic.questionCount}</span>
          </div>

          {!topic.unlocked && topic.unlockMessage && (
            <div className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-100">
              <Lock className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{topic.unlockMessage}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => canPractice && onStartTopic?.(getPracticeTopicPayload(topic))}
          disabled={!canPractice}
          className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
            canPractice
              ? 'bg-brand-500 text-white hover:bg-brand-400'
              : 'cursor-not-allowed bg-white/10 text-gray-500'
          }`}
          title={canPractice ? 'Practicar este tema' : 'Tema no disponible para práctica'}
        >
          <span className="inline-flex items-center gap-1">
            <Play className="h-3.5 w-3.5" />
            Practicar
          </span>
        </button>
      </div>
    </div>
  );
}

export default function TemarioPlanner({
  userProgress = {},
  questionCounts = {},
  topicsByNumber = {},
  onStartTopic
}) {
  const [search, setSearch] = useState('');
  const [bloqueFilter, setBloqueFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');

  const topics = useMemo(() => {
    const recommendedOrder = getRecommendedOrder(userProgress);
    const recommendedRank = new Map(recommendedOrder.map((tema, index) => [tema, index + 1]));

    return getTemarioNodes(userProgress, questionCounts).map((node) => {
      const unlocked = isTopicUnlocked(node.id, userProgress);
      return {
        ...node,
        unlocked,
        unlockMessage: unlocked ? null : getUnlockMessage(node.id, userProgress),
        recommendedRank: recommendedRank.get(node.id) || null,
        topicData: topicsByNumber[node.id] || null
      };
    });
  }, [questionCounts, topicsByNumber, userProgress]);

  const nextTopic = useMemo(() => {
    const recommended = topics.find((topic) => topic.recommendedRank === 1);
    if (recommended) return recommended;

    return topics.find((topic) => topic.unlocked && topic.status !== 'dominado') || null;
  }, [topics]);

  const summary = useMemo(() => {
    const unlocked = topics.filter((topic) => topic.unlocked).length;
    const locked = topics.length - unlocked;
    const risk = topics.filter((topic) => topic.status === 'riesgo').length;
    const mastered = topics.filter((topic) => topic.status === 'dominado').length;
    return { unlocked, locked, risk, mastered };
  }, [topics]);

  const filteredTopics = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return topics
      .filter((topic) => {
        if (bloqueFilter !== 'all' && topic.bloque !== bloqueFilter) return false;

        if (modeFilter === 'recommended' && !topic.recommendedRank) return false;
        if (modeFilter === 'risk' && topic.status !== 'riesgo') return false;
        if (modeFilter === 'locked' && topic.unlocked) return false;
        if (modeFilter === 'unlocked' && !topic.unlocked) return false;

        if (!normalizedSearch) return true;
        const haystack = `${topic.name} ${topic.shortName} ${topic.id}`.toLowerCase();
        return haystack.includes(normalizedSearch);
      })
      .sort((a, b) => {
        const aRank = a.recommendedRank || Number.POSITIVE_INFINITY;
        const bRank = b.recommendedRank || Number.POSITIVE_INFINITY;
        if (aRank !== bRank) return aRank - bRank;

        if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;

        const aStatus = STATUS_PRIORITY[a.status] ?? 99;
        const bStatus = STATUS_PRIORITY[b.status] ?? 99;
        if (aStatus !== bStatus) return aStatus - bStatus;

        return a.id - b.id;
      });
  }, [bloqueFilter, modeFilter, search, topics]);

  return (
    <div className="flex h-full w-full flex-col bg-gray-950 text-gray-100">
      <div className="border-b border-white/10 bg-gradient-to-r from-brand-950/50 to-slate-900/30 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Planner de Temario (Propuesta)</h3>
            <p className="text-xs text-gray-400">Ruta recomendada + desbloqueos + acciones rápidas</p>
          </div>
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-gray-300">28 temas C2</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-2 py-1.5">
            <p className="text-gray-400">Desbloqueados</p>
            <p className="font-semibold text-emerald-300">{summary.unlocked}</p>
          </div>
          <div className="rounded-lg bg-white/5 px-2 py-1.5">
            <p className="text-gray-400">Bloqueados</p>
            <p className="font-semibold text-amber-300">{summary.locked}</p>
          </div>
          <div className="rounded-lg bg-white/5 px-2 py-1.5">
            <p className="text-gray-400">En riesgo</p>
            <p className="font-semibold text-rose-300">{summary.risk}</p>
          </div>
          <div className="rounded-lg bg-white/5 px-2 py-1.5">
            <p className="text-gray-400">Dominados</p>
            <p className="font-semibold text-green-300">{summary.mastered}</p>
          </div>
        </div>

        {nextTopic && (
          <div className="mt-3 rounded-xl border border-brand-400/30 bg-brand-500/10 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1 text-xs font-semibold text-brand-200">
                  <Target className="h-3.5 w-3.5" />
                  Siguiente mejor paso
                </p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  Tema {nextTopic.id}: {nextTopic.shortName}
                </p>
                <p className="text-xs text-gray-300">
                  {nextTopic.unlocked
                    ? `${Math.round(nextTopic.accuracy)}% precisión · ${nextTopic.sessions} sesiones`
                    : nextTopic.unlockMessage}
                </p>
              </div>
              <button
                type="button"
                disabled={!nextTopic.unlocked || nextTopic.questionCount === 0}
                onClick={() => nextTopic.unlocked && onStartTopic?.(getPracticeTopicPayload(nextTopic))}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  nextTopic.unlocked && nextTopic.questionCount > 0
                    ? 'bg-brand-500 text-white hover:bg-brand-400'
                    : 'cursor-not-allowed bg-white/10 text-gray-500'
                }`}
              >
                Practicar
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar tema, número o nombre..."
              className="w-full rounded-lg border border-white/15 bg-black/30 py-2 pl-7 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-500 focus:border-brand-400"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={bloqueFilter}
              onChange={(event) => setBloqueFilter(event.target.value)}
              className="rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-xs text-gray-200 outline-none focus:border-brand-400"
            >
              <option value="all">Bloques</option>
              {Object.entries(BLOQUES).map(([key, bloque]) => (
                <option key={key} value={key}>
                  {bloque.name}
                </option>
              ))}
            </select>

            <select
              value={modeFilter}
              onChange={(event) => setModeFilter(event.target.value)}
              className="rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-xs text-gray-200 outline-none focus:border-brand-400"
            >
              {Object.entries(MODE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {filteredTopics.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-gray-400">
            No hay temas para este filtro.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTopics.map((topic) => (
              <TopicRow key={topic.id} topic={topic} onStartTopic={onStartTopic} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-black/20 px-3 py-2 text-[11px] text-gray-400">
        <span className="inline-flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Propuesta de usabilidad: priorización, desbloqueo explícito y acceso directo a práctica.
        </span>
      </div>
    </div>
  );
}
