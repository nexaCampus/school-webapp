'use client';

import React, { useState } from 'react';

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  busRegNo: string;
  gpsDeviceId: string;
  supervisorName: string;
  supervisorPhone: string;
  capacity: string;
  stops: { stopName: string; morningPickup: string; eveningDrop: string }[];
}

export const BUS_ROUTES: BusRoute[] = [
  {
    id: 'route-1',
    routeNumber: 'Route 101',
    routeName: 'South Kolkata & Tollygunge Express',
    busRegNo: 'WB-02-AK-9142',
    gpsDeviceId: 'GPS-TRK-7719',
    supervisorName: 'Mr. Bimal Das',
    supervisorPhone: '+91 98310-44912',
    capacity: '44 Seater AC',
    stops: [
      { stopName: 'Garia Metro Station', morningPickup: '06:45 AM', eveningDrop: '03:15 PM' },
      { stopName: 'Tollygunge Phari Crossing', morningPickup: '07:00 AM', eveningDrop: '03:00 PM' },
      { stopName: 'Rashbehari Avenue / Triangular Park', morningPickup: '07:15 AM', eveningDrop: '02:45 PM' },
      { stopName: 'Ballygunge Circular Road', morningPickup: '07:25 AM', eveningDrop: '02:35 PM' },
      { stopName: 'School Main Gate Wing A', morningPickup: '07:40 AM', eveningDrop: '02:15 PM' },
    ],
  },
  {
    id: 'route-2',
    routeNumber: 'Route 102',
    routeName: 'Salt Lake & New Town Tech Corridor',
    busRegNo: 'WB-02-AL-3381',
    gpsDeviceId: 'GPS-TRK-8820',
    supervisorName: 'Mr. Pradip Roy',
    supervisorPhone: '+91 98311-55201',
    capacity: '44 Seater AC',
    stops: [
      { stopName: 'New Town Action Area II (City Centre 2)', morningPickup: '06:30 AM', eveningDrop: '03:30 PM' },
      { stopName: 'Karunamoyee Central Bus Terminus', morningPickup: '06:50 AM', eveningDrop: '03:10 PM' },
      { stopName: 'Ultadanga Hudson Circle', morningPickup: '07:05 AM', eveningDrop: '02:55 PM' },
      { stopName: 'EM Bypass / Ruby Hospital Crossing', morningPickup: '07:20 AM', eveningDrop: '02:40 PM' },
      { stopName: 'School Main Gate Wing A', morningPickup: '07:40 AM', eveningDrop: '02:15 PM' },
    ],
  },
  {
    id: 'route-3',
    routeNumber: 'Route 103',
    routeName: 'Howrah Central & Rabindra Sadan Link',
    busRegNo: 'WB-02-AJ-4109',
    gpsDeviceId: 'GPS-TRK-9931',
    supervisorName: 'Mr. Ranjan Ghosh',
    supervisorPhone: '+91 98312-66314',
    capacity: '44 Seater AC',
    stops: [
      { stopName: 'Howrah Maidan Metro Link', morningPickup: '06:40 AM', eveningDrop: '03:20 PM' },
      { stopName: 'Vidyasagar Setu Toll Plaza', morningPickup: '07:00 AM', eveningDrop: '03:00 PM' },
      { stopName: 'Exide Crossing / Rabindra Sadan', morningPickup: '07:15 AM', eveningDrop: '02:45 PM' },
      { stopName: 'Minto Park / AJC Bose Road', morningPickup: '07:25 AM', eveningDrop: '02:35 PM' },
      { stopName: 'School Main Gate Wing A', morningPickup: '07:40 AM', eveningDrop: '02:15 PM' },
    ],
  },
];

