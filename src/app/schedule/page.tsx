'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Calendar, Clock, Bell, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const daysOfWeek = [
  { key: 'today', label: 'Today', date: 'Dec 28' },
  { key: 'tomorrow', label: 'Tomorrow', date: 'Dec 29' },
  { key: 'monday', label: 'Monday', date: 'Dec 30' },
  { key: 'tuesday', label: 'Tuesday', date: 'Dec 31' },
  { key: 'wednesday', label: 'Wednesday', date: 'Jan 1' },
  { key: 'thursday', label: 'Thursday', date: 'Jan 2' },
  { key: 'friday', label: 'Friday', date: 'Jan 3' },
];

const scheduleData = {
  today: [
    {
      id: '1',
      title: 'Attack on Titan: Final Season',
      episode: 'Episode 12',
      episodeTitle: 'The Final Battle',
      time: '16:05 JST',
      poster: 'https://via.placeholder.com/80x120/1a1a1a/white?text=AOT',
      isNew: true
    },
    {
      id: '2',
      title: 'Demon Slayer: Kimetsu no Yaiba',
      episode: 'Episode 8',
      episodeTitle: 'The Sound of Thunder',
      time: '23:15 JST',
      poster: 'https://via.placeholder.com/80x120/2d4a2d/white?text=DS',
      isNew: true
    }
  ],
  tomorrow: [
    {
      id: '3',
      title: 'Jujutsu Kaisen Season 2',
      episode: 'Episode 15',
      episodeTitle: 'Hidden Inventory',
      time: '24:25 JST',
      poster: 'https://via.placeholder.com/80x120/4a2d4a/white?text=JJK',
      isNew: true
    }
  ],
  monday: [
    {
      id: '4',
      title: 'One Piece',
      episode: 'Episode 1095',
      episodeTitle: 'The Legendary Devil Fruit',
      time: '09:30 JST',
      poster: 'https://via.placeholder.com/80x120/4a4a2d/white?text=OP',
      isNew: false
    }
  ],
  tuesday: [],
  wednesday: [
    {
      id: '5',
      title: 'My Hero Academia Season 7',
      episode: 'Episode 4',
      episodeTitle: 'Heroes Rising',
      time: '17:30 JST',
      poster: 'https://via.placeholder.com/80x120/2d2d4a/white?text=MHA',
      isNew: true
    }
  ],
  thursday: [],
  friday: [
    {
      id: '6',
      title: 'Chainsaw Man',
      episode: 'Episode 13',
      episodeTitle: 'The Devil Hunter',
      time: '24:00 JST',
      poster: 'https://via.placeholder.com/80x120/4a1a1a/white?text=CSM',
      isNew: true
    }
  ]
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState('today');

  const currentSchedule = scheduleData[activeDay as keyof typeof scheduleData] || [];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
              <Calendar className="h-10 w-10 text-blue-500 mr-4" />
              Anime Schedule
            </h1>
            <p className="text-gray-400 text-lg">
              Stay up to date with the latest anime episode releases
            </p>
          </div>

          {/* Day Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 overflow-x-auto">
              {daysOfWeek.map((day) => (
                <button
                  key={day.key}
                  onClick={() => setActiveDay(day.key)}
                  className={cn(
                    'flex-shrink-0 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200',
                    activeDay === day.key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  )}
                >
                  <div className="text-center">
                    <div className="font-semibold">{day.label}</div>
                    <div className="text-xs opacity-75">{day.date}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Content */}
          <div className="space-y-6">
            {currentSchedule.length > 0 ? (
              currentSchedule.map((anime) => (
                <div 
                  key={anime.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Poster */}
                    <div className="flex-shrink-0">
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="w-16 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {anime.title}
                          </h3>
                          <p className="text-blue-400 font-medium mb-1">
                            {anime.episode}
                            {anime.episodeTitle && (
                              <span className="text-gray-400 font-normal">
                                {' - '}{anime.episodeTitle}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{anime.time}</span>
                            <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">
                              Simulcast
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                          {anime.isNew && (
                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                              NEW
                            </span>
                          )}
                          <button 
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-full transition-colors"
                            title="Set reminder"
                          >
                            <Bell className="h-5 w-5" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                            title="Add to watchlist"
                          >
                            <BookOpen className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No releases scheduled
                </h3>
                <p className="text-gray-500">
                  No anime episodes are scheduled for this day.
                </p>
              </div>
            )}
          </div>

          {/* Weekly Overview */}
          <div className="mt-12 bg-gray-800/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">This Week's Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(scheduleData).map(([day, episodes]) => {
                const dayInfo = daysOfWeek.find(d => d.key === day);
                if (!dayInfo || episodes.length === 0) return null;

                return (
                  <div key={day} className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {dayInfo.label} ({dayInfo.date})
                    </h3>
                    <div className="space-y-2">
                      {episodes.slice(0, 2).map((anime) => (
                        <div key={anime.id} className="flex items-center space-x-3">
                          <img
                            src={anime.poster}
                            alt={anime.title}
                            className="w-8 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {anime.title}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {anime.episode}
                            </p>
                          </div>
                          {anime.isNew && (
                            <span className="bg-green-600 text-white px-1 py-0.5 rounded text-xs">
                              NEW
                            </span>
                          )}
                        </div>
                      ))}
                      {episodes.length > 2 && (
                        <p className="text-gray-400 text-xs">
                          +{episodes.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
