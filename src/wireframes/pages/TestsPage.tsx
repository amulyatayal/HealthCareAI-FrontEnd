import { useState } from 'react'
import { Play, Clock, TrendingUp, Award, ChevronRight } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const tests = [
  {
    id: '1mile',
    name: '1 Mile Walk Test',
    description: 'Measure your cardiovascular fitness by walking 1 mile as fast as you can.',
    duration: '12-20 min',
    icon: '🚶',
    lastResult: '14:32',
    lastDate: 'Jan 15',
    trend: '+5%'
  },
  {
    id: 'sit-stand',
    name: 'Sit to Stand Test',
    description: 'Count how many times you can stand up from a chair in 30 seconds.',
    duration: '30 sec',
    icon: '🪑',
    lastResult: '12 reps',
    lastDate: 'Jan 18',
    trend: '+2 reps'
  },
  {
    id: 'balance',
    name: 'Balance Test',
    description: 'Stand on one leg as long as possible to measure your balance.',
    duration: '1-2 min',
    icon: '⚖️',
    lastResult: '28 sec',
    lastDate: 'Jan 16',
    trend: '+8 sec'
  },
]

const history = [
  { date: 'Jan 18', test: 'Sit to Stand', result: '12 reps' },
  { date: 'Jan 16', test: 'Balance Test', result: '28 sec' },
  { date: 'Jan 15', test: '1 Mile Walk', result: '14:32' },
  { date: 'Jan 12', test: 'Sit to Stand', result: '11 reps' },
  { date: 'Jan 10', test: 'Balance Test', result: '22 sec' },
]

export function TestsPage() {
  const [activeTest, setActiveTest] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [timer, setTimer] = useState(0)

  const startTest = (testId: string) => {
    setActiveTest(testId)
    setIsRunning(true)
    setTimer(0)
    // Simulate timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)
    
    // Auto-stop after 30 seconds for demo
    setTimeout(() => {
      clearInterval(interval)
      setIsRunning(false)
    }, 5000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (activeTest && isRunning) {
    const test = tests.find(t => t.id === activeTest)
    return (
      <WireframeLayout title={test?.name || 'Test'} showBack hideNav>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>{test?.icon}</div>
          
          <div style={{ 
            fontSize: '72px', 
            fontWeight: '700', 
            color: 'var(--wf-rose-500)',
            marginBottom: '16px'
          }}>
            {formatTime(timer)}
          </div>
          
          <p style={{ fontSize: '16px', color: 'var(--wf-gray-600)', marginBottom: '32px' }}>
            Test in progress...
          </p>
          
          <button 
            className="wf-btn wf-btn-secondary"
            onClick={() => setIsRunning(false)}
          >
            Stop Test
          </button>
        </div>
      </WireframeLayout>
    )
  }

  return (
    <WireframeLayout title="Physical Tests" showBack>
      <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)', marginBottom: '16px' }}>
        Track your physical fitness with these simple tests
      </p>

      {/* Test Cards */}
      {tests.map((test) => (
        <WireframeCard key={test.id}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '14px',
                background: 'var(--wf-rose-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0
              }}
            >
              {test.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--wf-gray-800)', marginBottom: '4px' }}>
                {test.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--wf-gray-500)', marginBottom: '8px' }}>
                {test.description}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  fontSize: '12px',
                  color: 'var(--wf-gray-500)'
                }}>
                  <Clock size={12} />
                  {test.duration}
                </span>
                
                {test.lastResult && (
                  <>
                    <span style={{ color: 'var(--wf-gray-300)' }}>•</span>
                    <span style={{ fontSize: '12px', color: 'var(--wf-gray-500)' }}>
                      Last: {test.lastResult} ({test.lastDate})
                    </span>
                    <span 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '2px',
                        fontSize: '12px',
                        color: '#16a34a',
                        fontWeight: '500'
                      }}
                    >
                      <TrendingUp size={12} />
                      {test.trend}
                    </span>
                  </>
                )}
              </div>
              
              <button 
                className="wf-btn wf-btn-primary wf-btn-sm"
                onClick={() => startTest(test.id)}
              >
                <Play size={14} />
                Start Test
              </button>
            </div>
          </div>
        </WireframeCard>
      ))}

      {/* Achievement */}
      <WireframeCard>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '8px',
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '12px'
        }}>
          <Award size={32} style={{ color: '#d97706' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e' }}>
              Consistency Champion!
            </div>
            <div style={{ fontSize: '12px', color: '#b45309' }}>
              You've completed 5 tests this month
            </div>
          </div>
        </div>
      </WireframeCard>

      {/* History */}
      <div className="wf-section-header">
        <span className="wf-section-title">Recent Results</span>
        <button style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--wf-rose-500)',
          fontSize: '13px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}>
          View All <ChevronRight size={16} />
        </button>
      </div>

      {history.map((entry, i) => (
        <div 
          key={i}
          className="wf-list-item"
          style={{ background: 'white', borderRadius: '12px', marginBottom: '8px' }}
        >
          <div className="wf-list-content">
            <div className="wf-list-title">{entry.test}</div>
            <div className="wf-list-subtitle">{entry.date}</div>
          </div>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: 'var(--wf-rose-500)' 
          }}>
            {entry.result}
          </span>
        </div>
      ))}
    </WireframeLayout>
  )
}
