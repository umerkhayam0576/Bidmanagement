import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Calendar,
  CheckSquare,
  Square,
  ListTodo,
  DollarSign
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { Project, Task, TaskStatus, TaskPriority } from '../../types';

export const ProjectsModule: React.FC = () => {
  const {
    filteredProjects,
    filteredTasks,
    filteredClients,
    activeBusiness,
    formatCurrency,
    addProject,
    toggleMilestone,
    addTask,
    updateTaskStatus
  } = useBusiness();

  const [activeView, setActiveView] = useState<'projects' | 'tasks'>('projects');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New Project Form
  const [prjTitle, setPrjTitle] = useState('');
  const [prjClientId, setPrjClientId] = useState('');
  const [prjDescription, setPrjDescription] = useState('');
  const [prjBudget, setPrjBudget] = useState('');
  const [prjLeader, setPrjLeader] = useState('Omar Refay');
  const [prjEndDate, setPrjEndDate] = useState('');
  const [prjMilestones, setPrjMilestones] = useState<string[]>(['Phase 1 Kickoff & Architecture', 'Phase 2 Implementation']);

  // New Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPrjId, setTaskPrjId] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [taskAssignee, setTaskAssignee] = useState('Omar Refay');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  const taskColumns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'TODO', label: 'To Do', color: 'border-slate-700 text-slate-300' },
    { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500/40 text-blue-300' },
    { status: 'REVIEW', label: 'In Review', color: 'border-amber-500/40 text-amber-300' },
    { status: 'DONE', label: 'Completed', color: 'border-emerald-500/40 text-emerald-300' }
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const client = filteredClients.find((c) => c.id === prjClientId);
    if (!client || !prjTitle) return;

    addProject({
      businessId: activeBusiness?.id || 'biz_apex',
      clientId: client.id,
      clientName: client.company,
      title: prjTitle,
      description: prjDescription,
      budget: parseFloat(prjBudget) || 0,
      status: 'IN_PROGRESS',
      startDate: new Date().toISOString().split('T')[0],
      endDate: prjEndDate || '2025-06-30',
      leaderName: prjLeader,
      milestones: prjMilestones.map((m, idx) => ({
        id: `ms_${Date.now()}_${idx}`,
        title: m,
        done: false,
        dueDate: prjEndDate || '2025-06-30'
      }))
    });

    setPrjTitle('');
    setPrjDescription('');
    setPrjBudget('');
    setShowAddProjectModal(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    const prj = filteredProjects.find((p) => p.id === taskPrjId);

    addTask({
      businessId: activeBusiness?.id || 'biz_apex',
      projectId: prj?.id,
      projectTitle: prj?.title,
      title: taskTitle,
      description: taskDesc,
      status: 'TODO',
      priority: taskPriority,
      assignee: taskAssignee,
      dueDate: taskDueDate || '2025-04-15'
    });

    setTaskTitle('');
    setTaskDesc('');
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-widest text-emerald-400">
            <FolderKanban className="w-4 h-4" />
            <span>Execution & Task Operations</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Projects & Workflows</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track client project deliverables, budget utilization, milestones, and Kanban tasks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveView('projects')}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
            activeView === 'projects'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Active Projects ({filteredProjects.length})</span>
        </button>
        <button
          onClick={() => setActiveView('tasks')}
          className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
            activeView === 'tasks'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>Kanban Tasks ({filteredTasks.length})</span>
        </button>
      </div>

      {/* PROJECTS VIEW */}
      {activeView === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((prj) => (
            <div
              key={prj.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{prj.title}</h3>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      {prj.clientName}
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded font-bold">
                    {(prj.status || '').replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{prj.description}</p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Milestone Progress</span>
                    <span className="font-mono font-bold text-white">{prj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${prj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones checklist */}
                <div className="mt-4 space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Milestones ({(prj.milestones || []).filter((m) => m.done).length}/{(prj.milestones || []).length})
                  </div>
                  <div className="space-y-1.5">
                    {(prj.milestones || []).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => toggleMilestone(prj.id, m.id)}
                        className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white transition-colors"
                      >
                        {m.done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className={m.done ? 'line-through text-slate-500' : ''}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Financial & Deadline Footer */}
              <div className="pt-3 border-t border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Budget:</span>
                  <span className="font-mono text-white font-bold">{formatCurrency(prj.budget)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Lead:</span>
                  <span className="text-slate-300">{prj.leaderName}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Target Completion:</span>
                  <span className="font-mono text-slate-400">{prj.endDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KANBAN TASKS VIEW */}
      {activeView === 'tasks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[500px]">
          {taskColumns.map((col) => {
            const tasksInCol = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                      {tasksInCol.length}
                    </span>
                  </div>

                  <div className="space-y-3 mt-3">
                    {tasksInCol.map((task) => {
                      const priorityColor =
                        task.priority === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-300'
                          : task.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-300';

                      return (
                        <div
                          key={task.id}
                          className="bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 rounded-xl p-3.5 space-y-2 shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-white leading-tight">
                              {task.title}
                            </span>
                            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${priorityColor}`}>
                              {task.priority}
                            </span>
                          </div>

                          {task.projectTitle && (
                            <div className="text-[10px] text-emerald-400 font-medium">
                              {task.projectTitle}
                            </div>
                          )}

                          {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                            <div className="flex items-center gap-1 text-slate-300">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>{task.assignee}</span>
                            </div>
                            <div className="font-mono text-slate-400">{task.dueDate}</div>
                          </div>

                          {/* Stage shift selector */}
                          <div className="pt-1">
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                              className="w-full bg-slate-900 border border-slate-750 rounded text-[10px] text-slate-300 py-1 px-1.5 focus:outline-none"
                            >
                              {taskColumns.map((c) => (
                                <option key={c.status} value={c.status}>
                                  Move to: {c.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}

                    {tasksInCol.length === 0 && (
                      <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        No tasks in this lane
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Create Project */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Initialize Client Project
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Cloud Architecture Modernization"
                  value={prjTitle}
                  onChange={(e) => setPrjTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Client Account</label>
                  <select
                    required
                    value={prjClientId}
                    onChange={(e) => setPrjClientId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select a Client</option>
                    {filteredClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Budget ({activeBusiness?.currency || 'USD'})</label>
                  <input
                    type="number"
                    required
                    placeholder="85000"
                    value={prjBudget}
                    onChange={(e) => setPrjBudget(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Project Lead</label>
                  <input
                    type="text"
                    value={prjLeader}
                    onChange={(e) => setPrjLeader(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target End Date</label>
                  <input
                    type="date"
                    value={prjEndDate}
                    onChange={(e) => setPrjEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Scope Description</label>
                <textarea
                  rows={2}
                  value={prjDescription}
                  onChange={(e) => setPrjDescription(e.target.value)}
                  placeholder="Key technical deliverables, architectural scope..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create Task */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Add Operational Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Kubernetes ingress security policies"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Related Project</label>
                  <select
                    value={taskPrjId}
                    onChange={(e) => setTaskPrjId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">General Task (No Project)</option>
                    {filteredProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Priority Level</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assignee</label>
                  <input
                    type="text"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Instructions / Description</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task steps and acceptance criteria..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
