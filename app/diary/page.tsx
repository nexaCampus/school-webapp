'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import {
  initOrRestoreStudentCache,
  updateCachedDiaryTaskStatus,
  DEFAULT_DIARY_TASKS,
  DEFAULT_IMPORTANT_DATES,
  type DiaryTask,
  type ImportantDate,
  getStudentIdentifier,
} from '@/lib/cache/student-cache';
import { student as fallbackStudent } from '@/lib/data';
import { goApi } from '@/lib/api/go-client';
import { validateUploadFile } from '@/lib/security';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export default function DiaryPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Submitted'>('All');
  const [studentId, setStudentId] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [student, setStudent] = useState({
    name: 'Student',
    section: 'Sec E',
    details: 'Class 12-E â€¢ Roll No. 20',
    initials: 'ST',
  });
  const [diaryTasks, setDiaryTasks] = useState<DiaryTask[]>(DEFAULT_DIARY_TASKS);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>(DEFAULT_IMPORTANT_DATES);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student && !s?.name) {
      window.location.replace('/chooser');
      return;
    }
    const currentStudent = s?.student || { ...fallbackStudent, name: s.name || 'Student' };
    const name = currentStudent.displayName || currentStudent.name || s.name || 'Student';
    const grade = currentStudent.grade || '12';
    const section = currentStudent.section || 'E';
    const roll = currentStudent.rollNo || '20';
    const id = getStudentIdentifier(currentStudent, s.email);
    setStudentId(id);

    const parts = name.trim().split(/\s+/);
    const initials =
      parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();

    setStudent({
      name,
      section: `Sec ${section}`,
      details: `Class ${grade}-${section} â€¢ Roll No. ${roll}`,
      initials,
    });

    // Initialize or restore from student data cache
    const cache = initOrRestoreStudentCache(currentStudent, s.email);
    setDiaryTasks(cache.diaryTasks);
    setImportantDates(cache.importantDates);
  }, []);

  const handleTaskSubmit = (taskId: string, unit: string, file?: File) => {
    setUploadError(null);
    let resolvedFileName = '';

    if (file) {
      const validation = validateUploadFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || 'Invalid file format or size exceeds 10 MB limit.');
        return;
      }
      resolvedFileName = file.name;
    } else {
      const cleanName = student.name.replace(/[^a-zA-Z0-9]/g, '_');
      resolvedFileName = `${cleanName}_${unit.replace(/[^a-zA-Z0-9]/g, '_')}_Completed.pdf`;
    }

    // Persist to local student cache
    if (studentId) {
      updateCachedDiaryTaskStatus(studentId, taskId, 'Submitted', resolvedFileName);
    }

    // Submit to Go backend
    goApi.submitHomework({ homeworkId: taskId, notes: resolvedFileName, submissionDate: new Date().toISOString() });

    // Invalidate client query cache for homework and student dashboard
    queryClient.invalidateQueries({ queryKey: queryKeys.homework.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.student.all });

    setDiaryTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'Submitted',
              fileName: resolvedFileName,
              submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            }
          : t
      )
    );

    setUploadNotice(`Coursework file "${resolvedFileName}" submitted successfully and cached on this device.`);
    setTimeout(() => setUploadNotice(null), 5000);
  };

  const pendingCount = diaryTasks.filter((t) => t.status === 'Pending').length;
  const submittedCount = diaryTasks.filter((t) => t.status === 'Submitted').length;

  const filteredTasks = diaryTasks.filter((task) => {
    if (activeFilter === 'All') return true;
    return task.status === activeFilter;
  });

  return (
    <PortalShell title="Homework &amp; Diary" activePath="diary">
      <div className="flex flex-col w-full relative gap-space-md">
        {/* Ambient Atmospheric Backdrops */}
        <div className="absolute -top-10 -left-12 w-64 h-64 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-72 -right-16 w-72 h-72 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>

        {/* Student Profile Strip */}
        <section>
          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-space-sm px-3 sm:px-space-md shadow-[0_8px_24px_-6px_rgba(59,73,223,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-space-sm min-w-0">
              <div className="relative">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm sm:text-headline-sm shadow-inner">
                  {student.initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-tertiary-fixed-dim rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 sm:gap-space-xs">
                  <span className="text-[13.5px] sm:text-headline-sm font-bold text-on-surface truncate">{student.name}</span>
                  <span className="bg-surface-container-high text-primary text-[10px] sm:text-label-sm px-1.5 py-0.5 rounded-full font-bold">
                    {student.section}
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-body-sm text-on-surface-variant truncate">
                  {student.details}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 bg-surface-container px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full">
              <span className="material-symbols-outlined text-tertiary text-[14px] sm:text-[16px]">cloud_done</span>
              <span className="text-[10px] sm:text-[11px] text-on-surface font-semibold">2-Wk Cache</span>
            </div>
          </div>
        </section>

        {/* Upload Notification Alert */}
        {uploadNotice && (
          <div className="bg-tertiary-container/30 border border-tertiary/20 text-on-surface p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-2.5 animate-in fade-in">
            <span className="material-symbols-outlined text-tertiary text-[18px] sm:text-[20px]">check_circle</span>
            <span className="text-[11.5px] sm:text-[13px] font-medium">{uploadNotice}</span>
          </div>
        )}

        {/* Upload Error Alert */}
        {uploadError && (
          <div className="bg-error-container/40 border border-error/30 text-on-error-container p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-2.5 animate-in fade-in">
            <span className="material-symbols-outlined text-error text-[18px] sm:text-[20px]">warning</span>
            <span className="text-[11.5px] sm:text-[13px] font-medium">{uploadError}</span>
          </div>
        )}

        {/* Summary Banner Card */}
        <section>
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-primary-container to-[#1d2cc9] text-on-primary p-3 sm:p-space-md shadow-[0_12px_28px_-8px_rgba(28,42,200,0.38)]">
            <svg
              className="absolute -right-6 -bottom-8 w-44 h-44 text-white/10 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 200 200"
            >
              <circle cx="100" cy="100" opacity="0.3" r="80"></circle>
              <path
                d="M140,20 C180,60 190,130 140,170 C90,210 20,160 30,100 C40,40 100,-20 140,20 Z"
                opacity="0.2"
              ></path>
            </svg>
            <div className="relative z-10 flex flex-col gap-2 sm:gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-space-xs">
                  <span className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-md">
                    <span className="material-symbols-outlined text-on-primary text-[17px] sm:text-[20px]">auto_stories</span>
                  </span>
                  <span className="text-[10px] sm:text-label-sm tracking-wider uppercase text-on-primary-container font-bold">
                    Academic Planner
                  </span>
                </div>
                <span className="text-[10px] sm:text-label-sm bg-white/20 px-2 py-0.5 rounded-full text-on-primary font-bold">
                  {pendingCount} Pending
                </span>
              </div>
              <div>
                <h1 className="text-[15px] sm:text-headline-md font-bold tracking-tight text-on-primary leading-tight">
                  Student Diary &amp; Tasks
                </h1>
                <p className="text-[10.5px] sm:text-body-sm text-on-primary-container mt-0.5">
                  Manage daily prep, submit digital journals &amp; view school deadlines
                </p>
              </div>
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 sm:gap-space-xs overflow-x-auto pt-1 no-scrollbar">
                <button
                  onClick={() => setActiveFilter('All')}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-label-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1 sm:gap-1.5 ${
                    activeFilter === 'All' ? 'bg-white text-primary shadow-sm font-bold' : 'bg-white/15 text-white'
                  }`}
                >
                  <span>All Tasks</span>
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/20 text-current text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                    {diaryTasks.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveFilter('Pending')}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-label-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1 sm:gap-1.5 ${
                    activeFilter === 'Pending' ? 'bg-white text-primary shadow-sm font-bold' : 'bg-white/15 text-white'
                  }`}
                >
                  <span>Pending</span>
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-secondary-container text-on-secondary-fixed text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveFilter('Submitted')}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-label-md whitespace-nowrap transition-transform active:scale-95 flex items-center gap-1 sm:gap-1.5 ${
                    activeFilter === 'Submitted' ? 'bg-white text-primary shadow-sm font-bold' : 'bg-white/15 text-white'
                  }`}
                >
                  <span>Submitted</span>
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/30 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center">
                    {submittedCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            IMPORTANT DATES FROM SCHOOL (Cached on Device)
            ======================================================== */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between pt-space-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Important School Dates
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-outline px-2 py-0.5 rounded-full bg-surface-container">
              Cached Calendar
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {importantDates.map((item) => {
              const tagColors: Record<string, { bg: string; text: string; icon: string }> = {
                EXAM: { bg: 'bg-error/10 border-error/20', text: 'text-error', icon: 'history_edu' },
                EVENT: { bg: 'bg-primary/10 border-primary/20', text: 'text-primary', icon: 'celebration' },
                PTM: { bg: 'bg-[#5b3fb5]/10 border-[#5b3fb5]/20', text: 'text-[#5b3fb5]', icon: 'groups' },
                FEE: { bg: 'bg-secondary-container/20 border-secondary/20', text: 'text-secondary', icon: 'payments' },
                HOLIDAY: { bg: 'bg-tertiary/10 border-tertiary/20', text: 'text-tertiary', icon: 'beach_access' },
              };
              const style = tagColors[item.tag] || tagColors.EVENT;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-outline/10 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
                        <span className="material-symbols-outlined text-[13px]">{style.icon}</span>
                        {item.tag}
                      </span>
                      {item.daysRemaining !== undefined && (
                        <span className="text-[11px] font-bold text-outline">
                          {item.daysRemaining === 0 ? 'Today' : `In ${item.daysRemaining}d`}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[14px] font-bold text-on-surface leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-on-surface-variant mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-outline/10 flex items-center justify-between text-[11px] font-semibold text-outline">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">event</span>
                      <span>{item.date}</span>
                    </span>
                    <span className="text-primary font-bold">Official Notice</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            ASSIGNED COURSEWORK / DIARY TASKS (Cached on Device)
            ======================================================== */}
        <section className="flex flex-col gap-2.5 sm:gap-space-md">
          <div className="flex items-center justify-between pt-1 sm:pt-space-xs">
            <div className="flex items-center gap-1.5 sm:gap-space-xs">
              <span className="text-[13.5px] sm:text-headline-sm font-bold text-on-surface">Assigned Coursework</span>
              <span className="bg-surface-container-high text-[10px] sm:text-label-sm text-primary px-2 py-0.5 rounded-full font-bold">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>
            <span className="text-[10px] sm:text-body-sm text-outline">Synchronized locally</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-space-md">
            {filteredTasks.map((task) => (
              <article
                key={task.id}
                className="relative rounded-xl sm:rounded-2xl bg-surface-container-lowest p-3 sm:p-space-md shadow-[0_8px_24px_-6px_rgba(15,23,42,0.07)] flex flex-col justify-between"
              >
                <div
                  className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full ${
                    task.status === 'Submitted' ? 'bg-tertiary' : 'bg-primary'
                  }`}
                />
                <div>
                  <div className="flex items-start justify-between gap-2 sm:gap-space-sm pl-1.5 sm:pl-2">
                    <div className="flex items-center gap-2 sm:gap-space-sm">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                          task.status === 'Submitted'
                            ? 'bg-tertiary-fixed/30 text-tertiary'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] sm:text-[22px]">
                          {task.status === 'Submitted' ? 'task_alt' : 'assignment'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 sm:gap-space-xs">
                          <span className="text-[9.5px] sm:text-label-sm uppercase tracking-wider font-bold text-on-surface">
                            {task.subject}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          <span className="text-[9.5px] sm:text-label-sm text-outline">{task.unit}</span>
                        </div>
                        <h2 className="text-[13px] sm:text-headline-sm text-on-surface font-bold leading-tight mt-0.5">
                          {task.title}
                        </h2>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] sm:text-label-sm flex-shrink-0 font-bold shadow-sm ${
                        task.status === 'Submitted'
                          ? 'bg-tertiary/15 text-tertiary'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {task.status === 'Submitted' ? 'Submitted' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 sm:gap-x-space-md mt-2 sm:mt-space-sm py-1 px-2 rounded-lg sm:rounded-xl bg-surface-container-low text-on-surface-variant text-[10.5px] sm:text-body-sm pl-2">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-outline">school</span>
                      <span>{task.teacher}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-medium">
                      <span className="material-symbols-outlined text-[14px] sm:text-[16px]">schedule</span>
                      <span>{task.due}</span>
                    </div>
                  </div>

                  <p className="text-[11.5px] sm:text-body-md text-on-surface-variant mt-2 sm:mt-space-sm leading-relaxed pl-1.5 sm:pl-2">
                    {task.description}
                  </p>

                  {task.status === 'Submitted' && task.fileName && (
                    <div className="mt-2 sm:mt-space-md p-2 sm:p-space-sm rounded-lg sm:rounded-xl bg-surface-container-low flex items-center justify-between pl-2">
                      <span className="text-[11.5px] sm:text-[13px] font-semibold text-on-surface truncate">
                        {task.fileName}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-tertiary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] sm:text-[14px]">verified</span>
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2.5 sm:mt-space-md flex items-center gap-2 sm:gap-space-sm pl-1.5 sm:pl-2">
                  {task.status === 'Pending' ? (
                    <button
                      onClick={() => handleTaskSubmit(task.id, task.unit)}
                      className="flex-1 min-h-[38px] sm:min-h-[44px] bg-primary text-on-primary rounded-full text-[12px] sm:text-label-lg font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/90 transition-all active:scale-[0.99]"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">upload_file</span>
                      <span>Submit Work</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTaskSubmit(task.id, task.unit)}
                      className="flex-1 min-h-[38px] sm:min-h-[44px] bg-surface-container text-on-surface hover:bg-surface-container-high rounded-full text-[12px] sm:text-label-lg font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">cloud_sync</span>
                      <span>Re-upload Submission</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Teacher Remark Banner */}
          <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-surface-container to-surface-container-high p-3 sm:p-space-md flex items-start gap-2.5 sm:gap-space-sm">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">sticky_note_2</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] sm:text-label-md font-bold text-on-surface">
                  Class Teacher&apos;s Remark
                </span>
                <span className="text-[10px] sm:text-label-sm text-outline">Yesterday</span>
              </div>
              <p className="text-[11px] sm:text-body-sm text-on-surface-variant mt-0.5 sm:mt-1 leading-relaxed">
                &quot;Parents signature required on the quarterly progress report by Friday. Chemistry practical
                files must be spiral bound.&quot;
              </p>
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
