import { useState } from 'react';
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>✈️</div>
        <h1 style={styles.title}>JourneyCraft</h1>
        <p style={styles.subtitle}>Your personalized travel designer</p>
      </div>

      <div style={styles.mainContent}>
        {!itinerary ? (
          <div style={styles.stepperContainer}>
            {/* Stepper Header */}
            <div style={styles.stepper}>
              <div 
                style={activeStep >= 1 ? styles.stepActive : styles.stepInactive}
                onClick={() => {
                  if (isStep1Valid || activeStep === 1) setActiveStep(1);
                }}
              >
                <span style={styles.stepNumber}>1</span>
                <span style={styles.stepLabel}>Destination</span>
              </div>
              <div style={styles.stepConnector}></div>
              <div 
                style={(activeStep >= 2 && isStep1Valid) ? styles.stepActive : styles.stepInactive}
                onClick={() => {
                  if (isStep1Valid) setActiveStep(2);
                }}
              >
                <span style={styles.stepNumber}>2</span>
                <span style={styles.stepLabel}>Details</span>
              </div>
              <div style={styles.stepConnector}></div>
              <div 
                style={(activeStep >= 3 && isStep1Valid && isStep2Valid) ? styles.stepActive : styles.stepInactive}
                onClick={() => {
                  if (isStep1Valid && isStep2Valid) setActiveStep(3);
                }}
              >
                <span style={styles.stepNumber}>3</span>
                <span style={styles.stepLabel}>Preferences</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Step 1: Destination */}
              {activeStep === 1 && (
                <div style={styles.stepContent}>
                  <h2 style={styles.stepTitle}>Where would you like to go?</h2>
                  <div style={styles.searchContainer}>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      style={styles.searchInput}
                      placeholder="Search destinations..."
                    />
                    <button 
                      type="button" 
                      onClick={() => isStep1Valid && nextStep()}
                      style={styles.nextButton}
                      disabled={!isStep1Valid}
                    >
                      Next →
                    </button>
                  </div>
                  {!isStep1Valid && <p style={styles.validationText}>Destination is required.</p>}

                  <div style={styles.popularDestinations}>
                    <p style={styles.popularLabel}>Popular choices:</p>
                    <div style={styles.destinationTags}>
                      {['Paris', 'Tokyo', 'New York', 'Bali', 'Rome'].map(city => (
                        <span 
                          key={city}
                          style={styles.destinationTag}
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
                </div>
              )}

              {/* Step 2: Details */}
              {activeStep === 2 && (
                <div style={styles.stepContent}>
                  <h2 style={styles.stepTitle}>Trip Details</h2>
                  <div style={styles.daysSelector}>
                    <label style={styles.daysLabel}>How many days?</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      required
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      style={styles.input}
                      placeholder="Enter number of days"
                    />
                  </div>
                  <div style={styles.themeInput}>
                    <label style={styles.themeLabel}>What's your travel theme?</label>
                    <input
                      type="text"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="e.g., Food tour, Adventure, Relaxation..."
                      style={styles.input}
                    />
                  </div>
                  {!isStep2Valid && <p style={styles.validationText}>Days and theme are required.</p>}

                  <div style={styles.navigationButtons}>
                    <button 
                      type="button" 
                      onClick={prevStep}
                      style={styles.backButton}
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => isStep2Valid && nextStep()}
                      style={styles.nextButton}
                      disabled={!isStep2Valid}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences */}
              {activeStep === 3 && (
                <div style={styles.stepContent}>
                  <h2 style={styles.stepTitle}>Your Travel Style</h2>
                  <div style={styles.paceSelector}>
                    <label style={styles.paceLabel}>Preferred pace:</label>
                    <div style={styles.paceCards}>
                      {['relaxed', 'moderate', 'fast'].map((type) => (
                        <div 
                          key={type}
                          style={pace === type ? styles.paceCardActive : styles.paceCard}
                          onClick={() => setPace(type)}
                        >
                          <div style={styles.paceIcon}>
                            {type === 'relaxed' ? '🌴' : type === 'moderate' ? '🚶‍♂️' : '🏃‍♂️'}
                          </div>
                          <h3 style={styles.paceTitle}>
                            {type === 'relaxed' ? 'Relaxed' : type === 'moderate' ? 'Balanced' : 'Fast-Paced'}
                          </h3>
                          <p style={styles.paceDesc}>
                            {type === 'relaxed' ? 'Plenty of downtime' : type === 'moderate' ? 'Mix of activities & rest' : 'Maximum experiences'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={loading ? styles.submitButtonLoading : styles.submitButton}
                  >
                    {loading ? 'Crafting Your Journey...' : 'Generate My Itinerary ✨'}
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div style={styles.resultsContainer}>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>Your {days}-Day {destination} Itinerary</h2>
              <div style={styles.resultsSubtitle}>{theme} • {pace} pace</div>
            </div>
            <div style={styles.itinerary}>
              {itinerary.split('\n').map((line, index) => (
                <div key={index} style={styles.itineraryItem}>
                  {line.startsWith('Day') ? (
                    <div style={styles.dayHeader}>
                      <div style={styles.dayMarker}>📌</div>
                      <h3 style={styles.dayTitle}>{line}</h3>
                    </div>
                  ) : (
                    <div style={styles.activity}>
                      <div style={styles.timeBullet}>📍</div>
                      <div style={styles.activityText}>{line}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button 
              style={styles.newItineraryButton}
              onClick={() => {
                setItinerary('');
                setActiveStep(1);
              }}
            >
              Plan Another Trip
            </button>
          </div>
        )}
        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>⚠️</span> {error}
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
};

export default ItineraryForm;