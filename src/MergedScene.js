import React, { useState, useEffect, useRef } from 'react';
import './MergedScene.css';
import stillSound from './Still.mp3';

export default function MergedScene() {
  const audioRef = useRef(null);
  const [soundStarted, setSoundStarted] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Enter experience and start audio
  const enterExperience = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(stillSound);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
      audioRef.current.currentTime = 14; // Start at 14 seconds
    }
    audioRef.current.play()
      .then(() => {
        console.log('Audio playing!');
        setSoundStarted(true);
        setHasEntered(true);
      })
      .catch(err => {
        console.error('Audio error:', err);
        setHasEntered(true); // Enter anyway if audio fails
      });
  };

  const [evolution, setEvolution] = useState(0); // 0-100: Scene0, 100-200: Scene1, 200-300: Scene2, 300-400: Scene3
  const [awareness, setAwareness] = useState(false);
  const [boundaryVisible, setBoundaryVisible] = useState(false);
  const [insightVisible, setInsightVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [orbPulse, setOrbPulse] = useState(1);

  useEffect(() => {
    // Scene 0 timing
    if (evolution < 100) {
      const timer1 = setTimeout(() => setAwareness(true), 4000);
      const timer2 = setTimeout(() => setInsightVisible(true), 5000);
      const timer3 = setTimeout(() => setBoundaryVisible(true), 8000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [evolution]);

  useEffect(() => {
    // Scene 1 evolution (100-199) - stops at 200, requires manual transition to Scene 2
    if (evolution >= 100 && evolution < 200) {
      const evolutionTimer = setInterval(() => {
        setEvolution(prev => {
          const next = prev + 1;
          if (next >= 200) {
            clearInterval(evolutionTimer);
            return 200;
          }
          return next;
        });
      }, 150);
      
      return () => clearInterval(evolutionTimer);
    }
    // Scene 2 evolution (201-300) - only starts when user clicks button (evolution = 201)
    else if (evolution >= 201 && evolution < 300) {
      const evolutionTimer = setInterval(() => {
        setEvolution(prev => {
          const next = prev + 1;
          if (next >= 300) {
            clearInterval(evolutionTimer);
            return 300;
          }
          return next;
        });
      }, 150);
      
      return () => clearInterval(evolutionTimer);
    }
    // Scene 3 evolution (301-400) - only starts when user clicks button (evolution = 301)
    // Faster updates (50ms) with smaller increments for smooth animation
    else if (evolution >= 301 && evolution < 400) {
      const evolutionTimer = setInterval(() => {
        setEvolution(prev => {
          const next = prev + 0.33;
          if (next >= 400) {
            clearInterval(evolutionTimer);
            return 400;
          }
          return next;
        });
      }, 50); // 50ms = 20fps, smoother animation
      
      return () => clearInterval(evolutionTimer);
    }
    // Scene 4 evolution (401-500) - "The Luminous Return"
    // Gentle pace for the return to form
    else if (evolution >= 401 && evolution < 500) {
      const evolutionTimer = setInterval(() => {
        setEvolution(prev => {
          const next = prev + 0.33;
          if (next >= 500) {
            clearInterval(evolutionTimer);
            return 500;
          }
          return next;
        });
      }, 50);
      
      return () => clearInterval(evolutionTimer);
    }
  }, [evolution]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPosition({ x, y });
    
    // Orb responsiveness
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    setOrbPulse(1 + (300 - Math.min(distance, 300)) / 600);
  };

  const handleShapeClick = (e, shapeClass) => {
    e.stopPropagation();
    const shape = e.currentTarget;
    shape.classList.add('dissolving');
    
    // Respawn after 5 seconds
    setTimeout(() => {
      shape.classList.remove('dissolving');
    }, 5000);
  };

  const triggerEvolution = () => {
    if (evolution < 100) {
      setBoundaryVisible(true);
      setInsightVisible(true);
    }
    // Scene transitions now only happen via navigation buttons, not clicks
  };

  const nextPhase = () => {
    if (evolution < 100) {
      // Immediately start Scene 1 - shapes appear, words orbit
      setEvolution(100);
    }
    // Other scene transitions are handled by specific button onClick handlers
  };

  const resetToStart = () => {
    setEvolution(0);
    setAwareness(false);
    setBoundaryVisible(false);
    setInsightVisible(false);
  };

  // Calculate evolution phases
  const isScene1 = evolution >= 100 && evolution <= 200;
  const isScene2 = evolution >= 201 && evolution <= 300;
  const isScene3 = evolution >= 301 && evolution <= 400;
  const isScene4 = evolution >= 401;
  const scene1Progress = (evolution >= 100 && evolution <= 200) ? (evolution - 100) / 100 : (evolution >= 201 ? 1 : 0);
  const scene2Progress = (evolution >= 201 && evolution <= 300) ? (evolution - 201) / 99 : (evolution >= 301 ? 1 : 0);
  const scene3Progress = (evolution >= 301 && evolution <= 400) ? (evolution - 301) / 99 : (evolution >= 401 ? 1 : 0);
  const scene4Progress = (evolution >= 401) ? (evolution - 401) / 99 : 0;
  
  // UNIFIED PROGRESS for Scene 0→1: spans Scene 0 (0→1) and Scene 1 (1→2)
  // Similar to scene2And3Progress but for the first transition
  const scene0And1Progress = (evolution >= 0 && evolution <= 100) 
    ? evolution / 100 
    : (evolution >= 100 && evolution <= 200) 
      ? 1 + (evolution - 100) / 100 
      : 2;  // Cap at 2 after Scene 1

  // UNIFIED PROGRESS: A single variable that spans Scene 2 (0→1) and Scene 3 (1→2)
  // CAPS AT 2 for Scene 4 - Scene 4 uses its own progress variable for contraction
  const scene2And3Progress = (evolution >= 200 && evolution <= 300) 
    ? (evolution - 200) / 100 
    : (evolution >= 301 && evolution <= 400) 
      ? 1 + (evolution - 300) / 100 
      : (evolution >= 401)
        ? 2  // Cap at 2 for Scene 4 - orb stays at Scene 3 end size, then contracts via scene4Progress
        : 0;

  // Splash screen
  if (!hasEntered) {
    return (
      <div className="splash-screen" onClick={enterExperience}>
        <div className="splash-content">
          <div className="splash-orb"></div>
          <h1 className="splash-title">Illusions</h1>
          <p className="splash-subtitle">Dilashma</p>
          <button className="splash-enter" onClick={enterExperience}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="scene-container"
      onMouseMove={handleMouseMove} 
      onClick={triggerEvolution}
      style={{ 
        '--scene0and1-progress': scene0And1Progress,
        '--scene2and3-progress': scene2And3Progress,
        '--scene4-progress': scene4Progress
      }}
    >
      <div className="meditative-space">
        
        {/* Atmospheric background - uses unified progress for smooth transition */}
        <div 
          className="atmospheric-bg"
          style={{
            '--scene1-progress': scene1Progress,
            '--scene2and3-progress': scene2And3Progress,
            '--scene4-progress': scene4Progress
          }}
        ></div>
        
        {/* Luminous field - visible in Scene 2, 3, and 4 */}
        {(isScene2 || isScene3 || isScene4) && (
          <div 
            className="luminous-field"
            style={{ 
              '--scene2and3-progress': scene2And3Progress,
              '--scene4-progress': scene4Progress
            }}
          ></div>
        )}
        
        {/* Floating light particles - visible in Scene 2, 3, and 4 */}
        {(isScene2 || isScene3 || isScene4) && (
          <div className="awareness-particles" style={{ 
            '--scene2and3-progress': scene2And3Progress,
            '--scene4-progress': scene4Progress
          }}>
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="light-particle"
                style={{
                  '--particle-delay': `${i * 0.3}s`,
                  '--particle-x': `${15 + (i * 17) % 70}%`,
                  '--particle-y': `${10 + (i * 23) % 80}%`,
                  '--particle-size': `${3 + (i % 4) * 2}px`,
                  '--particle-duration': `${8 + (i % 5) * 2}s`,
                  '--scene2and3-progress': scene2And3Progress
                }}
              ></div>
            ))}
          </div>
        )}
        
        {/* Central radiance - visible in Scene 2, 3, and 4 */}
        {(isScene2 || isScene3 || isScene4) && (
          <div 
            className="central-radiance"
            style={{ 
              '--scene2and3-progress': scene2And3Progress,
              '--scene4-progress': scene4Progress
            }}
          ></div>
        )}
        
        {/* Scene 0 & early Scene 1: Pre-geometry particles and soft elements */}
        {/* Stays visible into Scene 1, fades out gradually */}
        {evolution < 200 && (
          <div 
            className="primordial-field"
            style={{
              '--scene1-progress': scene1Progress,
              opacity: 1 - scene1Progress
            }}
          >
            {/* Soft breathing particles */}
            <div className="particle" style={{top: '20%', left: '15%', animationDelay: '0s'}}></div>
            <div className="particle" style={{top: '60%', left: '80%', animationDelay: '-2s'}}></div>
            <div className="particle" style={{top: '40%', left: '70%', animationDelay: '-4s'}}></div>
            <div className="particle" style={{top: '80%', left: '30%', animationDelay: '-1s'}}></div>
            <div className="particle" style={{top: '25%', left: '85%', animationDelay: '-3s'}}></div>
            <div className="particle" style={{top: '70%', left: '10%', animationDelay: '-5s'}}></div>
            
            {/* Soft gradients floating */}
            <div className="gradient-blob blob-1"></div>
            <div className="gradient-blob blob-2"></div>
            <div className="gradient-blob blob-3"></div>
          </div>
        )}

        {/* External world shapes - uses unified progress for Scene 2→3→4 */}
        <div 
          className={`external-world ${evolution >= 100 ? 'shapes-awakened' : ''}`}
          style={{ 
            '--scene2and3-progress': scene2And3Progress,
            '--scene4-progress': scene4Progress
          }}
        >
          {/* Shapes - emerge from orb, dissolve in Scene 3, re-emerge in Scene 4 */}
          {evolution >= 100 && (
            <>
          <div className="shape triangle birth-from-orb" style={{'--duration': '20s', '--delay': '0s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '0s'}}></div>
          <div className="shape circle birth-from-orb" style={{'--duration': '25s', '--delay': '-2s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '0.5s'}}></div>
          <div className="shape square birth-from-orb" style={{'--duration': '30s', '--delay': '-4s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '1s'}}></div>
          <div className="shape diamond birth-from-orb" style={{'--duration': '22s', '--delay': '-1s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '0.3s'}}></div>
          <div className="shape pentagon birth-from-orb" style={{'--duration': '28s', '--delay': '-6s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '1.5s'}}></div>
          <div className="shape star birth-from-orb" style={{'--duration': '26s', '--delay': '-3s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '0.8s'}}></div>
          <div className="shape hexagon birth-from-orb" style={{'--duration': '35s', '--delay': '-5s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '1.3s'}}></div>
          <div className="shape octagon birth-from-orb" style={{'--duration': '32s', '--delay': '-7s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '1.8s'}}></div>
          <div className="shape crescent birth-from-orb" style={{'--duration': '24s', '--delay': '-1.5s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '0.2s'}}></div>
          <div className="shape ellipse birth-from-orb" style={{'--duration': '29s', '--delay': '-4.5s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '2s'}}></div>
          <div className="shape trapezoid birth-from-orb" style={{'--duration': '31s', '--delay': '-8s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '1.6s'}}></div>
          <div className="shape rhombus birth-from-orb" style={{'--duration': '27s', '--delay': '-2.5s', '--birth-progress': scene1Progress, '--scene2and3-progress': scene2And3Progress, '--scene4-progress': scene4Progress, '--fade-delay': '0.6s'}}></div>
            </>
          )}
        </div>
        

        
        {/* Central orb - uses unified progress for smooth Scene 0→1→2→3→4 */}
        <div 
          className={`inner-orb ${evolution < 100 ? 'primordial-state' : ''} ${evolution === 100 ? 'consciousness-flash' : ''} ${awareness ? 'aware' : ''}`}
          style={{ 
            '--scene0and1-progress': scene0And1Progress,
            '--scene2and3-progress': scene2And3Progress, 
            '--scene1-progress': scene1Progress,
            '--scene4-progress': scene4Progress
          }}
        >
          <div 
            className="consciousness-core"
            style={{ 
              '--scene0and1-progress': scene0And1Progress,
              '--scene2and3-progress': scene2And3Progress, 
              '--scene1-progress': scene1Progress,
              '--scene4-progress': scene4Progress
            }}
          >
            {/* Perception layer - visible in Scene 2 and 3 */}
            {(isScene2 || isScene3) && (
              <div 
                className="perception-layer"
                style={{ 
                  '--scene2and3-progress': scene2And3Progress
                }}
              >
                
                {/* Ambient sparkles inside the orb */}
                <div 
                  className="inner-sparkles" 
                  style={{ '--scene2and3-progress': scene2And3Progress }}
                >
                  <div className="sparkle" style={{ top: '20%', left: '30%', '--sparkle-delay': '0s' }}></div>
                  <div className="sparkle" style={{ top: '60%', left: '70%', '--sparkle-delay': '0.5s' }}></div>
                  <div className="sparkle" style={{ top: '40%', left: '50%', '--sparkle-delay': '1s' }}></div>
                  <div className="sparkle" style={{ top: '75%', left: '25%', '--sparkle-delay': '1.5s' }}></div>
                  <div className="sparkle" style={{ top: '30%', left: '80%', '--sparkle-delay': '2s' }}></div>
                  <div className="sparkle" style={{ top: '85%', left: '55%', '--sparkle-delay': '0.3s' }}></div>
                  <div className="sparkle" style={{ top: '15%', left: '60%', '--sparkle-delay': '0.8s' }}></div>
                  <div className="sparkle" style={{ top: '50%', left: '15%', '--sparkle-delay': '1.2s' }}></div>
                </div>
                
                {/* Internal duplicate shapes - ALWAYS rendered from Scene 2 start */}
                <div className="perception-shape triangle transformed internal-duplicate" style={{ '--delay': '0s', '--duration': '20s', '--stagger-delay': '0s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape circle transformed internal-duplicate" style={{ '--delay': '-2s', '--duration': '25s', '--stagger-delay': '0.5s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape square transformed internal-duplicate" style={{ '--delay': '-4s', '--duration': '30s', '--stagger-delay': '1s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape diamond transformed internal-duplicate" style={{ '--delay': '-1s', '--duration': '22s', '--stagger-delay': '0.3s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape pentagon transformed internal-duplicate" style={{ '--delay': '-6s', '--duration': '28s', '--stagger-delay': '1.5s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape star transformed internal-duplicate" style={{ '--delay': '-3s', '--duration': '26s', '--stagger-delay': '0.8s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape hexagon transformed internal-duplicate" style={{ '--delay': '-5s', '--duration': '35s', '--stagger-delay': '1.3s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape octagon transformed internal-duplicate" style={{ '--delay': '-7s', '--duration': '32s', '--stagger-delay': '1.8s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape crescent transformed internal-duplicate" style={{ '--delay': '-1.5s', '--duration': '24s', '--stagger-delay': '0.2s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape ellipse transformed internal-duplicate" style={{ '--delay': '-4.5s', '--duration': '29s', '--stagger-delay': '2s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape trapezoid transformed internal-duplicate" style={{ '--delay': '-8s', '--duration': '31s', '--stagger-delay': '1.6s', '--scene2and3-progress': scene2And3Progress }}></div>
                <div className="perception-shape rhombus transformed internal-duplicate" style={{ '--delay': '-2.5s', '--duration': '27s', '--stagger-delay': '0.6s', '--scene2and3-progress': scene2And3Progress }}></div>
                
                {/* Absorbed perfect shapes - ALWAYS rendered, visibility controlled by progress */}
                <div className="perception-shape triangle transformed absorbed-perfect" style={{ '--delay': '0s', '--duration': '18s', '--scene2and3-progress': scene2And3Progress, top: '12%', left: '32%' }}></div>
                <div className="perception-shape diamond transformed absorbed-perfect" style={{ '--delay': '-1s', '--duration': '20s', '--scene2and3-progress': scene2And3Progress, top: '68%', left: '72%' }}></div>
                <div className="perception-shape octagon transformed absorbed-perfect" style={{ '--delay': '-2s', '--duration': '22s', '--scene2and3-progress': scene2And3Progress, top: '38%', left: '18%' }}></div>
                <div className="perception-shape circle transformed absorbed-perfect" style={{ '--delay': '-2s', '--duration': '24s', '--scene2and3-progress': scene2And3Progress, top: '22%', left: '68%' }}></div>
                <div className="perception-shape pentagon transformed absorbed-perfect" style={{ '--delay': '-3s', '--duration': '26s', '--scene2and3-progress': scene2And3Progress, top: '82%', left: '45%' }}></div>
                <div className="perception-shape hexagon transformed absorbed-perfect" style={{ '--delay': '-4s', '--duration': '28s', '--scene2and3-progress': scene2And3Progress, top: '55%', left: '8%' }}></div>

              </div>
            )}
            

          </div>
          <div className="awareness-ripples"></div>
        </div>
        
        {/* Boundary marker - appears at start of Scene 1 and fades in gradually via progress */}
        {(isScene1 || isScene2 || isScene3) && (
          <div 
            className="boundary-marker circular visible"
            style={{ 
              '--scene1-progress': scene1Progress,
              '--scene2and3-progress': scene2And3Progress
            }}
          ></div>
        )}
        

        
        {/* Scene 3 text - progressive reveal */}
        {(isScene2 || isScene3) && ((
          () => {
            const scene3Text = scene2And3Progress < 1.1 
              ? "" 
              : scene2And3Progress < 1.45 
                ? "There was never a boundary." 
                : scene2And3Progress < 1.8
                  ? "There is no self, no other."
                  : "So what remains?";
            return (
              <div 
                className="world-emptiness" 
                style={{ '--scene2and3-progress': scene2And3Progress }}
              >
                <div className="emptiness-text" key={scene3Text}>
                  {scene3Text}
                </div>
              </div>
            );
          }
        )())}
        
        {/* Insight text - progressive reveal per scene */}
        {(() => {
          const insightText = 
            /* Scene 4 - Emptiness */
            scene4Progress > 0.7
              ? "This"
              : scene4Progress >= 0.3
              ? "And emptiness appearing as everything you thought was separate."
              : isScene4
              ? "Emptiness."
            
            /* Scene 2 - Dream analogy */
            : isScene2 && scene2Progress > 0.65
              ? "Two sides of the same experience."
              : isScene2 && scene2Progress > 0.35
              ? "But like in dreams, you never touch what seems external—only mind's constructions."
              : isScene2
              ? "You think you're seeing the world."
            
            /* Scene 1 - Duality assumption */
            : isScene1 && scene1Progress > 0.5 
              ? "...and the world around you is the other that gets observed."
              : isScene1
              ? "You think you are the self that observes..."
            
            /* Scene 0 - Opening questions */
            : insightVisible
              ? "Where is the boundary?"
              : "Where does the observer end and the observed begin?";
          
          return (
            <div 
              className={`insight-text ${insightVisible || evolution < 100 ? 'revealed' : ''}`}
              style={{
                '--scene2and3-progress': scene2And3Progress,
                '--scene4-progress': scene4Progress,
                opacity: evolution < 100 || insightVisible || isScene1 || isScene2 || isScene4 ? 0.9 : 0
              }}
            >
              <p key={insightText}>
                {insightText}
              </p>
            </div>
          );
        })()}
        
        {/* Navigation */}
        {evolution < 100 && boundaryVisible && (
          <button onClick={nextPhase} className="scene-nav-button next">
            Look Closer →
          </button>
        )}
        
        {evolution === 200 && (
          <button onClick={() => setEvolution(201)} className="scene-nav-button next">
            Look Within →
          </button>
        )}
        
        {evolution === 300 && (
          <button onClick={() => setEvolution(301)} className="scene-nav-button next">
            Let Go →
          </button>
        )}
        
        {evolution === 400 && (
          <button onClick={() => setEvolution(401)} className="scene-nav-button next">
            See What Remains →
          </button>
        )}
        
        {evolution >= 500 && (
          <button onClick={resetToStart} className="scene-nav-button reset">
            ↻ Remember Again
          </button>
        )}
        
      </div>
    </div>
  );
}