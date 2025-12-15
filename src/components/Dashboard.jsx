import React, { useState, useEffect } from 'react';
// --- MUI IMPORTS ---
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs';

export default function Dashboard({ user, onLogout, onNavigate }) {
  // --- STATE MANAGEMENT ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('listr_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('listr_activity');
    return saved ? JSON.parse(saved) : [];
  });

  // Inputs
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(null); 

  // Modals & Widgets
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isThoughtsOpen, setIsThoughtsOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [thoughtText, setThoughtText] = useState('');
  
  // Actions State
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  
  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('listr_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('listr_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  // --- HELPERS ---
  const addActivity = (action) => {
    const newLog = { action, time: new Date().toISOString() };
    setActivityLog(prev => [newLog, ...prev].slice(0, 50));
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr.includes('am') || timeStr.includes('pm')) return timeStr;
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'pm' : 'am'; 
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  // --- ACTIONS ---
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const formattedTime = newTaskTime ? newTaskTime.format('h:mm a') : '';

    const task = {
      id: Date.now(),
      content: newTask,
      time: formattedTime,
      completed: false,
      comments: ''
    };
    setTasks([task, ...tasks]);
    addActivity(`Added task: "${task.content}"`);
    setNewTask('');
    setNewTaskTime(null);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        addActivity(`${!t.completed ? 'Completed' : 'Unchecked'}: "${t.content}"`);
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const saveEdit = () => {
    if (!taskToEdit) return;
    setTasks(tasks.map(t => t.id === taskToEdit.id ? taskToEdit : t));
    addActivity(`Updated task: "${taskToEdit.content}"`);
    setTaskToEdit(null);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      const task = tasks.find(t => t.id === taskToDelete);
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      addActivity(`Deleted task: "${task?.content}"`);
      setTaskToDelete(null);
    }
  };

  const saveThought = async () => {
    if (!thoughtText.trim()) return;
    const FORM_ENDPOINT = "https://formspree.io/f/YOUR_UNIQUE_ID_HERE"; 

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: thoughtText, user: user.name })
      });
      if (response.ok) {
        addActivity(`Sent feedback`);
        setThoughtText('');
        setIsThoughtsOpen(false);
        alert("Thanks! Feedback sent.");
      } else {
        alert("Problem sending feedback.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending feedback.");
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-30 border-b border-neutral-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg shadow-black/20 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                </div>
                <span className="font-bold text-xl tracking-tight">Listr</span>
            </div>
            <div className="flex items-center gap-6">
                <button onClick={() => setIsReportOpen(true)} className="text-gray-400 hover:text-white text-sm font-medium transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    Report
                </button>
                <button onClick={onLogout} className="text-gray-400 hover:text-red-400 text-sm font-medium transition flex items-center gap-2">
                    Logout
                </button>
            </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-32 pb-20 flex flex-col items-center">
        
        {/* Title */}
        <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-3 tracking-tight">Welcome, {user.name}!</h1>
            <p className="text-gray-500 text-lg">What is your main focus for today?</p>
        </div>

        {/* Input Row */}
        <div className="w-full flex gap-3 mb-12">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Enter a task" 
              className="flex-1 bg-white text-black rounded-xl px-6 py-4 text-lg outline-none focus:ring-4 focus:ring-purple-900/50 placeholder-gray-400 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />
            
            {/* BUTTON TO TRIGGER TIME MODAL */}
            <button 
              onClick={() => setIsTimePickerOpen(true)}
              className="bg-neutral-900 text-white border border-neutral-800 rounded-xl px-4 py-4 w-32 text-lg font-medium hover:border-[#6600FF] transition-colors flex items-center justify-center gap-2"
            >
               {newTaskTime ? (
                 <span className="text-[#6600FF]">{newTaskTime.format('h:mm A')}</span>
               ) : (
                 <span className="text-gray-400">Set Time</span>
               )}
            </button>

            <button 
              onClick={handleAddTask}
              className="bg-[#6200ea] hover:bg-[#5000c2] text-white font-bold rounded-xl px-8 py-4 text-lg transition-all shadow-[0_0_20px_rgba(98,0,234,0.4)] hover:shadow-[0_0_30px_rgba(98,0,234,0.6)] active:scale-95"
            >
              Add
            </button>
        </div>

        {/* --- TASK LIST --- */}
        <div className="w-full max-h-[45vh] overflow-y-auto no-scrollbar pr-2">
            {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-neutral-900 rounded-3xl bg-neutral-950/50">
                <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No tasks yet</h3>
                <p className="text-gray-500">Add your first task to get started</p>
            </div>
            ) : (
            tasks.map(task => (
                <div key={task.id} className="group flex items-start gap-4 py-6 border-b border-neutral-800 hover:border-neutral-700 transition-colors animate-fade-in">
                
                <button onClick={() => toggleTask(task.id)} className="mt-1 flex-shrink-0 transition-transform active:scale-95">
                    {task.completed ? (
                    <svg className="w-6 h-6 text-[#6200ea]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-neutral-700 hover:border-gray-500 transition-colors"></div>
                    )}
                </button>
                
                <div className="flex-1 min-w-0">
                    <span className={`text-xl font-light block leading-tight ${task.completed ? 'line-through text-gray-600' : 'text-white'}`}>
                        {task.content}
                    </span>

                    {task.comments && (
                        <button 
                            onClick={() => setActiveNote(task)}
                            className="mt-2 text-sm text-[#6200ea] hover:text-[#7c4dff] font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                            View Note
                        </button>
                    )}
                </div>

                {task.time && (
                    <span className="text-gray-500 font-mono text-sm mt-1.5 whitespace-nowrap">
                        {task.time}
                    </span>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setTaskToEdit(task)} className="p-2 text-neutral-600 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    </button>
                    <button onClick={() => setTaskToDelete(task.id)} className="p-2 text-neutral-600 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                </div>
            ))
            )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-neutral-900 py-8 mt-auto bg-black">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2025 Listr App. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">Privacy</button>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition">Terms</button>
            </div>
        </div>
      </footer>

      {/* --- STATIC TIME PICKER MODAL (CUSTOM COLOR #6600FF) --- */}
      {isTimePickerOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsTimePickerOpen(false)}>
            <div className="bg-neutral-900 rounded-3xl p-6 overflow-hidden shadow-2xl border border-neutral-800" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-bold text-center mb-4 text-xl">Pick a Time</h3>
                <div className="rounded-2xl overflow-hidden bg-[#171717]">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticTimePicker
                            orientation="landscape"
                            value={newTaskTime || dayjs()}
                            onChange={(newValue) => setNewTaskTime(newValue)}
                            onAccept={() => setIsTimePickerOpen(false)}
                            onClose={() => setIsTimePickerOpen(false)}
                            slotProps={{
                                actionBar: { actions: ['cancel', 'accept'] },
                                toolbar: { hidden: false } 
                            }}
                            sx={{
                                bgcolor: '#171717',
                                color: 'white',
                                '& .MuiPickersLayout-contentWrapper': { bgcolor: '#171717' },
                                '& .MuiTimeClock-root': { bgcolor: '#171717' },
                                '& .MuiClock-clock': { bgcolor: '#262626' },
                                '& .MuiClock-pin': { bgcolor: '#6600FF' }, // Replaced #a855f7
                                '& .MuiClockPointer-root': { bgcolor: '#6600FF' }, // Replaced #a855f7
                                '& .MuiClockPointer-thumb': { border: '16px solid #6600FF', bgcolor: 'white' }, // Replaced #a855f7
                                '& .MuiClockNumber-root': { color: 'white' },
                                '& .MuiTypography-root': { color: 'white' },
                                '& .MuiPickersToolbar-root': { color: 'white', '& .MuiTypography-root': { color: '#6600FF' } }, // Replaced #a855f7
                                '& .MuiDialogActions-root': { bgcolor: '#171717', '& button': { color: '#6600FF' } } // Replaced #a855f7
                            }}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        </div>
      )}

      {/* --- THOUGHTS WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
            onClick={() => setIsThoughtsOpen(!isThoughtsOpen)} 
            className="w-14 h-14 bg-neutral-900 hover:bg-neutral-800 rounded-full shadow-lg shadow-black/50 border border-neutral-800 flex items-center justify-center text-white transition-all hover:scale-105"
        >
            {isThoughtsOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            )}
        </button>

        {isThoughtsOpen && (
            <div className="absolute bottom-16 right-0 w-80 bg-neutral-900 rounded-2xl shadow-2xl shadow-black/50 border border-neutral-800 overflow-hidden mb-2 animate-fade-in-up">
                <div className="p-4 border-b border-neutral-800 bg-neutral-900">
                    <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
                        <span>💬</span> Help us improve
                    </h3>
                </div>
                <div className="p-4">
                    <textarea 
                        value={thoughtText}
                        onChange={(e) => setThoughtText(e.target.value)}
                        placeholder="Have a feature request?" 
                        className="w-full h-24 px-3 py-2 bg-black text-white rounded-lg border border-neutral-800 focus:outline-none focus:border-purple-500 resize-none placeholder-gray-600 text-sm"
                    ></textarea>
                    <button 
                        onClick={saveThought} 
                        className="w-full mt-3 py-2.5 bg-[#6200ea] hover:bg-[#5000c2] text-white rounded-lg font-medium text-sm transition-all"
                    >
                        Send Feedback
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* --- NOTE VIEW MODAL --- */}
      {activeNote && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveNote(null)}>
             <div className="bg-neutral-900 rounded-2xl p-6 max-w-md w-full border border-neutral-800 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Task Note</h3>
                    <button onClick={() => setActiveNote(null)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                <div className="bg-black/50 rounded-xl p-4 border border-neutral-800 text-gray-300 leading-relaxed max-h-60 overflow-y-auto no-scrollbar">
                    {activeNote.comments}
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={() => setActiveNote(null)} className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition">Close</button>
                </div>
            </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {taskToEdit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setTaskToEdit(null)}>
             <div className="bg-neutral-900 rounded-2xl p-6 max-w-md w-full border border-neutral-800 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Edit Task</h3>
                    <button onClick={() => setTaskToEdit(null)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Task Name</label>
                        <input 
                            type="text" 
                            value={taskToEdit.content} 
                            onChange={(e) => setTaskToEdit({...taskToEdit, content: e.target.value})}
                            className="w-full px-4 py-3 bg-black text-white rounded-xl border border-neutral-800 focus:outline-none focus:border-purple-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Time</label>
                        <input 
                            type="text" 
                            value={taskToEdit.time || ''} 
                            onChange={(e) => setTaskToEdit({...taskToEdit, time: e.target.value})}
                            placeholder="e.g. 2:30 pm"
                            className="w-full px-4 py-3 bg-black text-white rounded-xl border border-neutral-800 focus:outline-none focus:border-purple-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Comments / Notes</label>
                        <textarea 
                            value={taskToEdit.comments || ''} 
                            onChange={(e) => setTaskToEdit({...taskToEdit, comments: e.target.value})}
                            placeholder="Add details..." 
                            className="w-full h-24 px-4 py-3 bg-black text-white rounded-xl border border-neutral-800 focus:outline-none focus:border-purple-500 resize-none placeholder-gray-600"
                        ></textarea>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={() => setTaskToEdit(null)} className="flex-1 py-3 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 font-medium transition">Cancel</button>
                    <button onClick={saveEdit} className="flex-1 py-3 bg-[#6200ea] text-white rounded-xl hover:bg-[#5000c2] font-medium transition">Save Changes</button>
                </div>
            </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setTaskToDelete(null)}>
            <div className="bg-neutral-900 rounded-2xl p-6 max-w-sm w-full border border-neutral-800 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-white mb-2">Delete Task?</h3>
                <p className="text-gray-400 mb-6">Are you sure you want to delete this task?</p>
                <div className="flex gap-3">
                    <button onClick={() => setTaskToDelete(null)} className="flex-1 py-3 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 font-medium transition">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 font-medium transition">Delete</button>
                </div>
            </div>
        </div>
      )}

      {/* --- REPORT MODAL --- */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setIsReportOpen(false)}>
            <div className="bg-neutral-900 rounded-2xl p-8 max-w-md w-full border border-neutral-800 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Daily Progress</h3>
                    <button onClick={() => setIsReportOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                
                <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-neutral-800 flex items-center justify-center relative">
                    <svg className="w-full h-full absolute top-0 left-0 transform -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="#262626" strokeWidth="8" fill="none" />
                        <circle cx="64" cy="64" r="60" stroke="#6200ea" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset={377 - (377 * progressPercent) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="text-3xl font-bold text-white">{progressPercent}%</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                        <p className="text-2xl font-bold text-white">{completedCount}</p>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Completed</p>
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                        <p className="text-2xl font-bold text-white">{tasks.length}</p>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Total</p>
                    </div>
                </div>

                {/* RECENT ACTIVITY LIST */}
                <div className="mt-8 text-left">
                    <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Today's Activity</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                        {activityLog.length === 0 ? (
                            <p className="text-gray-600 text-sm italic">No activity recorded today.</p>
                        ) : (
                            activityLog.map((log, i) => (
                                <div key={i} className="flex gap-3 items-start text-sm">
                                    <span className="text-gray-600 font-mono text-xs mt-0.5 whitespace-nowrap">
                                        {new Date(log.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                    <span className="text-gray-300 leading-snug">{log.action}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}