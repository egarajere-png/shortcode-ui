import React from 'react';
import { PageHeader } from './ui/PageHeader';
import { StatCard } from './ui/StatCard';
import UserService from '../services/UserService';
import RenderOnRole from './access/RenderOnRole';

function Dashboard() {
  const username = UserService.getUsername();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const isChecker = UserService.hasRole(['checker']);
  const isMaker = UserService.hasRole(['maker']);
  const roleLabel = isChecker ? 'Checker' : isMaker ? 'Maker' : 'Staff';

  return (
    <div>
      {/* Greeting banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-xl p-6 mb-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">{greeting},</p>
            <h1 className="text-2xl font-bold tracking-tight">{username || 'User'}</h1>
            <p className="text-blue-200 text-sm mt-1">Welcome to the ABC Bank Shortcodes Portal</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-800/50 border border-blue-700 rounded-lg px-4 py-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-100">Role: {roleLabel}</span>
          </div>
        </div>
      </div>

      {/* Section: Shortcode Management */}
      <RenderOnRole roles={['maker']}>
        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            Shortcode Management
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Request Shortcode"
              description="Submit a new shortcode request for a customer account"
              to="/"
              colorClass="text-blue-700"
              bgClass="bg-blue-50"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            />
            <StatCard
              title="Delete Shortcode"
              description="Initiate a shortcode deletion request for checker approval"
              to="/delete"
              colorClass="text-red-600"
              bgClass="bg-red-50"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            />
          </div>
        </section>
      </RenderOnRole>

      {/* Section: Approvals */}
      <RenderOnRole roles={['checker']}>
        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            Approvals
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Pending Approvals"
              description="Review and approve shortcode requests submitted by makers"
              to="/pending"
              colorClass="text-amber-600"
              bgClass="bg-amber-50"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Pending Deletions"
              description="Review and approve shortcode deletion requests"
              to="/pending-delete"
              colorClass="text-orange-600"
              bgClass="bg-orange-50"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              }
            />
          </div>
        </section>
      </RenderOnRole>

      {/* Section: Query & Audit — visible to all */}
      <section className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Query & Audit
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Query Shortcode"
            description="Look up shortcode details by shortcode number"
            to="/query"
            colorClass="text-blue-700"
            bgClass="bg-blue-50"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <StatCard
            title="Query by Account"
            description="Retrieve all shortcodes linked to a customer account"
            to="/query/account"
            colorClass="text-indigo-700"
            bgClass="bg-indigo-50"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Section: M-Pesa */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          M-Pesa Simulation
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Simulate C2B"
            description="Test customer-to-business payment simulations"
            to="/c2b"
            colorClass="text-green-700"
            bgClass="bg-green-50"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          />
          <StatCard
            title="B2C Transfer"
            description="Initiate business-to-customer M-Pesa transfers"
            to="/b2c"
            colorClass="text-teal-700"
            bgClass="bg-teal-50"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            }
          />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;