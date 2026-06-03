/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScheduleBlock } from './types';
import { PlusCircle, Play, Trash2, Clock, CalendarHeart, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';

export default function App() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([
    {
      id: crypto.randomUUID(),
      task: 'Morning Standup & Triage',
      plannedDuration: '30m',
      actualDuration: '45m',
      notes: 'Standup went long discussing the new API.'
    },
    {
      id: crypto.randomUUID(),
      task: 'Deep Work: Feature XYZ',
      plannedDuration: '2h',
      actualDuration: '1h 15m',
      notes: 'Interrupted by an urgent production bug.'
    }
  ]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addBlock = () => {
    setBlocks([
      ...blocks,
      { id: crypto.randomUUID(), task: '', plannedDuration: '', actualDuration: '', notes: '' }
    ]);
  };

  const updateBlock = (id: string, field: keyof ScheduleBlock, value: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const analyzeSchedule = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedules: blocks }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (e: any) {
      alert(`Error analyzing schedule: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0 shadow-sm z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
            <CalendarHeart className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">Schedule Reflect <span className="text-slate-400 font-normal">/ Time Auditor</span></h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">Daily Reflection</p>
          <p className="text-xs text-slate-500">Plan vs Reality</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto p-6 gap-6 w-full max-w-[1400px] mx-auto">
        <div className="flex-1 flex flex-col gap-6">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Daily Time Tracker
              </h3>
            </div>
            
            <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 mb-2 px-2 hidden md:grid">
                <div className="col-span-4">Task Focus</div>
                <div className="col-span-2">Planned Time</div>
                <div className="col-span-2">Actual Time</div>
                <div className="col-span-3">Friction & Notes</div>
                <div className="col-span-1 text-center">Action</div>
              </div>
              
              {blocks.map(block => (
                <div key={block.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none border border-slate-200 md:border-transparent">
                  <div className="col-span-1 md:col-span-4">
                    <label className="text-xs font-medium text-slate-500 md:hidden mb-1 block">Task Focus</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Build API Endpoint"
                      value={block.task}
                      onChange={(e) => updateBlock(block.id, 'task', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-medium text-slate-500 md:hidden mb-1 block">Planned Time</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="2h"
                      value={block.plannedDuration}
                      onChange={(e) => updateBlock(block.id, 'plannedDuration', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-medium text-slate-500 md:hidden mb-1 block">Actual Time</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="1h 30m"
                      value={block.actualDuration}
                      onChange={(e) => updateBlock(block.id, 'actualDuration', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <label className="text-xs font-medium text-slate-500 md:hidden mb-1 block">Friction & Notes</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Interruptions, context switching..."
                      value={block.notes}
                      onChange={(e) => updateBlock(block.id, 'notes', e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center pt-2 md:pt-1">
                    <button 
                      onClick={() => removeBlock(block.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove block"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
              <button 
                onClick={addBlock}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors mb-4 sm:mb-0"
              >
                <PlusCircle className="w-5 h-5" />
                Add Time Block
              </button>
              
              <button 
                onClick={analyzeSchedule}
                disabled={isLoading || blocks.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 py-2.5 rounded-md font-medium text-sm transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                {isLoading ? 'Analyzing...' : 'Generate Reflection'}
              </button>
            </div>
          </div>
        </section>
        </div>

        {analysis && (
          <div className="w-full lg:w-[45%] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-indigo-900 text-white rounded-xl shadow-md border border-indigo-800 flex flex-col overflow-hidden max-h-[calc(100vh-8rem)] sticky top-0">
              <div className="px-6 py-4 border-b border-indigo-800/50 bg-indigo-900/50 flex shrink-0">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-50 flex items-center gap-2">
                   <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                   Optimization Strategies
                </h3>
              </div>
              <div className="p-6 prose prose-invert prose-sm max-w-none prose-headings:font-bold prose-headings:text-indigo-200 prose-headings:uppercase prose-a:text-indigo-400 prose-p:text-indigo-50 prose-p:leading-relaxed prose-li:text-indigo-50 overflow-y-auto">
                <div className="markdown-body">
                  <Markdown>{analysis}</Markdown>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="h-12 bg-white border-t border-slate-200 px-8 flex items-center justify-between text-xs text-slate-500 shrink-0 mt-auto">
        <div className="flex gap-6">
          <span>Compare your planned schedule against reality, and get AI insights for tomorrow.</span>
        </div>
      </footer>
    </div>
  );
}

