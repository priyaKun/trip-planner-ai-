import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ItineraryForm() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [theme, setTheme] = useState('');
  const [pace, setPace] = useState('moderate');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [darkMode, setDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [shareMsg, setShareMsg] = useState('');
  const itineraryRef = useRef(null);

  const isStep1Valid = destination.trim().length > 0;
  const isStep2Valid = days > 0 && theme.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setItinerary('');

    try {
      const response = await axios.post('http://localhost:8080/api/plan-trip', {
        destination,
        days: parseInt(days),
        theme,
        pace,
      });

      setItinerary(response.data);
      setActiveStep(4); // Jump to results view
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  // Share handler
  const handleShare = async () => {
    const shareText = `Check out my ${days}-Day ${destination} Itinerary!\nTheme: ${theme} • Pace: ${pace}\n\n${itinerary}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setShareMsg('Copied to clipboard!');
      setTimeout(() => setShareMsg(''), 2000);
    } catch {
      setShareMsg('Failed to copy');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  // Print/Save as PDF handler
  const handlePrintPDF = () => {
    if (!itineraryRef.current) return;
    const printContents = itineraryRef.current.innerHTML;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><title>Itinerary PDF</title>');
    win.document.write('<style>body{font-family:Inter,sans-serif;padding:2rem;} h2{margin-top:0;} .day-header{font-weight:bold;margin-top:1.5rem;} .activity{margin-left:2rem;} .subtitle{color:#555;} .results-title{color:#212529;} .results-subtitle{color:#6c757d;} </style>');
    win.document.write('</head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  // Helper to get styles based on darkMode
  const getStyles = () => {
    if (!darkMode) return styles;
    // Deep merge for dark mode overrides
    return {
      ...styles,
      container: {
        ...styles.container,
        backgroundColor: '#121212',
        color: '#f1f1f1',
      },
      header: {
        ...styles.header,
        backgroundColor: '#181818',
        color: '#f1f1f1',
        boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
      },
      mainContent: {
        ...styles.mainContent,
        backgroundColor: '#181818',
        color: '#f1f1f1',
      },
      stepperContainer: {
        ...styles.stepperContainer,
        backgroundColor: '#181818',
        color: '#f1f1f1',
      },
      stepActive: {
        ...styles.stepActive,
        backgroundColor: '#3a0ca3',
        color: '#fff',
      },
      stepInactive: {
        ...styles.stepInactive,
        backgroundColor: '#232323',
        color: '#aaa',
      },
      searchInput: {
        ...styles.searchInput,
        backgroundColor: '#232323',
        color: '#f1f1f1',
        border: '1px solid #333',
      },
      nextButton: {
        ...styles.nextButton,
        backgroundColor: '#3a0ca3',
        color: '#fff',
      },
      popularDestinations: {
        ...styles.popularDestinations,
        color: '#aaa',
      },
      destinationTag: {
        ...styles.destinationTag,
        backgroundColor: '#232323',
        color: '#f1f1f1',
      },
      dayButton: {
        ...styles.dayButton,
        backgroundColor: '#232323',
        color: '#f1f1f1',
      },
      dayButtonActive: {
        ...styles.dayButtonActive,
        backgroundColor: '#3a0ca3',
        color: '#fff',
      },
      input: {
        ...styles.input,
        backgroundColor: '#232323',
        color: '#f1f1f1',
        border: '1px solid #333',
      },
      backButton: {
        ...styles.backButton,
        backgroundColor: '#232323',
        color: '#f1f1f1',
      },
      paceCard: {
        ...styles.paceCard,
        backgroundColor: '#232323',
        color: '#f1f1f1',
        border: '1px solid #333',
      },
      paceCardActive: {
        ...styles.paceCardActive,
        backgroundColor: '#3a0ca3',
        color: '#fff',
      },
      resultsContainer: {
        ...styles.resultsContainer,
        backgroundColor: '#181818',
        color: '#f1f1f1',
      },
      dayHeader: {
        ...styles.dayHeader,
        borderBottom: '1px solid #333',
      },
      newItineraryButton: {
        ...styles.newItineraryButton,
        backgroundColor: 'transparent',
        color: '#3a0ca3',
        border: '2px solid #3a0ca3',
      },
      error: {
        ...styles.error,
        backgroundColor: '#3a0ca3',
        color: '#fff',
      },
      themeToggleButton: {
        ...styles.themeToggleButton,
        backgroundColor: darkMode ? '#fff' : '#3a0ca3',
        color: darkMode ? '#3a0ca3' : '#fff',
        border: '1px solid #3a0ca3',
      },
    };
  };
  const currentStyles = getStyles();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return (
    <div style={currentStyles.container}>
      {/* Header */}
      <div style={currentStyles.header}>
        <div style={currentStyles.logo}>✈️</div>
        <h1 style={currentStyles.title}>JourneyCraft</h1>
        <p style={currentStyles.subtitle}>Your personalized travel designer</p>
      </div>

      <div style={currentStyles.mainContent}>
        {!itinerary ? (
          <div style={currentStyles.stepperContainer}>
            {/* Stepper Header */}
            <div style={currentStyles.stepper}>
              <div 
                style={activeStep >= 1 ? currentStyles.stepActive : currentStyles.stepInactive}
                onClick={() => {
                  if (isStep1Valid || activeStep === 1) setActiveStep(1);
                }}
              >
                <span style={currentStyles.stepNumber}>1</span>
                <span style={currentStyles.stepLabel}>Destination</span>
              </div>
              <div style={currentStyles.stepConnector}></div>
              <div 
                style={(activeStep >= 2 && isStep1Valid) ? currentStyles.stepActive : currentStyles.stepInactive}
                onClick={() => {
                  if (isStep1Valid) setActiveStep(2);
                }}
              >
                <span style={currentStyles.stepNumber}>2</span>
                <span style={currentStyles.stepLabel}>Details</span>
              </div>
              <div style={currentStyles.stepConnector}></div>
              <div 
                style={(activeStep >= 3 && isStep1Valid && isStep2Valid) ? currentStyles.stepActive : currentStyles.stepInactive}
                onClick={() => {
                  if (isStep1Valid && isStep2Valid) setActiveStep(3);
                }}
              >
                <span style={currentStyles.stepNumber}>3</span>
                <span style={currentStyles.stepLabel}>Preferences</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={currentStyles.form}>
              {/* Step 1: Destination */}
              {activeStep === 1 && (
                <div style={currentStyles.stepContent}>
                  <h2 style={currentStyles.stepTitle}>Where would you like to go?</h2>
                  <div style={currentStyles.searchContainer}>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      style={currentStyles.searchInput}
                      placeholder="Search destinations..."
                    />
                    <button 
                      type="button" 
                      onClick={() => isStep1Valid && nextStep()}
                      style={currentStyles.nextButton}
                      disabled={!isStep1Valid}
                    >
                      Next →
                    </button>
                  </div>
                  {!isStep1Valid && <p style={{ color: '#dc3545' }}>Destination is required.</p>}

                  <div style={currentStyles.popularDestinations}>
                    <p style={currentStyles.popularLabel}>Popular choices:</p>
                    <div style={currentStyles.destinationTags}>
                      {['Paris', 'Tokyo', 'New York', 'Bali', 'Rome', 'Dubai', 'Istanbul', 'Barcelona', 'Bangkok', 'Amsterdam'].map(city => (
                        <span 
                          key={city}
                          style={currentStyles.destinationTag}
                          onClick={() => {
                            setDestination(city);
                            nextStep();
                          }}
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      const cities = ['Paris', 'Tokyo', 'New York', 'Bali', 'Rome'];
                      const themes = ['Adventure', 'Relaxation', 'Culture', 'Food tour', 'Romantic'];
                      setDestination(cities[Math.floor(Math.random() * cities.length)]);
                      setTheme(themes[Math.floor(Math.random() * themes.length)]);
                      setDays(Math.floor(Math.random() * 10) + 3);
                      setPace(['relaxed', 'moderate', 'fast'][Math.floor(Math.random() * 3)]);
                      setActiveStep(3); // Skip to preferences
                    }}
                    style={{ ...currentStyles.nextButton, marginTop: '1rem', backgroundColor: '#3a0ca3' }}
                  >
                    🎲 I'm Feeling Lucky
                  </button>
                </div>
              )}

              {/* Step 2: Details */}
              {activeStep === 2 && (
                <div style={currentStyles.stepContent}>
                  <h2 style={currentStyles.stepTitle}>Trip Details</h2>
                  <div style={currentStyles.daysSelector}>
                    <label style={currentStyles.daysLabel}>How many days?</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      required
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      style={currentStyles.input}
                      placeholder="Enter number of days"
                    />
                  </div>
                  <div style={currentStyles.themeInput}>
                    <label style={currentStyles.themeLabel}>What's your travel theme?</label>
                    <input
                      type="text"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="e.g., Food tour, Adventure, Relaxation..."
                      maxLength={50}
                      style={currentStyles.input}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '0.5rem' }}>
                      {theme.length}/50 characters
                    </p>
                    <div style={currentStyles.destinationTags}>
                      {['Adventure', 'Relaxation', 'Culture', 'Food tour', 'Romantic'].map(suggestion => (
                        <span
                          key={suggestion}
                          style={currentStyles.destinationTag}
                          onClick={() => setTheme(suggestion)}
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!isStep2Valid && <p style={{ color: '#dc3545' }}>Days and theme are required.</p>}

                  <div style={currentStyles.navigationButtons}>
                    <button 
                      type="button" 
                      onClick={prevStep}
                      style={currentStyles.backButton}
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => isStep2Valid && nextStep()}
                      style={currentStyles.nextButton}
                      disabled={!isStep2Valid}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences */}
              {activeStep === 3 && (
                <div style={currentStyles.stepContent}>
                  <h2 style={currentStyles.stepTitle}>Your Travel Style</h2>
                  <div style={currentStyles.paceSelector}>
                    <label style={currentStyles.paceLabel}>Preferred pace:</label>
                    <div style={currentStyles.paceCards}>
                      {['relaxed', 'moderate', 'fast'].map((type) => (
                        <div 
                          key={type}
                          style={pace === type ? currentStyles.paceCardActive : currentStyles.paceCard}
                          onClick={() => setPace(type)}
                        >
                          <div style={currentStyles.paceIcon}>
                            {type === 'relaxed' ? '🌴' : type === 'moderate' ? '🚶‍♂️' : '🏃‍♂️'}
                          </div>
                          <h3 style={currentStyles.paceTitle}>
                            {type === 'relaxed' ? 'Relaxed' : type === 'moderate' ? 'Balanced' : 'Fast-Paced'}
                          </h3>
                          <p style={currentStyles.paceDesc}>
                            {type === 'relaxed' ? 'Plenty of downtime' : type === 'moderate' ? 'Mix of activities & rest' : 'Maximum experiences'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={loading ? currentStyles.submitButtonLoading : currentStyles.submitButton}
                  >
                    {loading ? 'Crafting Your Journey...' : 'Generate My Itinerary ✨'}
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div style={currentStyles.resultsContainer}>
            <div ref={itineraryRef}>
              <div className="results-header">
                <h2 className="results-title" style={currentStyles.resultsTitle}>Your {days}-Day {destination} Itinerary</h2>
                <div className="results-subtitle" style={currentStyles.resultsSubtitle}>{theme} • {pace} pace</div>
              </div>
              <div className="itinerary" style={currentStyles.itinerary}>
                {itinerary.split('\n').map((line, index) => (
                  <div key={index} className="itinerary-item" style={currentStyles.itineraryItem}>
                    {line.startsWith('Day') ? (
                      <div className="day-header" style={currentStyles.dayHeader}>
                        <div style={currentStyles.dayMarker}>📌</div>
                        <h3 style={currentStyles.dayTitle}>{line}</h3>
                      </div>
                    ) : (
                      <div className="activity" style={currentStyles.activity}>
                        <div style={currentStyles.timeBullet}>📍</div>
                        <div style={currentStyles.activityText}>{line}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button 
              style={currentStyles.newItineraryButton}
              onClick={() => {
                setItinerary('');
                setActiveStep(1);
              }}
            >
              Plan Another Trip
            </button>
            <button
              style={{ ...currentStyles.newItineraryButton, borderColor: '#dc3545', color: '#dc3545' }}
              onClick={() => {
                setItinerary('');
                setDestination('');
                setDays(3);
                setTheme('');
                setPace('moderate');
                setActiveStep(1);
              }}
            >
              🗑️ Clear & Start Over
            </button>
            <button
              style={{ ...currentStyles.newItineraryButton, borderColor: '#198754', color: '#198754' }}
              onClick={handleShare}
            >
              📋 Share Itinerary
            </button>
            <button
              style={{ ...currentStyles.newItineraryButton, borderColor: '#0d6efd', color: '#0d6efd' }}
              onClick={handlePrintPDF}
            >
              🖨️ Save as PDF
            </button>
            {shareMsg && (
              <div style={{ marginTop: '1rem', color: '#198754', textAlign: 'center', fontWeight: 600 }}>
                {shareMsg}
              </div>
            )}
          </div>
        )}
        {error && (
          <div style={currentStyles.error}>
            <span style={currentStyles.errorIcon}>⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
}

// Modern, magazine-style layout with stepped approach
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    padding: '0',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#f8f9fa',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    textAlign: 'center',
    padding: '2rem 0',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '2rem',
  },
  logo: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #4361ee, #3a0ca3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6c757d',
    marginTop: '0.5rem',
  },
  mainContent: {
    width: '100vw', // Changed from 100% to 100vw
    maxWidth: 'none', // Remove maxWidth limit
    padding: '0 2rem',
    marginBottom: '3rem',
    minHeight: 'calc(100vh - 7rem)', // Ensure it fills the window minus header
  },
  stepperContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '2rem',
    marginBottom: '2rem',
  },
  stepper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  stepActive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    backgroundColor: '#4361ee',
    color: 'white',
    fontWeight: '600',
    minWidth: '100px',
  },
  stepInactive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    backgroundColor: '#e9ecef',
    color: '#6c757d',
    fontWeight: '600',
    minWidth: '100px',
  },
  stepNumber: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: '0.9rem',
  },
  stepConnector: {
    width: '50px',
    height: '2px',
    backgroundColor: '#dee2e6',
  },
  form: {
    width: '100%',
  },
  stepContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  stepTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#212529',
  },
  searchContainer: {
    display: 'flex',
    marginBottom: '2rem',
  },
  searchInput: {
    flex: '1',
    padding: '1rem',
    borderRadius: '8px 0 0 8px',
    border: '1px solid #ced4da',
    borderRight: 'none',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
    color: '#212529', // Changed to dark text
    backgroundColor: '#fff', // Ensure white background
  },
  nextButton: {
    padding: '1rem 1.5rem',
    backgroundColor: '#4361ee',
    color: 'white',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  popularDestinations: {
    marginTop: '2rem',
  },
  popularLabel: {
    color: '#6c757d',
    marginBottom: '0.5rem',
  },
  destinationTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  destinationTag: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e9ecef',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#dee2e6',
    },
  },
  daysSelector: {
    marginBottom: '2rem',
  },
  daysLabel: {
    display: 'block',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  daysButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  dayButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e9ecef',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  dayButtonActive: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4361ee',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  themeInput: {
    marginBottom: '2rem',
  },
  themeLabel: {
    display: 'block',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
  },
  backButton: {
    padding: '1rem 1.5rem',
    backgroundColor: '#e9ecef',
    color: '#495057',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  paceSelector: {
    marginBottom: '2rem',
  },
  paceLabel: {
    display: 'block',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  paceCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  paceCard: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
    border: '1px solid #e9ecef',
  },
  paceCardActive: {
    padding: '1.5rem',
    backgroundColor: '#4361ee',
    color: 'white',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(67, 97, 238, 0.3)',
  },
  paceIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  paceTitle: {
    margin: '0 0 0.5rem 0',
  },
  paceDesc: {
    margin: '0',
    fontSize: '0.9rem',
    opacity: '0.8',
  },
  submitButton: {
    width: '100%',
    padding: '1.25rem',
    backgroundColor: '#4361ee',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.3s',
    marginTop: '1rem',
  },
  submitButtonLoading: {
    width: '100%',
    padding: '1.25rem',
    backgroundColor: '#adb5bd',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.3s',
    marginTop: '1rem',
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '2rem',
  },
  resultsHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  resultsTitle: {
    fontSize: '2rem',
    margin: '0 0 0.5rem 0',
    color: '#212529',
  },
  resultsSubtitle: {
    color: '#6c757d',
    fontSize: '1.1rem',
  },
  itinerary: {
    marginTop: '2rem',
  },
  itineraryItem: {
    marginBottom: '1.5rem',
  },
  dayHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e9ecef',
  },
  dayMarker: {
    marginRight: '1rem',
    fontSize: '1.2rem',
  },
  dayTitle: {
    margin: '0',
    fontSize: '1.5rem',
  },
  activity: {
    display: 'flex',
    marginBottom: '0.75rem',
    paddingLeft: '2rem',
  },
  timeBullet: {
    marginRight: '1rem',
    color: '#4361ee',
  },
  activityText: {
    margin: '0',
  },
  newItineraryButton: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: 'transparent',
    color: '#4361ee',
    border: '2px solid #4361ee',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s',
    marginTop: '2rem',
  },
  error: {
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fff3bf',
    color: '#495057',
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  errorIcon: {
    fontSize: '1.2rem',
  },
  darkContainer: {
    backgroundColor: '#121212',
    color: '#f1f1f1',
  },
  themeToggleButton: {
    marginTop: '1rem',
    backgroundColor: '#3a0ca3',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },

};

export default ItineraryForm;