export default function BusRouteDirectory() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-1');
  const [searchStop, setSearchStop] = useState('');

  const activeRoute = BUS_ROUTES.find((r) => r.id === selectedRouteId) || BUS_ROUTES[0];

  const filteredStops = activeRoute.stops.filter((s) =>
    s.stopName.toLowerCase().includes(searchStop.toLowerCase())
  );

  return (
    <div className="w-full bg-white dark:bg-[#151622] rounded-xl shadow-sm border border-slate-200 dark:border-[#222538] overflow-hidden font-sans">
      {/* Directory Title Bar */}
      <div className="p-6 bg-slate-50 dark:bg-[#101119] border-b border-slate-200 dark:border-[#222538] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
            Institutional Transit & Safety
          </span>
          <h2 className="font-serif font-bold text-xl text-oxford dark:text-[#eaedff] mt-0.5">
            School Transport & Bus Route Directory
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Fleet equipped with Live GPS Telematics, Speed Governors, CCTV Surveillance & Female Attendants.
          </p>
        </div>

        {/* Search Stop */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchStop}
            onChange={(e) => setSearchStop(e.target.value)}
            placeholder="Search stop or landmark..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#151622] border border-slate-300 dark:border-[#2b2f48] rounded-md focus:outline-hidden focus:ring-2 focus:ring-oxford dark:focus:ring-[#3b49df] text-slate-800 dark:text-[#eaedff]"
          />
          <svg className="w-4 h-4 text-slate-400 dark:text-[#8a8fa8] absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Route Selector Tab Rail */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-[#101119] p-4 border-r border-slate-200 dark:border-[#222538] space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#8a8fa8] px-2 mb-2">
            Select Transit Corridor
          </div>
          {BUS_ROUTES.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-[#1a1c2b] border-oxford dark:border-[#3b49df] shadow-xs'
                    : 'bg-white/60 dark:bg-[#151622]/60 border-slate-200 dark:border-[#222538] hover:bg-white dark:hover:bg-[#1a1c2b] text-slate-700 dark:text-[#c4c7e0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-oxford dark:text-[#eaedff]">
                    {route.routeNumber}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-[#222538] px-1.5 py-0.5 rounded text-slate-600 dark:text-[#a0a4c0]">
                    {route.busRegNo}
                  </span>
                </div>
                <div className="font-serif font-bold text-xs text-slate-900 dark:text-[#eaedff] mt-1 line-clamp-1">
                  {route.routeName}
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1 flex items-center justify-between">
                  <span>{route.stops.length} Designated Stops</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold">GPS Active</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Route Detail & Stop-by-Stop Timetable */}
        <div className="lg:col-span-8 p-6 space-y-6">
          {/* Active Route Header Metadata Card */}
          <div className="bg-parchment dark:bg-[#101119] p-4 rounded-lg border border-slate-200 dark:border-[#222538] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-oxford dark:text-[#eaedff] px-2 py-0.5 rounded bg-white dark:bg-[#151622] border border-slate-200 dark:border-[#222538]">
                  {activeRoute.routeNumber}
                </span>
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-[#eaedff]">
                  {activeRoute.routeName}
                </h3>
              </div>
              <div className="text-xs text-slate-600 dark:text-[#a0a4c0] mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                <span>Bus: {activeRoute.busRegNo}</span>
                <span>•</span>
                <span>Tracker: {activeRoute.gpsDeviceId}</span>
                <span>•</span>
                <span>{activeRoute.capacity}</span>
              </div>
            </div>

            {/* Supervisor Contact Card */}
            <div className="bg-white dark:bg-[#151622] p-3 rounded border border-slate-200 dark:border-[#222538] text-xs">
              <div className="text-slate-400 dark:text-[#8a8fa8] font-mono text-[10px] uppercase">Bus Supervisor</div>
              <div className="font-bold text-oxford dark:text-[#eaedff]">{activeRoute.supervisorName}</div>
              <a
                href={`tel:${activeRoute.supervisorPhone.replace(/[^0-9]/g, '')}`}
                className="text-emerald-700 dark:text-emerald-300 font-mono font-bold hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>📞 {activeRoute.supervisorPhone}</span>
              </a>
            </div>
          </div>

          {/* Stop-by-Stop Timetable Table */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono mb-2">
              Route Schedule & Drop Timings
            </div>
            <div className="overflow-x-auto border border-slate-200 dark:border-[#222538] rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[#1a1c2b] border-b border-slate-200 dark:border-[#222538] text-slate-700 dark:text-[#c4c7e0] font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4 w-12 text-center">Stop #</th>
                    <th className="py-2.5 px-4">Designated Boarding Point</th>
                    <th className="py-2.5 px-4 text-center">Morning Pickup</th>
                    <th className="py-2.5 px-4 text-center">Afternoon Drop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#222538]">
                  {filteredStops.map((stop, index) => (
                    <tr key={stop.stopName} className="hover:bg-slate-50 dark:hover:bg-[#1a1c2b] transition-colors">
                      <td className="py-3 px-4 font-mono text-center text-slate-400 dark:text-[#8a8fa8]">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-[#eaedff]">
                        {stop.stopName}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-oxford dark:text-[#eaedff]">
                        {stop.morningPickup}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-[#a0a4c0]">
                        {stop.eveningDrop}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
