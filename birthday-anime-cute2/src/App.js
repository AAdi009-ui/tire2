import React, { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTeddy, setShowTeddy] = useState(false);
  const [showDecorations, setShowDecorations] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [theme, setTheme] = useState('pink'); // default theme
  const [flipped, setFlipped] = useState([false, false, false]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isGluePlaying, setIsGluePlaying] = useState(false);

  const audioRef = useRef(null);
  const glueAudioRef = useRef(null);

  const welcomeMessages = useMemo(() => {
    if (!recipientName) return [];
    return [
      {
        text: `✨ To the incredible ${recipientName} ✨`,
        type: "title"
      },
      {
        text: "On your special day,",
        type: "message"
      },
      {
        text: "May it be filled with moments",
        type: "message"
      },
      {
        text: "as bright and beautiful as you are.",
        type: "message"
      },
      {
        text: "Wishing you success, joy, and endless possibilities.",
        type: "message"
      },
      {
        text: "Let the celebrations begin! 🎉",
        type: "highlight"
      }
    ];
  }, [recipientName]);

  // Poetry/greetings for the back of each card
  const momentPoems = [
    "May your cake be sweet, your laughter bright,\nA year of joy from morning to night!",
    "Gifts of love and memories new,\nCountless reasons to celebrate you!",
    "Dreams that sparkle, hopes that soar,\nEndless magic, forevermore!",
    `Happy Birthday, Shreya!\nWishing you a day filled with happiness and a year full of success.\nYou're smart, kind, and truly amazing—never stop shining!\nKeep exploring the wonders of science and keep being the awesome person you are.\nHave a fantastic birthday! 🎂\n\n— Minato (The Yellow Flash)`
  ];

  // Card front content
  const momentFronts = [
    { icon: "🎂", text: "Another year of amazing memories" },
    { icon: "🎁", text: "Countless reasons to celebrate" },
    { icon: "✨", text: "Endless possibilities ahead" },
    { icon: "⚡", text: "Blessings by Minato (The Yellow Flash)" }
  ];

  // Function to toggle music
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play();
        setIsMusicPlaying(true);
      }
    }
  };

  // Function to toggle glue song
  const toggleGlueMusic = () => {
    if (glueAudioRef.current) {
      if (isGluePlaying) {
        glueAudioRef.current.pause();
        setIsGluePlaying(false);
      } else {
        glueAudioRef.current.play();
        setIsGluePlaying(true);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Play background music on authentication
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(error => console.log("Autoplay prevented:", error));
      }

      const welcomeSequenceDuration = 2000 * welcomeMessages.length + 4000; // Message delay * num messages + buffer

      const decorationsTimer = setTimeout(() => {
        setShowDecorations(true);
      }, 500);

      const teddyTimer = setTimeout(() => {
        setShowTeddy(true);
      }, 1000);

      const messageTimer = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          if (prevIndex >= welcomeMessages.length - 1) {
            clearInterval(messageTimer);
            setShowConfetti(true);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 2000); // SLOWER: 2 seconds per message

      const finalTimer = setTimeout(() => {
        setShowWelcome(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0; // Rewind for next time
        }
      }, welcomeSequenceDuration);

      return () => {
        clearInterval(messageTimer);
        clearTimeout(finalTimer);
        clearTimeout(teddyTimer);
        clearTimeout(decorationsTimer);
        if (audioRef.current) {
           audioRef.current.pause();
        }
      };
    }
  }, [isAuthenticated, showWelcome, welcomeMessages.length, welcomeMessages]); // Added welcomeMessages as dependency

  // Play glue song when welcome overlay is dismissed
  useEffect(() => {
    if (!showWelcome && isAuthenticated) {
      // Pause birthday song
      if (audioRef.current) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      }
      // Play glue song
      if (glueAudioRef.current) {
        glueAudioRef.current.play().then(() => setIsGluePlaying(true)).catch(() => {});
      }
    } else {
      // Pause glue song if not on main page
      if (glueAudioRef.current) {
        glueAudioRef.current.pause();
        setIsGluePlaying(false);
      }
    }
  }, [showWelcome, isAuthenticated]);

  const handleLogin = () => {
    const lowerPassword = password.toLowerCase();
    if (lowerPassword === 'cats') {
      setRecipientName('Shreya');
      setTheme('pink');
      setIsAuthenticated(true);
    } else if (lowerPassword === 'aunty') {
      setRecipientName('Tejas');
      setTheme('blue');
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className={`birthday-bg ${theme}-theme`}>
       <audio ref={audioRef} src={`${process.env.PUBLIC_URL}/birthday_song.mp3`} loop />
       <audio ref={glueAudioRef} src={`${process.env.PUBLIC_URL}/glue_song.mp3`} loop />
      {!isAuthenticated ? (
        <div className="password-screen">
          <h2>Enter Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Enter</button>
        </div>
      ) : (
        <>
          {showWelcome && (
            <div className="welcome-overlay">
              {showDecorations && (
                <>
                  <div className="decoration star1">⭐</div>
                  <div className="decoration star2">⭐</div>
                  <div className="decoration heart1">💖</div>
                  <div className="decoration heart2">💖</div>
                  <div className="decoration sparkle1">✨</div>
                  <div className="decoration sparkle2">✨</div>
                </>
              )}
              <div className="welcome-content">
                <div className="happy-birthday-title">🎉 Happy Birthday! 🎉</div>
                <div className="music-toggle-btn-wrapper">
                  <button className="music-toggle-btn" onClick={toggleMusic} title={isMusicPlaying ? 'Pause Music' : 'Play Music'}>
                    {isMusicPlaying ? '🎵 Pause Music' : '🎵 Play Music'}
                  </button>
                </div>
                {welcomeMessages.slice(0, currentMessageIndex + 1).map((msg, index) => (
                  <div
                    key={index}
                    className={`welcome-message ${msg.type} ${index === currentMessageIndex ? 'active' : ''}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {showTeddy && (
                  <div className="teddy-container">
                    <div className="teddy">
                      <div className="teddy-face">
                        <div className="teddy-eyes">
                          <div className="teddy-eye left"></div>
                          <div className="teddy-eye right"></div>
                        </div>
                        <div className="teddy-nose"></div>
                        <div className="teddy-mouth"></div>
                      </div>
                      <div className="teddy-ears">
                        <div className="teddy-ear left"></div>
                        <div className="teddy-ear right"></div>
                      </div>
                      <div className="teddy-bow"></div>
                    </div>
                  </div>
                )}
                {showConfetti && (
                  <div className="confetti-container">
                    {[...Array(30)].map((_, i) => (
                      <div key={i} className="confetti" style={{
                        '--delay': `${Math.random() * 2}s`,
                        '--x': `${Math.random() * 100}vw`,
                        '--color': `hsl(${Math.random() * 360}, 100%, 50%)`
                      }} />
                    ))}
                  </div>
                )}
                {showConfetti && (
                  <button className="continue-btn" onClick={() => setShowWelcome(false)}>
                    Continue
                  </button>
                )}
              </div>
            </div>
          )}
          {!showWelcome && (
            <div className="main-content">
              <header className="birthday-header">
                <h1>{`🎀 Happy Birthday, ${recipientName}! 🎀`}</h1>
                <p className="subtitle">Wishing you a day as magical as your favorite book! 💕</p>
              </header>
              <div className="music-toggle-btn-wrapper">
                <button className="music-toggle-btn" onClick={toggleGlueMusic} title={isGluePlaying ? 'Pause Music' : 'Play Music'}>
                  {isGluePlaying ? '🎵 Pause Music' : '🎵 Play Music'} (Glue Song)
                </button>
              </div>
              <section className="birthday-highlights">
                <h2 className="section-title">💖 Birthday Blessings 💖</h2>
                <div className="moment-grid simple-grid">
                  {momentFronts.map((front, idx) => (
                    <div
                      key={idx}
                      className={`moment-card flip-card${flipped[idx] ? ' flipped' : ''}`}
                      onClick={() => setFlipped(f => {
                        // Expand flipped array if needed
                        if (f.length < momentFronts.length) {
                          return Array(momentFronts.length).fill(false).map((v, i) => i === idx ? !v : v);
                        }
                        return f.map((v, i) => i === idx ? !v : v);
                      })}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          <span className="moment-icon">{front.icon}</span>
                          <div className="moment-text">{front.text}</div>
                        </div>
                        <div className="flip-card-back">
                          <div className="moment-poem">{momentPoems[idx]}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="gallery">
                <h2 className="section-title">🌸 Cherished Memories 🌸</h2>
                <div className="gallery-grid simple-grid">
                  <div className="gallery-item simple-card">
                    <img className="gallery-img real-photo" src={process.env.PUBLIC_URL + '/memories/memory1.jpg'} alt="Memory 1" />
                  </div>
                  <div className="gallery-item simple-card">
                    <img className="gallery-img real-photo" src={process.env.PUBLIC_URL + '/memories/memory2.jpg'} alt="Memory 2" />
                  </div>
                  <div className="gallery-item simple-card">
                    <img className="gallery-img real-photo" src={process.env.PUBLIC_URL + '/memories/memory3.jpg'} alt="Memory 3" />
                  </div>
                </div>
              </section>

              <section className="birthday-wishes">
                <div className="wish-card">
                  <h2>💌 Birthday Wishes 💌</h2>
                  <p className="wish-message">
                    May your day be filled with joy, laughter, and all the things that make you smile.
                    You deserve all the happiness in the world!
                  </p>
                  <div className="wish-blessing blessing1">
                    <div className="wish-blessing-label">Blessings by Minato (The Yellow Flash)</div>
                    <div className="wish-blessing-message">
                      Happy Birthday, Shreya!<br/>
                      Wishing you a day filled with happiness and a year full of success.<br/>
                      You're smart, kind, and truly amazing—never stop shining!<br/>
                      Keep exploring the wonders of science and keep being the awesome person you are.<br/>
                      Have a fantastic birthday! 🎂
                    </div>
                  </div>
                  <div className="wish-blessing blessing2">
                    <div className="wish-blessing-message">
                      Hey shreya 💗. Happy Birthday to you.🌟  Cutiee, I wish you best for your new age. And achieve the things you like. 🤍✨. Just wishing for your best 🥰. HAPPY BIRTHDAY AGAIN 🎉 🎉. LOVE YOU ❤️
                    </div>
                    <div className="wish-blessing-sender">— pervi sketch aka prachi</div>
                  </div>
                  <div className="wish-blessing blessing3">
                    <div className="wish-blessing-message">
                      Happy birthday to you, Shreya,<br/>
                      May your dreams shine bright like stars above,<br/>
                      Wrapped in joy, laughter, and endless love.
                    </div>
                    <div className="wish-blessing-sender">— anonymous aka spidey</div>
                  </div>
                  <div className="wish-blessing blessing4">
                    <div className="wish-blessing-message">
                      Happy Birthday my dear little spiritual cupcake 💖✨<br/>
                      I hope you enjoy the day 🥰<br/>
                      I'm waiting for your birthday party 🥳 🎉<br/>
                      (And marriage invitation too🥳🎉🥰)
                    </div>
                    <div className="wish-blessing-sender">— otaku aka ascender grey</div>
                  </div>
                  <div className="wish-blessing blessing5">
                    <div className="wish-blessing-message">
                      Happiest birthday shreya🎂🍫<br/>
                      May God fullfill your life with cutie kitties🫡🐈<br/>
                      May God give you lots of money so you can give me birthday party😑❤️
                    </div>
                    <div className="wish-blessing-sender">— supering aka tejas</div>
                  </div>
                </div>
              </section>

              <footer className="footer">
                Made by Aadi
              </footer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
