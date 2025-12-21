import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// --- MUI IMPORTS ---
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { useMediaQuery } from '@mui/material'; 
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Enable the plugin to parse "2:30 pm"
dayjs.extend(customParseFormat);

export default function Dashboard({ user, onLogout, onNavigate }) {
  // --- RESPONSIVE CHECK ---
  const isMobile = useMediaQuery('(max-width:768px)'); 

  // --- STATE ---
  const [tasks, setTasks] = useState([]);
  const [activityLog, setActivityLog] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Inputs
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(null); 

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isThoughtsOpen, setIsThoughtsOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [thoughtText, setThoughtText] = useState('');
  
  // Actions
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [activeNote, setActiveNote] = useState(null);

  // --- REMINDER STATE ---
  const [reminder, setReminder] = useState(null); 
  const [remindedTaskIds, setRemindedTaskIds] = useState([]); 

  // --- HELPERS ---
  const getUserName = () => {
    if (user.user_metadata && user.user_metadata.first_name) {
        return user.user_metadata.first_name;
    }
    if (user.user_metadata && user.user_metadata.full_name) {
        return user.user_metadata.full_name.split(' ')[0]; 
    }
    return user.email ? user.email.split('@')[0] : 'User';
  };

  // --- NEW: VOICE ASSISTANT FUNCTION ---
  const speakNotification = (taskName) => {
    if ('speechSynthesis' in window) {
        // 1. Cancel any currently playing speech to avoid overlap
        window.speechSynthesis.cancel();

        // 2. Construct the sentence
        const text = `Hey ${getUserName()}, you have 5 minutes to get ${taskName} done.`;
        
        // 3. Create the utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Optional: Tweak settings (Rate: 0.1 to 10, Pitch: 0 to 2)
        utterance.rate = 1; 
        utterance.pitch = 1;
        
        // 4. Speak
        window.speechSynthesis.speak(utterance);
    }
  };

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    fetchTasks();
    fetchActivities(); 
  }, []);

  // --- TIME CHECKER (Runs every 30 seconds) ---
  useEffect(() => {
    const checkReminders = () => {
        const now = dayjs();
        
        tasks.forEach(task => {
            // 1. Skip if completed, no time set, or already reminded
            if (task.completed || !task.time || remindedTaskIds.includes(task.id)) return;

            // 2. Parse the task time
            const taskTime = dayjs(task.time, 'h:mm a');
            
            // 3. Check if it's valid date
            if (!taskTime.isValid()) return;

            // 4. Calculate difference in minutes
            const diffMinutes = taskTime.diff(now, 'minute');

            // 5. Trigger if exactly 5 minutes remaining
            if (diffMinutes === 5) {
                setReminder(task);
                setRemindedTaskIds(prev => [...prev, task.id]); // Mark as reminded
                
                // --- TRIGGER VOICE ---
                speakNotification(task.content);
            }
        });
    };

    // Run immediately then interval
    checkReminders();
    const interval = setInterval(checkReminders, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [tasks, remindedTaskIds]);


  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50); 
        
        if (error) throw error;
        setActivityLog(data);
    } catch (error) {
        console.error('Error fetching activity:', error);
    }
  };

  const addActivity = async (action) => {
    try {
        const tempLog = { action, created_at: new Date().toISOString() };
        setActivityLog(prev => [tempLog, ...prev]);

        const { error } = await supabase
            .from('activities')
            .insert([{ action, user_id: user.id }]);

        if (error) throw error;
    } catch (error) {
        console.error('Error logging activity:', error);
    }
  };

  // --- ACTIONS ---
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    const formattedTime = newTaskTime ? newTaskTime.format('h:mm a') : '';

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
            content: newTask, 
            time: formattedTime, 
            user_id: user.id, 
            completed: false 
        }])
        .select();

      if (error) throw error;

      setTasks([data[0], ...tasks]);
      addActivity(`Added task: "${newTask}"`); 
      setNewTask('');
      setNewTaskTime(null);
    } catch (error) {
      alert('Error adding task');
      console.error(error);
    }
  };

  const toggleTask = async (id, currentStatus, content) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      addActivity(`${!currentStatus ? 'Completed' : 'Unchecked'}: "${content}"`);
    } catch (error) {
      alert('Error updating task');
      fetchTasks();
    }
  };

  const saveEdit = async () => {
    if (!taskToEdit) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          content: taskToEdit.content, 
          time: taskToEdit.time, 
          comments: taskToEdit.comments 
        })
        .eq('id', taskToEdit.id);

      if (error) throw error;

      setTasks(tasks.map(t => t.id === taskToEdit.id ? taskToEdit : t));
      addActivity(`Updated task: "${taskToEdit.content}"`);
      setTaskToEdit(null);
    } catch (error) {
      alert('Error saving edit');
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    const taskContent = tasks.find(t => t.id === taskToDelete)?.content;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToDelete);

      if (error) throw error;

      setTasks(tasks.filter(t => t.id !== taskToDelete));
      addActivity(`Deleted task: "${taskContent}"`);
      setTaskToDelete(null);
    } catch (error) {
      alert('Error deleting task');
    }
  };

  const saveThought = async () => {
    if (!thoughtText.trim()) return;
    const FORM_ENDPOINT = "https://formspree.io/f/xldqkdaz"; 

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: thoughtText, 
            email: user.email,
            name: getUserName() 
        })
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
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg shadow-black/20 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                </div>
                <span className="font-bold text-xl tracking-tight">Listr</span>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
                <button onClick={() => setIsReportOpen(true)} className="text-gray-400 hover:text-white text-sm font-medium transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    <span className="hidden md:inline">Report</span>
                </button>
                <button onClick={onLogout} className="text-gray-400 hover:text-red-400 text-sm font-medium transition flex items-center gap-2">
                    Logout
                </button>
            </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-28 md:pt-32 pb-20 flex flex-col items-center">
        
        {/* Title */}
        <div className="text-center mb-10 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Welcome, {getUserName()}!</h1>
            <p className="text-gray-500 text-lg">What is your main focus for today?</p>
        </div>

        {/* --- INPUT SECTION --- */}
        <div className="w-full flex flex-col md:flex-row gap-3 mb-10 md:mb-12">
            
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Enter a task" 
              className="w-full md:flex-1 bg-white text-black rounded-xl px-6 py-4 text-lg outline-none focus:ring-4 focus:ring-purple-900/50 placeholder-gray-400 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />
            
            <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setIsTimePickerOpen(true)}
                  className="flex-1 md:w-32 bg-neutral-900 text-white border border-neutral-800 rounded-xl px-4 py-4 text-lg font-medium hover:border-[#6600FF] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                   {newTaskTime ? (
                     <span className="text-[#6600FF]">{newTaskTime.format('h:mm A')}</span>
                   ) : (
                     <span className="text-gray-400">Set Time</span>
                   )}
                </button>

                <button 
                  onClick={handleAddTask}
                  className="flex-1 md:w-auto md:px-8 bg-[#6200ea] hover:bg-[#5000c2] text-white font-bold rounded-xl py-4 text-lg transition-all shadow-[0_0_20px_rgba(98,0,234,0.4)] hover:shadow-[0_0_30px_rgba(98,0,234,0.6)] active:scale-95"
                >
                  Add
                </button>
            </div>
        </div>

        {/* --- TASK LIST --- */}
        <div className="w-full max-h-[45vh] overflow-y-auto no-scrollbar pr-1">
            {loading ? (
                <div className="text-center py-10 text-gray-500 animate-pulse">Loading tasks...</div>
            ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 border-2 border-dashed border-neutral-900 rounded-3xl bg-neutral-950/50">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                </div>
                <h3 className="text-lg md:text-xl font-medium text-white mb-2">No tasks yet</h3>
                <p className="text-gray-500 text-sm md:text-base">Add your first task to get started</p>
            </div>
            ) : (
            tasks.map(task => (
                <div key={task.id} className="group flex items-start gap-4 py-5 md:py-6 border-b border-neutral-800 hover:border-neutral-700 transition-colors animate-fade-in">
                
                <button onClick={() => toggleTask(task.id, task.completed, task.content)} className="mt-1 flex-shrink-0 transition-transform active:scale-95">
                    {task.completed ? (
                    <svg className="w-6 h-6 text-[#6200ea]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-neutral-700 hover:border-gray-500 transition-colors"></div>
                    )}
                </button>
                
                <div className="flex-1 min-w-0">
                    <span className={`text-lg md:text-xl font-light block leading-tight break-words ${task.completed ? 'line-through text-gray-600' : 'text-white'}`}>
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
                    <span className="text-gray-500 font-mono text-xs md:text-sm mt-1.5 whitespace-nowrap">
                        {task.time}
                    </span>
                )}

                <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
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
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Contact</button>
            </div>
        </div>
      </footer>

      {/* --- RESPONSIVE TIME PICKER MODAL --- */}
      {isTimePickerOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsTimePickerOpen(false)}>
            <div className="bg-neutral-900 rounded-3xl p-4 md:p-6 overflow-hidden shadow-2xl border border-neutral-800 max-w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-bold text-center mb-4 text-xl">Pick a Time</h3>
                <div className="rounded-2xl overflow-hidden bg-[#171717]">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticTimePicker
                            // --- MAGIC LINE: Switches to portrait on mobile ---
                            orientation={isMobile ? 'portrait' : 'landscape'}
                            
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
                                '& .MuiClock-pin': { bgcolor: '#6600FF' },
                                '& .MuiClockPointer-root': { bgcolor: '#6600FF' },
                                '& .MuiClockPointer-thumb': { border: '16px solid #6600FF', bgcolor: 'white' },
                                '& .MuiClockNumber-root': { color: 'white' },
                                '& .MuiTypography-root': { color: 'white' },
                                '& .MuiPickersToolbar-root': { color: 'white', '& .MuiTypography-root': { color: '#6600FF' } },
                                '& .MuiDialogActions-root': { bgcolor: '#171717', '& button': { color: '#6600FF' } }
                            }}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        </div>
      )}

      {/* --- FULL SCREEN REMINDER OVERLAY --- */}
      {reminder && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-fade-in">
             <div className="w-24 h-24 bg-[#6600FF] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(102,0,255,0.6)] animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             </div>
             
             <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 tracking-tight">
                Hey {getUserName()},<br/>it's almost time.
             </h2>
             
             <div className="max-w-2xl bg-white/10 border border-white/10 rounded-3xl p-8 mb-10 backdrop-blur-lg">
                <p className="text-gray-400 text-lg uppercase tracking-wider font-bold mb-2">Upcoming Task</p>
                <p className="text-3xl md:text-4xl font-bold text-white leading-tight">{reminder.content}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#6600FF]/20 text-[#6600FF] rounded-full font-bold">
                    <span>Starts in 5 minutes</span>
                    <span>•</span>
                    <span>{reminder.time}</span>
                </div>
             </div>

             <button 
                onClick={() => setReminder(null)}
                className="px-10 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-xl"
             >
                I'm on it
             </button>
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

                {/* RECENT ACTIVITY LIST (Now powered by Supabase) */}
                <div className="mt-8 text-left">
                    <h4 className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Today's Activity</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                        {activityLog.length === 0 ? (
                            <p className="text-gray-600 text-sm italic">No activity recorded today.</p>
                        ) : (
                            activityLog.map((log, i) => (
                                <div key={i} className="flex gap-3 items-start text-sm">
                                    <span className="text-gray-600 font-mono text-xs mt-0.5 whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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