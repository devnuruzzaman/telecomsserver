import React, { useState } from 'react';
import { ROADMAP_PHASES } from '../data';
import { RoadmapPhase, RoadmapTask } from '../types';
import { 
  Calendar, CheckCircle2, Circle, Clock, GitPullRequest, 
  Layers, ChevronRight, Play, Check, KanbanSquare
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Roadmap() {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(1);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, 'completed' | 'in-progress' | 'planned'>>({});

  const activePhase = ROADMAP_PHASES.find(p => p.phase === activePhaseIndex) || ROADMAP_PHASES[0];

  const handleToggleTask = (taskId: string) => {
    setTaskStatuses(prev => {
      const current = prev[taskId] || 'planned';
      let next: 'completed' | 'in-progress' | 'planned' = 'planned';
      if (current === 'planned') next = 'in-progress';
      else if (current === 'in-progress') next = 'completed';
      else next = 'planned';
      return { ...prev, [taskId]: next };
    });
  };

  const getTaskStatusLabel = (taskId: string, defaultStatus: string) => {
    const status = taskStatuses[taskId] || defaultStatus;
    if (status === 'completed') return { text: 'Completed', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60' };
    if (status === 'in-progress') return { text: 'In Progress', color: 'text-indigo-400 bg-indigo-950/40 border-indigo-900/60' };
    return { text: 'Planned', color: 'text-slate-400 bg-slate-900/40 border-slate-800' };
  };

  return (
    <div className="space-y-8" id="roadmap-tab-content">
      {/* Overview Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white font-display">SaaS Development Roadmap</h2>
          </div>
          <p className="text-sm text-slate-400">
            A granular, 10-week execution timeline detailing critical sprints, database migrations, and release milestones.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-500">
          <KanbanSquare className="h-4 w-4 text-indigo-400" />
          <span>Interactive Progress Mode</span>
        </div>
      </div>

      {/* Visual Gantt Timeline Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {ROADMAP_PHASES.map((p) => {
          const isActive = p.phase === activePhaseIndex;
          return (
            <button
              key={p.phase}
              onClick={() => setActivePhaseIndex(p.phase)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-950/40 text-indigo-400 border-indigo-800/80 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                  : 'bg-slate-900/20 text-slate-400 border-slate-800/80 hover:bg-slate-900/40'
              }`}
            >
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Phase {p.phase}</p>
                <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{p.title.split(' ')[0]}</h4>
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-850">
                <span>{p.duration}</span>
                {isActive ? <Play className="h-3 w-3 text-indigo-400 animate-pulse" /> : <ChevronRight className="h-3 w-3" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Phase Summary */}
        <div className="lg:col-span-1 bg-slate-900/30 border border-slate-800/80 p-6 rounded-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-indigo-400">Week Duration: {activePhase.duration}</span>
              <h3 className="text-2xl font-bold text-white font-display mt-2">Phase {activePhase.phase}: {activePhase.title}</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{activePhase.subtitle}</p>
            </div>

            <div className="border-t border-slate-800/80 pt-4 space-y-3">
              <span className="text-xs font-mono text-slate-500 uppercase">Interactive Instructions</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click on the status badges of the tasks to toggle states between <span className="text-slate-300 font-mono">Planned</span>, <span className="text-indigo-400 font-mono">In Progress</span>, and <span className="text-emerald-400 font-mono">Completed</span>.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 font-mono text-xs text-slate-500 flex items-center justify-between">
            <span>Milestone Type: Core Release</span>
            <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-2 space-y-6">
          {activePhase.tasks.map((task) => {
            const statusConfig = getTaskStatusLabel(task.id, task.status);
            return (
              <div 
                key={task.id}
                className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 md:p-6 space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-indigo-400">{task.id}</span>
                    <h4 className="text-lg font-bold text-white font-display">{task.title}</h4>
                  </div>
                  
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${statusConfig.color}`}
                  >
                    {statusConfig.text}
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">{task.description}</p>

                {/* Checkpoint Guidelines */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Technical Implementation Checkpoints</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {task.technicalDetails.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2 bg-slate-950/40 border border-slate-850 p-3 rounded-lg">
                        <span className="p-0.5 rounded-full bg-indigo-950 border border-indigo-900 mt-0.5">
                          <Check className="h-3.5 w-3.5 text-indigo-400" />
                        </span>
                        <p className="text-xs text-slate-400 leading-normal">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
