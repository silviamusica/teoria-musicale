// Variabili globali
var currentLevel = 1;
var currentMode = 'theory';
var currentAnswer = '';

var exerciseCount = 0;
var exerciseTotal = 10;
var exerciseScore = 0;

// Array per tenere traccia delle domande già fatte per ogni livello
var usedQuestions = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
};

// Array per tenere traccia delle domande sbagliate per ogni livello
var wrongQuestions = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
};
var audioContext = null;

// Variabili per il livello 4 (scale)
var currentScale = [];
var playedNotes = [];
var expectedScale = [];

// Frequenze delle note
var noteFrequencies = {
    'Do': 261.63, 'Do#': 277.18, 'Re': 293.66, 'Re#': 311.13,
    'Mi': 329.63, 'Fa': 349.23, 'Fa#': 369.99, 'Sol': 392.00,
    'Sol#': 415.30, 'La': 440.00, 'La#': 466.16, 'Si': 493.88,
    // Seconda ottava (frequenze raddoppiate)
    'Do2': 523.25, 'Do#2': 554.37, 'Re2': 587.33, 'Re#2': 622.25,
    'Mi2': 659.25, 'Fa2': 698.46, 'Fa#2': 739.99, 'Sol2': 783.99,
    'Sol#2': 830.61, 'La2': 880.00, 'La#2': 932.33, 'Si2': 987.77,
    // Terza ottava (Do finale)
    'Do3': 1046.50,
    // Note alterate con bemolli
    'Re♭': 277.18, 'Mi♭': 311.13, 'Sol♭': 369.99, 'La♭': 415.30, 'Si♭': 466.16,
    // Note alterate doppie
    'Do##': 293.66, 'Fa##': 415.30, 'Si♭♭': 415.30, 'Mi♭♭': 277.18,
    // Note alterate aggiuntive per le nuove tonalità
    'Mi#': 369.99, 'Si#': 554.37, 'Fa♭': 329.63,
    // Note alterate per le tonalità enarmoniche
    'Sol#': 415.30, 'Re#': 311.13, 'Si♭♭': 415.30, 'Mi♭♭': 277.18,
    // Note alterate per le tonalità complesse
    'Sol# maggiore': 415.30, 'Re# maggiore': 311.13,
    // Note alterate per le scale
    'Fa♭': 329.63, 'Sol♭': 369.99, 'Do♭': 277.18
};

// Scale maggiori - solo quelle richieste per il livello 4
var majorScales = {
    'Do': ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Do'],
    'Sol': ['Sol', 'La', 'Si', 'Do', 'Re', 'Mi', 'Fa#', 'Sol'],
    'Re': ['Re', 'Mi', 'Fa#', 'Sol', 'La', 'Si', 'Do#', 'Re'],
    'Fa': ['Fa', 'Sol', 'La', 'Si♭', 'Do', 'Re', 'Mi', 'Fa'],
    'Si♭': ['Si♭', 'Do', 'Re', 'Mi♭', 'Fa', 'Sol', 'La', 'Si♭'],
    'La': ['La', 'Si', 'Do#', 'Re', 'Mi', 'Fa#', 'Sol#', 'La'],
    'Mi': ['Mi', 'Fa#', 'Sol#', 'La', 'Si', 'Do#', 'Re#', 'Mi'],
    'Si': ['Si', 'Do#', 'Re#', 'Mi', 'Fa#', 'Sol#', 'La#', 'Si'],
    'Mi♭': ['Mi♭', 'Fa', 'Sol', 'La♭', 'Si♭', 'Do', 'Re', 'Mi♭'],
    'La♭': ['La♭', 'Si♭', 'Do', 'Re♭', 'Mi♭', 'Fa', 'Sol', 'La♭'],
    'Re♭': ['Re♭', 'Mi♭', 'Fa', 'Sol♭', 'La♭', 'Si♭', 'Do', 'Re♭'],
    'Do#': ['Do#', 'Re#', 'Mi#', 'Fa#', 'Sol#', 'La#', 'Si#', 'Do#'],
    'Fa#': ['Fa#', 'Sol#', 'La#', 'Si', 'Do#', 'Re#', 'Mi#', 'Fa#'],
    'Sol♭': ['Sol♭', 'La♭', 'Si♭', 'Do♭', 'Re♭', 'Mi♭', 'Fa', 'Sol♭']
};

// Tonalità e alterazioni in chiave per il livello 5
var keySignatures = {
    'Do maggiore': { alterations: 'nessuna alterazione', sharps: 0, flats: 0, notes: [] },
    'Sol maggiore': { alterations: '1 diesis: Fa#', sharps: 1, flats: 0, notes: ['Fa#'] },
    'Re maggiore': { alterations: '2 diesis: Fa#, Do#', sharps: 2, flats: 0, notes: ['Fa#', 'Do#'] },
    'La maggiore': { alterations: '3 diesis: Fa#, Do#, Sol#', sharps: 3, flats: 0, notes: ['Fa#', 'Do#', 'Sol#'] },
    'Mi maggiore': { alterations: '4 diesis: Fa#, Do#, Sol#, Re#', sharps: 4, flats: 0, notes: ['Fa#', 'Do#', 'Sol#', 'Re#'] },
    'Si maggiore': { alterations: '5 diesis: Fa#, Do#, Sol#, Re#, La#', sharps: 5, flats: 0, notes: ['Fa#', 'Do#', 'Sol#', 'Re#', 'La#'] },
    'Fa# maggiore': { alterations: '6 diesis: Fa#, Do#, Sol#, Re#, La#, Mi#', sharps: 6, flats: 0, notes: ['Fa#', 'Do#', 'Sol#', 'Re#', 'La#', 'Mi#'] },
    'Do# maggiore': { alterations: '7 diesis: Fa#, Do#, Sol#, Re#, La#, Mi#, Si#', sharps: 7, flats: 0, notes: ['Fa#', 'Do#', 'Sol#', 'Re#', 'La#', 'Mi#', 'Si#'] },
    'Fa maggiore': { alterations: '1 bemolle: Si♭', sharps: 0, flats: 1, notes: ['Si♭'] },
    'Si♭ maggiore': { alterations: '2 bemolli: Si♭, Mi♭', sharps: 0, flats: 2, notes: ['Si♭', 'Mi♭'] },
    'Mi♭ maggiore': { alterations: '3 bemolli: Si♭, Mi♭, La♭', sharps: 0, flats: 3, notes: ['Si♭', 'Mi♭', 'La♭'] },
    'La♭ maggiore': { alterations: '4 bemolli: Si♭, Mi♭, La♭, Re♭', sharps: 0, flats: 4, notes: ['Si♭', 'Mi♭', 'La♭', 'Re♭'] },
    'Re♭ maggiore': { alterations: '5 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭', sharps: 0, flats: 5, notes: ['Si♭', 'Mi♭', 'La♭', 'Re♭', 'Sol♭'] },
    'Sol♭ maggiore': { alterations: '6 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭, Do♭', sharps: 0, flats: 6, notes: ['Si♭', 'Mi♭', 'La♭', 'Re♭', 'Sol♭', 'Do♭'] },
    'Do♭ maggiore': { alterations: '7 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭, Do♭, Fa♭', sharps: 0, flats: 7, notes: ['Si♭', 'Mi♭', 'La♭', 'Re♭', 'Sol♭', 'Do♭', 'Fa♭'] }
};

// Tonalità enarmoniche per il livello 6
var enharmonicKeys = {
    'Do♭ maggiore': { enharmonic: 'Si maggiore', reason: 'Do♭ ha 7 ♭, Si ha 5 #', complexity: 'high' },
    'Do♯ maggiore': { enharmonic: 'Re♭ maggiore', reason: 'Do♯ ha 7 #, Re♭ ha 5 ♭', complexity: 'high' },
    'Fa♯ maggiore': { enharmonic: 'Sol♭ maggiore', reason: 'Fa♯ ha 6 #, Sol♭ ha 6 ♭', complexity: 'medium' },
    'Si maggiore': { enharmonic: 'Do♭ maggiore', reason: 'Si ha 5 #, Do♭ ha 7 ♭', complexity: 'low' },
    'Re♭ maggiore': { enharmonic: 'Do♯ maggiore', reason: 'Re♭ ha 5 ♭, Do♯ ha 7 #', complexity: 'low' },
    'Sol♭ maggiore': { enharmonic: 'Fa♯ maggiore', reason: 'Sol♭ ha 6 ♭, Fa♯ ha 6 #', complexity: 'low' },
    'La♭ maggiore': { enharmonic: 'Sol# maggiore', reason: 'La♭ ha 4 ♭, Sol# ha 8 #', complexity: 'medium' },
    'Mi♭ maggiore': { enharmonic: 'Re# maggiore', reason: 'Mi♭ ha 3 ♭, Re# ha 9 #', complexity: 'medium' },
    'La maggiore': { enharmonic: 'Si♭♭ maggiore', reason: 'La ha 3 #, Si♭♭ ha 9 ♭', complexity: 'medium' },
    'Re maggiore': { enharmonic: 'Mi♭♭ maggiore', reason: 'Re ha 2 #, Mi♭♭ ha 10 ♭', complexity: 'medium' }
};

// Inizializzazione audio
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Crea il nodo di guadagno per il controllo del volume
        audioContext.gainNode = audioContext.createGain();
        audioContext.gainNode.connect(audioContext.destination);
        
        // Imposta il volume iniziale al 20%
        audioContext.gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        
        // Aggiorna il controllo del volume per riflettere il valore iniziale
        var volumeControl = document.getElementById('volume-control');
        if (volumeControl) {
            volumeControl.value = 20;
        }
    }
    
    // Aggiorna sempre il volume dal controllo
    var volumeControl = document.getElementById('volume-control');
    if (volumeControl && audioContext && audioContext.gainNode) {
        var volume = volumeControl.value / 100;
        audioContext.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }
}

// Riproduzione suono
function playSound(note) {
    initAudio();
    
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    var frequency = noteFrequencies[note];
    if (!frequency) return;
    
    try {
        var oscillator = audioContext.createOscillator();
        
        oscillator.connect(audioContext.gainNode);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        // Gestione silenziosa degli errori audio
    }
}

// Aggiornamento sezione attiva
function updateSection() {
    var sections = document.querySelectorAll('.section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
    
    var sectionId = 'level-' + currentLevel + '-' + currentMode;
    var section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Se si passa alla modalità pratica, avvia automaticamente gli esercizi
    if (currentMode === 'practice') {
        // Resetta lo stato degli esercizi
        exerciseCount = 0;
        exerciseScore = 0;
        exerciseTotal = 10; // Default
        
        // Nascondi il pulsante Gioca per i livelli 1 e 2
        if (currentLevel === 1 || currentLevel === 2) {
            var playButton = document.getElementById('new-exercise-' + currentLevel);
            if (playButton) {
                playButton.style.display = 'none';
            }
        }
        
        // Avvia automaticamente gli esercizi per il livello corrente
        setTimeout(function() {
            if (currentLevel === 1) {
                generateNextQuestion();
            } else if (currentLevel === 2) {
                generateNextQuestionLevel2();
            } else if (currentLevel === 3) {
                generateNextIntervalQuestion();
            } else if (currentLevel === 4) {
                generateNextScaleQuestion();
            } else if (currentLevel === 5) {
                generateNextTonalityQuestion();
            } else if (currentLevel === 6) {
                generateNextEnharmonicQuestion();
            }
        }, 100);
    }
}

// Gestione click sui tasti
function handleKeyClick(element) {
    var note = element.getAttribute('data-note');
    
    element.classList.add('pressed');
    setTimeout(function() {
        element.classList.remove('pressed');
    }, 200);
    
    playSound(note);
    
    if (element.classList.contains('practice-key')) {
        if (currentLevel === 4 && expectedScale.length > 0) {
            handleScaleNote(note);
        } else if (currentLevel !== 4 && currentAnswer) {
            checkAnswer(note);
        }
    }
}

// Normalizzazione note enarmoniche
function normalizeOctave(note) {
    // Normalizza solo le ottave (rimuove SOLO i numeri, mantiene ♭ e ♯)
    var noteWithoutOctave = note.replace(/[0-9]/g, '');
    
    console.log('Nota originale:', note, '-> Nota senza ottava:', noteWithoutOctave);
    console.log('Simboli ♭ e ♯ preservati:', noteWithoutOctave.includes('♭') || noteWithoutOctave.includes('♯'));
    
    return noteWithoutOctave;
}

// Funzione per ottenere l'equivalente enarmonico di una nota
function getEnharmonicEquivalent(note) {
    var enharmonicMap = {
        'La♭': 'Sol#',
        'Si♭': 'La#',
        'Do♭': 'Si',
        'Re♭': 'Do#',
        'Mi♭': 'Re#',
        'Fa♭': 'Mi',
        'Sol♭': 'Fa#'
    };
    
    return enharmonicMap[note] || note;
}

// Funzione per ottenere le note accettate per ogni scala specifica
function getAcceptedNotesForScale(scaleName) {
    var scaleNoteMap = {
        // Scale senza alterazioni
        'Do': {
            'Do': ['Do'], 'Re': ['Re'], 'Mi': ['Mi'], 'Fa': ['Fa'], 
            'Sol': ['Sol'], 'La': ['La'], 'Si': ['Si']
        },
        
        // Scale con diesis - accetta solo diesis
        'Sol': {
            'Sol': ['Sol'], 'La': ['La'], 'Si': ['Si'], 'Do': ['Do'], 
            'Re': ['Re'], 'Mi': ['Mi'], 'Fa#': ['Fa#']
        },
        'Re': {
            'Re': ['Re'], 'Mi': ['Mi'], 'Fa#': ['Fa#'], 'Sol': ['Sol'], 
            'La': ['La'], 'Si': ['Si'], 'Do#': ['Do#']
        },
        'Fa#': {
            'Fa#': ['Fa#'], 'Sol#': ['Sol#'], 'La#': ['La#'], 'Si': ['Si'], 
            'Do#': ['Do#'], 'Re#': ['Re#'], 'Mi#': ['Mi#', 'Fa']
        },
        'Do#': {
            'Do#': ['Do#'], 'Re#': ['Re#'], 'Mi#': ['Fa'], 'Fa#': ['Fa#'], 
            'Sol#': ['Sol#'], 'La#': ['La#'], 'Si#': ['Do']
        },
        'Sol#': {
            'Sol#': ['Sol#'], 'La#': ['La#'], 'Si': ['Si'], 'Do#': ['Do#'], 
            'Re#': ['Re#'], 'Mi#': ['Fa'], 'Fa#': ['Fa#']
        },
        
        // Scale con bemolli - accetta sia bemolli che equivalenti diesis
        'Fa': {
            'Fa': ['Fa'], 'Sol': ['Sol'], 'La': ['La'], 'Si♭': ['Si♭', 'La#'], 
            'Do': ['Do'], 'Re': ['Re'], 'Mi': ['Mi']
        },
        'Si♭': {
            'Si♭': ['Si♭', 'La#'], 'Do': ['Do'], 'Re': ['Re'], 'Mi♭': ['Mi♭', 'Re#'], 
            'Fa': ['Fa'], 'Sol': ['Sol'], 'La': ['La']
        },
        'Mi♭': {
            'Mi♭': ['Mi♭', 'Re#'], 'Fa': ['Fa'], 'Sol': ['Sol'], 'La♭': ['La♭', 'Sol#'], 
            'Si♭': ['Si♭', 'La#'], 'Do': ['Do'], 'Re': ['Re']
        },
        'La♭': {
            'La♭': ['La♭', 'Sol#'], 'Si♭': ['Si♭', 'La#'], 'Do': ['Do'], 'Re♭': ['Re♭', 'Do#'], 
            'Mi♭': ['Mi♭', 'Re#'], 'Fa': ['Fa'], 'Sol': ['Sol']
        },
        'Re♭': {
            'Re♭': ['Re♭', 'Do#'], 'Mi♭': ['Mi♭', 'Re#'], 'Fa': ['Fa'], 'Sol♭': ['Sol♭', 'Fa#'], 
            'La♭': ['La♭', 'Sol#'], 'Si♭': ['Si♭', 'La#'], 'Do': ['Do']
        },
        'Sol♭': {
            'Sol♭': ['Sol♭', 'Fa#'], 'La♭': ['La♭', 'Sol#'], 'Si♭': ['Si♭', 'La#'], 'Do♭': ['Do♭', 'Si'], 
            'Re♭': ['Re♭', 'Do#'], 'Mi♭': ['Mi♭', 'Re#'], 'Fa': ['Fa']
        },
        
        // Scale con diesis - accetta solo diesis
        'La': {
            'La': ['La'], 'Si': ['Si'], 'Do#': ['Do#'], 'Re': ['Re'], 
            'Mi': ['Mi'], 'Fa#': ['Fa#'], 'Sol#': ['Sol#']
        },
        'Mi': {
            'Mi': ['Mi'], 'Fa#': ['Fa#'], 'Sol#': ['Sol#'], 'La': ['La'], 
            'Si': ['Si'], 'Do#': ['Do#'], 'Re#': ['Re#']
        },
        'Si': {
            'Si': ['Si'], 'Do#': ['Do#'], 'Re#': ['Re#'], 'Mi': ['Mi'], 
            'Fa#': ['Fa#'], 'Sol#': ['Sol#'], 'La#': ['La#']
        }
    };
    
    return scaleNoteMap[scaleName] || null;
}

// Funzione per ottenere il nome della scala corrente
function getCurrentScaleName() {
    var questionElement = document.getElementById('question-4');
    if (questionElement) {
        var questionText = questionElement.textContent;
        var scaleMatch = questionText.match(/Suona la scala di (.+?) maggiore/);
        if (scaleMatch && scaleMatch[1]) {
            return scaleMatch[1];
        }
    }
    return null;
}

// Funzione per convertire le note enarmoniche per la visualizzazione
function convertNoteForDisplay(note, scaleName) {
    // Mappa delle note enarmoniche per le scale con bemolli
    var flatScaleMap = {
        'La♭': {
            'Sol#': 'La♭',
            'La#': 'Si♭',
            'Do#': 'Re♭',
            'Re#': 'Mi♭'
        },
        'Si♭': {
            'La#': 'Si♭',
            'Re#': 'Mi♭'
        },
        'Mi♭': {
            'Re#': 'Mi♭',
            'Sol#': 'La♭',
            'La#': 'Si♭'
        },
        'Re♭': {
            'Do#': 'Re♭',
            'Re#': 'Mi♭',
            'Fa#': 'Sol♭',
            'Sol#': 'La♭',
            'La#': 'Si♭'
        },
        'Sol♭': {
            'Fa#': 'Sol♭',
            'Sol#': 'La♭',
            'La#': 'Si♭',
            'Si': 'Do♭',
            'Do#': 'Re♭',
            'Re#': 'Mi♭'
        }
    };
    
    // Mappa delle note enarmoniche per le scale con diesis
    var sharpScaleMap = {
        'Fa#': {
            'Fa': 'Mi#'
        },
        'Do#': {
            'Fa': 'Mi#',
            'Do': 'Si#'
        },
        'Sol#': {
            'Fa': 'Mi#'
        }
    };
    
    // Se è una scala con bemolli, converte la nota
    if (flatScaleMap[scaleName] && flatScaleMap[scaleName][note]) {
        return flatScaleMap[scaleName][note];
    }
    
    // Se è una scala con diesis, converte la nota
    if (sharpScaleMap[scaleName] && sharpScaleMap[scaleName][note]) {
        return sharpScaleMap[scaleName][note];
    }
    
    // Altrimenti lascia la nota originale
    return note;
}

// Gestione note per le scale (livello 4) - solo normalizzazione ottave
function handleScaleNote(note) {
    console.log('handleScaleNote chiamata con nota:', note);
    console.log('expectedScale:', expectedScale);
    console.log('currentLevel:', currentLevel);
    
    // Verifica che siamo nel livello 4 e che expectedScale sia definita
    if (currentLevel !== 4 || !expectedScale || expectedScale.length === 0) {
        console.log('Errore: livello sbagliato o scala non definita');
        return;
    }
    
    // Normalizza solo le ottave (rimuove i numeri)
    var normalizedNote = normalizeOctave(note);
    
    console.log('Nota normalizzata:', normalizedNote);
    console.log('Note già suonate:', playedNotes);
    
    playedNotes.push(normalizedNote);
    updatePlayedNotesDisplay();
    
    // Controlla se la nota è corretta nella posizione attuale
    var currentPosition = playedNotes.length - 1;
    var expectedNote = expectedScale[currentPosition];
    console.log('Posizione corrente:', currentPosition);
    console.log('Nota attesa:', expectedNote);
    
    // Riconoscimento specifico per scala - ogni scala accetta solo le sue note specifiche
    var noteToCheck = normalizedNote;
    var currentScaleName = getCurrentScaleName();
    var acceptedNotes = getAcceptedNotesForScale(currentScaleName);
    
    console.log('🎵 RICONOSCIMENTO SPECIFICO PER SCALA:');
    console.log('Scala corrente:', currentScaleName);
    console.log('Nota attesa:', expectedNote);
    console.log('Nota suonata:', noteToCheck);
    
    if (acceptedNotes && acceptedNotes[expectedNote]) {
        var allowedNotes = acceptedNotes[expectedNote];
        console.log('Note permesse per', expectedNote, ':', allowedNotes);
        
        if (allowedNotes.includes(noteToCheck)) {
            console.log('✅ Nota accettata per questa scala!', noteToCheck, '=', expectedNote);
            noteToCheck = expectedNote; // Usa la nota attesa per il confronto
        } else {
            console.log('❌ Nota non permessa per questa scala:', noteToCheck);
        }
    } else {
        console.log('⚠️ Scala non mappata, uso confronto diretto');
    }
    
    // Controlla se la nota è corretta
    console.log('=== CONFRONTO NOTE ===');
    console.log('normalizedNote (suonata):', normalizedNote);
    console.log('expectedNote (attesa):', expectedNote);
    console.log('noteToCheck (per confronto):', noteToCheck);
    console.log('Confronto esatto:', noteToCheck === expectedNote);
    console.log('Tipo normalizedNote:', typeof normalizedNote);
    console.log('Tipo expectedNote:', typeof expectedNote);
    console.log('Lunghezza normalizedNote:', normalizedNote.length);
    console.log('Lunghezza expectedNote:', expectedNote.length);
    console.log('======================');
    
    if (noteToCheck === expectedNote) {
        console.log('Nota corretta!');
        // Nota corretta
        console.log('Controllo completamento scala:');
        console.log('playedNotes.length:', playedNotes.length);
        console.log('expectedScale.length:', expectedScale.length);
        console.log('playedNotes:', playedNotes);
        console.log('expectedScale:', expectedScale);
        
        if (playedNotes.length === expectedScale.length) {
            console.log('SCALA COMPLETATA! 🎉');
            // Scala completata correttamente
            exerciseScore++;
            exerciseCount++;
            var feedback = document.getElementById('feedback-4');
            feedback.textContent = 'Scala corretta! (' + exerciseCount + '/' + exerciseTotal + ')';
            feedback.className = 'feedback correct';
            feedback.style.display = 'block';
            
            if (exerciseCount >= exerciseTotal) {
                setTimeout(function() {
                    feedback.textContent = 'Serie completata! Punteggio: ' + exerciseScore + '/' + exerciseTotal;
                }, 1500);
            } else {
                setTimeout(function() {
                    generateNextScaleQuestion();
                }, 2000);
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-' + currentLevel);
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
            }
        } else {
            console.log('Scala non ancora completata, continua...');
        }
    } else {
        console.log('Nota sbagliata!');
        // Nota sbagliata
        exerciseCount++;
        
        // Aggiungi la scala corrente all'array delle scale sbagliate
        var currentScaleQuestion = document.getElementById('question-4').textContent;
        if (currentScaleQuestion && !currentScaleQuestion.startsWith('RIPROVA:')) {
            var scaleName = currentScaleQuestion.match(/Suona la scala di (.+?) maggiore/);
            if (scaleName && scaleName[1]) {
                wrongQuestions[4].push({ question: scaleName[1], answer: expectedScale });
            }
        }
        
        var feedback = document.getElementById('feedback-4');
        feedback.textContent = 'Errore! Nota sbagliata: ' + normalizedNote + '. Nota attesa: ' + expectedNote + '. (' + exerciseCount + '/' + exerciseTotal + ')';
        feedback.className = 'feedback incorrect';
        
        if (exerciseCount >= exerciseTotal) {
            setTimeout(function() {
                feedback.textContent = 'Serie completata! Punteggio: ' + exerciseScore + '/' + exerciseTotal;
            }, 1500);
        } else {
            setTimeout(function() {
                generateNextScaleQuestion();
            }, 2000);
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-' + currentLevel);
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
        }
    }
}

// Aggiornamento display note suonate
function updatePlayedNotesDisplay() {
    var display = document.getElementById('played-notes-4');
    if (display) {
        if (playedNotes.length === 0) {
            display.textContent = '-';
        } else {
            // Ottieni il nome della scala corrente
            var currentScale = getCurrentScaleName();
            
            // Converti le note per la visualizzazione
            var displayNotes = playedNotes.map(function(note) {
                return convertNoteForDisplay(note, currentScale);
            });
            
            display.textContent = displayNotes.join(' - ');
        }
    }
}

// Reset scala corrente
function resetCurrentScale() {
    console.log('Reset scala corrente chiamato');
    console.log('playedNotes prima del reset:', playedNotes);
    playedNotes = [];
    console.log('playedNotes dopo il reset:', playedNotes);
    updatePlayedNotesDisplay();
    var feedback = document.getElementById('feedback-4');
    if (feedback) {
        feedback.className = 'feedback';
        feedback.style.display = 'none';
    }
}

// Generazione domanda tonalità (livello 5)
function generateNextTonalityQuestion() {
    var tonalityNames = Object.keys(keySignatures);
    
    // Prima controlla se ci sono tonalità sbagliate da riproporre
    if (wrongQuestions[5].length > 0) {
        var wrongQuestion = wrongQuestions[5].shift(); // Prendi e rimuovi la prima tonalità sbagliata
        var tonalityInfo = keySignatures[wrongQuestion.question];
        
        // Legge la modalità selezionata dall'utente
        var gameMode = document.getElementById('game-mode-5').value;
        
        var questionElement = document.getElementById('question-5');
        var tonalityDisplay = document.getElementById('tonality-display-5');
        var alterationsDisplay = document.getElementById('alterations-display-5');
        var tonalityInfo5 = document.getElementById('tonality-info-5');
        var answerButtons = document.getElementById('answer-buttons-5');
        
        if (gameMode === 'tonality-to-alterations') {
            // Modalità A: data la tonalità, trova le alterazioni
            questionElement.textContent = 'RIPROVA: Quali sono le alterazioni in chiave di questa tonalità? (' + exerciseCount + '/' + exerciseTotal + ')';
            tonalityDisplay.textContent = wrongQuestion.question;
            alterationsDisplay.textContent = 'Clicca la risposta corretta sotto';
            currentAnswer = tonalityInfo.alterations;
            
            // Mostra solo le opzioni di alterazioni
            showAlterationsOptions();
        } else {
            // Modalità B: date le alterazioni, trova la tonalità  
            questionElement.textContent = 'RIPROVA: Quale tonalità ha queste alterazioni in chiave? (' + exerciseCount + '/' + exerciseTotal + ')';
            tonalityDisplay.textContent = tonalityInfo.alterations;
            alterationsDisplay.textContent = 'Clicca la tonalità corretta sotto';
            currentAnswer = wrongQuestion.question;
            
            // Mostra solo le opzioni di tonalità
            showTonalityOptions();
        }
        
        tonalityInfo5.style.display = 'block';
        answerButtons.style.display = 'block';
        return;
    }
    
            // Filtra le tonalità già utilizzate (escludendo quelle sbagliate)
        var availableTonalities = tonalityNames.filter(function(tonality) {
            return usedQuestions[5].indexOf(tonality) === -1;
        });
        
        // Se tutte le tonalità sono state usate, resetta l'array
        if (availableTonalities.length === 0) {
            usedQuestions[5] = [];
            availableTonalities = tonalityNames;
        }
        
        var randomTonality = availableTonalities[Math.floor(Math.random() * availableTonalities.length)];
        
        // Aggiungi la tonalità all'array delle tonalità usate
        usedQuestions[5].push(randomTonality);
        
        var tonalityInfo = keySignatures[randomTonality];
        
        // Legge la modalità selezionata dall'utente
        var gameMode = document.getElementById('game-mode-5').value;
        
        var questionElement = document.getElementById('question-5');
        var tonalityDisplay = document.getElementById('tonality-display-5');
        var alterationsDisplay = document.getElementById('alterations-display-5');
        var tonalityInfo5 = document.getElementById('tonality-info-5');
        var answerButtons = document.getElementById('answer-buttons-5');
    
    if (gameMode === 'tonality-to-alterations') {
        // Modalità A: data la tonalità, trova le alterazioni
        questionElement.textContent = 'Quali sono le alterazioni in chiave di questa tonalità? (' + exerciseCount + '/' + exerciseTotal + ')';
        tonalityDisplay.textContent = randomTonality;
        alterationsDisplay.textContent = 'Clicca la risposta corretta sotto';
        currentAnswer = tonalityInfo.alterations;
        
        // Mostra solo le opzioni di alterazioni
        showAlterationsOptions();
    } else {
        // Modalità B: date le alterazioni, trova la tonalità  
        questionElement.textContent = 'Quale tonalità ha queste alterazioni in chiave? (' + exerciseCount + '/' + exerciseTotal + ')';
        tonalityDisplay.textContent = tonalityInfo.alterations;
        alterationsDisplay.textContent = 'Clicca la tonalità corretta sotto';
        currentAnswer = randomTonality;
        
        // Mostra solo le opzioni di tonalità
        showTonalityOptions();
    }
    
    tonalityInfo4.style.display = 'block';
    answerButtons.style.display = 'block';
}

// Mostra opzioni per le alterazioni (Modalità A)
function showAlterationsOptions() {
    var answerButtons = document.getElementById('answer-buttons-5');
    answerButtons.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 20px 0;">
            <button class="btn answer-btn" data-answer="nessuna alterazione" style="font-size: 14px; padding: 8px 12px;">Nessuna alterazione</button>
            <button class="btn answer-btn" data-answer="1 diesis: Fa#" style="font-size: 14px; padding: 8px 12px;">1 diesis: Fa#</button>
            <button class="btn answer-btn" data-answer="2 diesis: Fa#, Do#" style="font-size: 14px; padding: 8px 12px;">2 diesis: Fa#, Do#</button>
            <button class="btn answer-btn" data-answer="3 diesis: Fa#, Do#, Sol#" style="font-size: 14px; padding: 8px 12px;">3 diesis: Fa#, Do#, Sol#</button>
            <button class="btn answer-btn" data-answer="4 diesis: Fa#, Do#, Sol#, Re#" style="font-size: 14px; padding: 8px 12px;">4 diesis: Fa#, Do#, Sol#, Re#</button>
            <button class="btn answer-btn" data-answer="5 diesis: Fa#, Do#, Sol#, Re#, La#" style="font-size: 14px; padding: 8px 12px;">5 diesis: Fa#, Do#, Sol#, Re#, La#</button>
            <button class="btn answer-btn" data-answer="6 diesis: Fa#, Do#, Sol#, Re#, La#, Mi#" style="font-size: 14px; padding: 8px 12px;">6 diesis: Fa#, Do#, Sol#, Re#, La#, Mi#</button>
            <button class="btn answer-btn" data-answer="7 diesis: Fa#, Do#, Sol#, Re#, La#, Mi#, Si#" style="font-size: 14px; padding: 8px 12px;">7 diesis: Fa#, Do#, Sol#, Re#, La#, Mi#, Si#</button>
            <button class="btn answer-btn" data-answer="1 bemolle: Si♭" style="font-size: 14px; padding: 8px 12px;">1 bemolle: Si♭</button>
            <button class="btn answer-btn" data-answer="2 bemolli: Si♭, Mi♭" style="font-size: 14px; padding: 8px 12px;">2 bemolli: Si♭, Mi♭</button>
            <button class="btn answer-btn" data-answer="3 bemolli: Si♭, Mi♭, La♭" style="font-size: 14px; padding: 8px 12px;">3 bemolli: Si♭, Mi♭, La♭</button>
            <button class="btn answer-btn" data-answer="4 bemolli: Si♭, Mi♭, La♭, Re♭" style="font-size: 14px; padding: 8px 12px;">4 bemolli: Si♭, Mi♭, La♭, Re♭</button>
            <button class="btn answer-btn" data-answer="5 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭" style="font-size: 14px; padding: 8px 12px;">5 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭</button>
            <button class="btn answer-btn" data-answer="6 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭, Do♭" style="font-size: 14px; padding: 8px 12px;">6 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭, Do♭</button>
            <button class="btn answer-btn" data-answer="7 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭, Do♭, Fa♭" style="font-size: 14px; padding: 8px 12px;">7 bemolli: Si♭, Mi♭, La♭, Re♭, Sol♭, Do♭, Fa♭</button>
        </div>
    `;
    
    // Ricollega gli event listener
    var newButtons = answerButtons.querySelectorAll('.answer-btn');
    for (var i = 0; i < newButtons.length; i++) {
        newButtons[i].addEventListener('click', function() {
            if (currentLevel === 5) {
                handleTonalityAnswer(this.getAttribute('data-answer'));
            }
        });
    }
}

// Mostra opzioni per le tonalità (Modalità B)
function showTonalityOptions() {
    var answerButtons = document.getElementById('answer-buttons-5');
    answerButtons.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 20px 0;">
            <button class="btn answer-btn" data-answer="Do maggiore" style="font-size: 14px; padding: 8px 12px;">Do maggiore</button>
            <button class="btn answer-btn" data-answer="Sol maggiore" style="font-size: 14px; padding: 8px 12px;">Sol maggiore</button>
            <button class="btn answer-btn" data-answer="Re maggiore" style="font-size: 14px; padding: 8px 12px;">Re maggiore</button>
            <button class="btn answer-btn" data-answer="La maggiore" style="font-size: 14px; padding: 8px 12px;">La maggiore</button>
            <button class="btn answer-btn" data-answer="Mi maggiore" style="font-size: 14px; padding: 8px 12px;">Mi maggiore</button>
            <button class="btn answer-btn" data-answer="Si maggiore" style="font-size: 14px; padding: 8px 12px;">Si maggiore</button>
            <button class="btn answer-btn" data-answer="Fa maggiore" style="font-size: 14px; padding: 8px 12px;">Fa maggiore</button>
            <button class="btn answer-btn" data-answer="Si♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Si♭ maggiore</button>
            <button class="btn answer-btn" data-answer="Mi♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Mi♭ maggiore</button>
            <button class="btn answer-btn" data-answer="La♭ maggiore" style="font-size: 14px; padding: 8px 12px;">La♭ maggiore</button>
            <button class="btn answer-btn" data-answer="Re♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Re♭ maggiore</button>
            <button class="btn answer-btn" data-answer="Sol♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Sol♭ maggiore</button>
            <button class="btn answer-btn" data-answer="Do♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Do♭ maggiore</button>
            <button class="btn answer-btn" data-answer="Fa# maggiore" style="font-size: 14px; padding: 8px 12px;">Fa# maggiore</button>
            <button class="btn answer-btn" data-answer="Do# maggiore" style="font-size: 14px; padding: 8px 12px;">Do# maggiore</button>
        </div>
    `;
    
    // Ricollega gli event listener
    var newButtons = answerButtons.querySelectorAll('.answer-btn');
    for (var i = 0; i < newButtons.length; i++) {
        newButtons[i].addEventListener('click', function() {
            if (currentLevel === 5) {
                handleTonalityAnswer(this.getAttribute('data-answer'));
            }
        });
    }
}

// Gestione risposta tonalità
function handleTonalityAnswer(selectedAnswer) {
    var feedback = document.getElementById('feedback-5');
    
    if (selectedAnswer === currentAnswer) {
        exerciseScore++;
        exerciseCount++;
        feedback.textContent = 'Corretto! (' + exerciseCount + '/' + exerciseTotal + ')';
        feedback.className = 'feedback correct';
        feedback.style.display = 'block';
        
        if (exerciseCount >= exerciseTotal) {
            setTimeout(function() {
                feedback.textContent = 'Serie completata! Punteggio: ' + exerciseScore + '/' + exerciseTotal;
            }, 1500);
        } else {
            setTimeout(function() {
                generateNextTonalityQuestion();
            }, 2000);
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-' + currentLevel);
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
        }
    } else {
        exerciseCount++;
        
        // Aggiungi la domanda corrente all'array delle domande sbagliate
        var currentQuestion = document.getElementById('question-5').textContent;
        if (currentQuestion && !currentQuestion.startsWith('RIPROVA:')) {
            var tonalityDisplay = document.getElementById('tonality-display-5');
            var tonalityName = tonalityDisplay.textContent;
            if (tonalityName) {
                wrongQuestions[5].push({ question: tonalityName, answer: currentAnswer });
            }
        }
        
        feedback.textContent = 'Non corretto. La risposta giusta era: ' + currentAnswer;
        feedback.className = 'feedback incorrect';
        feedback.style.display = 'block';
        
        if (exerciseCount >= exerciseTotal) {
            setTimeout(function() {
                feedback.textContent = 'Serie completata! Punteggio: ' + exerciseScore + '/' + exerciseTotal;
            }, 1500);
        } else {
            setTimeout(function() {
                generateNextTonalityQuestion();
            }, 2000);
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-' + currentLevel);
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
        }
    }
}

// Generazione domanda scala (livello 4)
function generateNextScaleQuestion() {
    var scaleNames = Object.keys(majorScales);
    
    // Prima controlla se ci sono scale sbagliate da riproporre
    if (wrongQuestions[4].length > 0) {
        var wrongQuestion = wrongQuestions[4].shift(); // Prendi e rimuovi la prima scala sbagliata
        expectedScale = majorScales[wrongQuestion.question];
        
        var questionElement = document.getElementById('question-4');
        questionElement.textContent = 'RIPROVA: Suona la scala di ' + wrongQuestion.question + ' maggiore (' + exerciseCount + '/' + exerciseTotal + ')';
        
        resetCurrentScale();
        return;
    }
    
    // Filtra le scale già utilizzate (escludendo quelle sbagliate)
    var availableScales = scaleNames.filter(function(scale) {
        return usedQuestions[4].indexOf(scale) === -1;
    });
    
    // Se tutte le scale sono state usate, resetta l'array
    if (availableScales.length === 0) {
        usedQuestions[4] = [];
        availableScales = scaleNames;
    }
    
    var randomScale = availableScales[Math.floor(Math.random() * availableScales.length)];
    
    // Aggiungi la scala all'array delle scale usate
    usedQuestions[4].push(randomScale);
    
    expectedScale = majorScales[randomScale];
    
    console.log('Nuova scala generata:');
    console.log('Nome scala:', randomScale);
    console.log('expectedScale:', expectedScale);
    console.log('Lunghezza scala:', expectedScale.length);
    
    var questionElement = document.getElementById('question-4');
    questionElement.textContent = 'Suona la scala di ' + randomScale + ' maggiore (' + exerciseCount + '/' + exerciseTotal + ')';
    
    resetCurrentScale();
}

// Generazione domanda enarmonia (livello 6)
function generateNextEnharmonicQuestion() {
    var keyNames = Object.keys(enharmonicKeys);
    
    // Prima controlla se ci sono tonalità sbagliate da riproporre
    if (wrongQuestions[6].length > 0) {
        var wrongQuestion = wrongQuestions[6].shift(); // Prendi e rimuovi la prima tonalità sbagliata
        var keyInfo = enharmonicKeys[wrongQuestion.question];
        
        // Legge la modalità selezionata dall'utente
        var gameMode = document.getElementById('game-mode-6').value;
        
        var questionElement = document.getElementById('question-6');
        var tonalityDisplay = document.getElementById('tonality-display-6');
        var alterationsDisplay = document.getElementById('alterations-display-6');
        var tonalityInfo6 = document.getElementById('tonality-info-6');
        var answerButtons = document.getElementById('answer-buttons-6');
        
        if (gameMode === 'complex-to-simple') {
            // Modalità A: data una tonalità complessa, trova la sua forma enarmonica più semplice
            questionElement.textContent = 'RIPROVA: Qual è la forma enarmonica più semplice di questa tonalità? (' + exerciseCount + '/' + exerciseTotal + ')';
            tonalityDisplay.textContent = wrongQuestion.question;
            alterationsDisplay.textContent = 'Clicca la tonalità enarmonica più semplice sotto';
            currentAnswer = keyInfo.enharmonic;
            
            // Mostra opzioni per tonalità semplici
            showSimpleKeyOptions();
        } else {
            // Modalità B: data una tonalità semplice, trova la sua forma enarmonica complessa
            questionElement.textContent = 'RIPROVA: Qual è la forma enarmonica complessa di questa tonalità? (' + exerciseCount + '/' + exerciseTotal + ')';
            tonalityDisplay.textContent = keyInfo.enharmonic;
            alterationsDisplay.textContent = 'Clicca la tonalità enarmonica complessa sotto';
            currentAnswer = wrongQuestion.question;
            
            // Mostra opzioni per tonalità complesse
            showComplexKeyOptions();
        }
        
        tonalityInfo6.style.display = 'block';
        answerButtons.style.display = 'block';
        return;
    }
    
    // Filtra le tonalità già utilizzate (escludendo quelle sbagliate)
    var availableKeys = keyNames.filter(function(key) {
        return usedQuestions[6].indexOf(key) === -1;
    });
    
    // Se tutte le tonalità sono state usate, resetta l'array
    if (availableKeys.length === 0) {
        usedQuestions[6] = [];
        availableKeys = keyNames;
    }
    
    var randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    
    // Aggiungi la tonalità all'array delle tonalità usate
    usedQuestions[6].push(randomKey);
    
    var keyInfo = enharmonicKeys[randomKey];
    
    // Legge la modalità selezionata dall'utente
    var gameMode = document.getElementById('game-mode-6').value;
    
    var questionElement = document.getElementById('question-6');
    var tonalityDisplay = document.getElementById('tonality-display-6');
    var alterationsDisplay = document.getElementById('alterations-display-6');
    var tonalityInfo6 = document.getElementById('tonality-info-6');
    var answerButtons = document.getElementById('answer-buttons-6');
    
    if (gameMode === 'complex-to-simple') {
        // Modalità A: data una tonalità complessa, trova la sua forma enarmonica più semplice
        questionElement.textContent = 'Qual è la forma enarmonica più semplice di questa tonalità? (' + exerciseCount + '/' + exerciseTotal + ')';
        tonalityDisplay.textContent = randomKey;
        alterationsDisplay.textContent = 'Clicca la tonalità enarmonica più semplice sotto';
        currentAnswer = keyInfo.enharmonic;
        
        // Mostra opzioni per tonalità semplici
        showSimpleKeyOptions();
    } else {
        // Modalità B: data una tonalità semplice, trova la sua forma enarmonica complessa
        questionElement.textContent = 'Qual è la forma enarmonica complessa di questa tonalità? (' + exerciseCount + '/' + exerciseTotal + ')';
        tonalityDisplay.textContent = keyInfo.enharmonic;
        alterationsDisplay.textContent = 'Clicca la tonalità enarmonica complessa sotto';
        currentAnswer = randomKey;
        
        // Mostra opzioni per tonalità complesse
        showComplexKeyOptions();
    }
    
    tonalityInfo6.style.display = 'block';
    answerButtons.style.display = 'block';
}

// Mostra opzioni per tonalità semplici (Modalità A)
function showSimpleKeyOptions() {
    var answerButtons = document.getElementById('answer-buttons-6');
    answerButtons.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 20px 0;">
            <button class="btn answer-btn-6" data-answer="Si maggiore" style="font-size: 14px; padding: 8px 12px;">Si maggiore (5 #)</button>
            <button class="btn answer-btn-6" data-answer="Fa maggiore" style="font-size: 14px; padding: 8px 12px;">Fa maggiore (1 ♭)</button>
            <button class="btn answer-btn-6" data-answer="Do maggiore" style="font-size: 14px; padding: 8px 12px;">Do maggiore (nessuna)</button>
            <button class="btn answer-btn-6" data-answer="Sol maggiore" style="font-size: 14px; padding: 8px 12px;">Sol maggiore (1 #)</button>
            <button class="btn answer-btn-6" data-answer="Re maggiore" style="font-size: 14px; padding: 8px 12px;">Re maggiore (2 #)</button>
            <button class="btn answer-btn-6" data-answer="La maggiore" style="font-size: 14px; padding: 8px 12px;">La maggiore (3 #)</button>
            <button class="btn answer-btn-6" data-answer="Mi maggiore" style="font-size: 14px; padding: 8px 12px;">Mi maggiore (4 #)</button>
            <button class="btn answer-btn-6" data-answer="Si♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Si♭ maggiore (2 ♭)</button>
            <button class="btn answer-btn-6" data-answer="Mi♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Mi♭ maggiore (3 ♭)</button>
        </div>
    `;
    
    // Ricollega gli event listener
    var newButtons = answerButtons.querySelectorAll('.answer-btn-6');
    for (var i = 0; i < newButtons.length; i++) {
        newButtons[i].addEventListener('click', function() {
            if (currentLevel === 6) {
                handleEnharmonicAnswer(this.getAttribute('data-answer'));
            }
        });
    }
}

// Mostra opzioni per tonalità complesse (Modalità B)
function showComplexKeyOptions() {
    var answerButtons = document.getElementById('answer-buttons-6');
    answerButtons.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 20px 0;">
            <button class="btn answer-btn-6" data-answer="Do♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Do♭ maggiore (7 ♭)</button>
            <button class="btn answer-btn-6" data-answer="Sol♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Sol♭ maggiore (6 ♭)</button>
            <button class="btn answer-btn-6" data-answer="Re♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Re♭ maggiore (5 ♭)</button>
            <button class="btn answer-btn-6" data-answer="La♭ maggiore" style="font-size: 14px; padding: 8px 12px;">La♭ maggiore (4 ♭)</button>
            <button class="btn answer-btn-6" data-answer="Mi♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Mi♭ maggiore (3 ♭)</button>
            <button class="btn answer-btn-6" data-answer="Do♯ maggiore" style="font-size: 14px; padding: 8px 12px;">Do♯ maggiore (7 #)</button>
            <button class="btn answer-btn-6" data-answer="Fa♯ maggiore" style="font-size: 14px; padding: 8px 12px;">Fa♯ maggiore (6 #)</button>
            <button class="btn answer-btn-6" data-answer="Si maggiore" style="font-size: 14px; padding: 8px 12px;">Si maggiore (5 #)</button>
            <button class="btn answer-btn-6" data-answer="Sol# maggiore" style="font-size: 14px; padding: 8px 12px;">Sol# maggiore (8 #)</button>
            <button class="btn answer-btn-6" data-answer="Re# maggiore" style="font-size: 14px; padding: 8px 12px;">Re# maggiore (9 #)</button>
            <button class="btn answer-btn-6" data-answer="Si♭♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Si♭♭ maggiore (9 ♭)</button>
            <button class="btn answer-btn-6" data-answer="Mi♭♭ maggiore" style="font-size: 14px; padding: 8px 12px;">Mi♭♭ maggiore (10 ♭)</button>
        </div>
    `;
    
    // Ricollega gli event listener
    var newButtons = answerButtons.querySelectorAll('.answer-btn-6');
    for (var i = 0; i < newButtons.length; i++) {
        newButtons[i].addEventListener('click', function() {
            if (currentLevel === 6) {
                handleEnharmonicAnswer(this.getAttribute('data-answer'));
            }
        });
    }
}

// Gestione risposta enarmonia
function handleEnharmonicAnswer(selectedAnswer) {
    var feedback = document.getElementById('feedback-6');
    
    if (selectedAnswer === currentAnswer) {
        exerciseScore++;
        exerciseCount++;
        feedback.textContent = 'Corretto! (' + exerciseCount + '/' + exerciseTotal + ')';
        feedback.className = 'feedback correct';
        feedback.style.display = 'block';
        
        if (exerciseCount >= exerciseTotal) {
            setTimeout(function() {
                feedback.textContent = 'Serie completata! Punteggio: ' + exerciseScore + '/' + exerciseTotal;
            }, 1500);
        } else {
            setTimeout(function() {
                generateNextEnharmonicQuestion();
            }, 2000);
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-' + currentLevel);
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
        }
    } else {
        exerciseCount++;
        
        // Aggiungi la domanda corrente all'array delle domande sbagliate
        var currentQuestion = document.getElementById('question-6').textContent;
        if (currentQuestion && !currentQuestion.startsWith('RIPROVA:')) {
            var tonalityDisplay = document.getElementById('tonality-display-6');
            var tonalityName = tonalityDisplay.textContent;
            if (tonalityName) {
                wrongQuestions[6].push({ question: tonalityName, answer: currentAnswer });
            }
        }
        
        feedback.textContent = 'Non corretto. La risposta giusta era: ' + currentAnswer;
        feedback.className = 'feedback incorrect';
        feedback.style.display = 'block';
        
        if (exerciseCount >= exerciseTotal) {
            setTimeout(function() {
                feedback.textContent = 'Serie completata! Punteggio: ' + exerciseScore + '/' + exerciseTotal;
            }, 1500);
        } else {
            setTimeout(function() {
                generateNextEnharmonicQuestion();
            }, 2000);
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-' + currentLevel);
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
        }
    }
}

// Controllo risposta generica
function checkAnswer(answer) {
    var feedbackId = 'feedback-' + currentLevel;
    var feedback = document.getElementById(feedbackId);
    
    // Debug per capire cosa sta succedendo
    console.log('DEBUG - Livello:', currentLevel);
    console.log('DEBUG - Nota cliccata:', answer);
    console.log('DEBUG - Risposta attesa:', currentAnswer);
    
    // Per il livello 2 (alterazioni), normalizza le note per il confronto
    var normalizedAnswer = answer;
    var normalizedCurrentAnswer = currentAnswer;
    
    if (currentLevel === 1 || currentLevel === 2 || currentLevel === 3) {
        // Rimuovi i numeri delle ottave per il confronto (es: Do2 = Do, Re2 = Re)
        normalizedAnswer = answer.replace(/\d+$/, '');
        normalizedCurrentAnswer = currentAnswer.replace(/\d+$/, '');
        
        // Debug dopo normalizzazione
        console.log('DEBUG - Dopo normalizzazione:');
        console.log('DEBUG - Nota normalizzata:', normalizedAnswer);
        console.log('DEBUG - Risposta normalizzata:', normalizedCurrentAnswer);
    }
    
    // Per il livello 2, gestisci le note enarmoniche
    var isCorrect = false;
    if (currentLevel === 2) {
        // Mappa delle note enarmoniche (stesso suono, nomi diversi)
        var enharmonicMap = {
            'Do#': ['Do#', 'Re♭'],
            'Re#': ['Re#', 'Mi♭'],
            'Fa#': ['Fa#', 'Sol♭'],
            'Sol#': ['Sol#', 'La♭'],
            'La#': ['La#', 'Si♭'],
            'Re♭': ['Re♭', 'Do#'],
            'Mi♭': ['Mi♭', 'Re#'],
            'Sol♭': ['Sol♭', 'Fa#'],
            'La♭': ['La♭', 'Sol#'],
            'Si♭': ['Si♭', 'La#']
        };
        
        // Controlla se la risposta è corretta (inclusi i nomi enarmonici)
        if (enharmonicMap[normalizedCurrentAnswer]) {
            isCorrect = enharmonicMap[normalizedCurrentAnswer].includes(normalizedAnswer);
        } else {
            isCorrect = normalizedAnswer === normalizedCurrentAnswer;
        }
        
        console.log('DEBUG - Note enarmoniche per:', normalizedCurrentAnswer, ':', enharmonicMap[normalizedCurrentAnswer]);
        console.log('DEBUG - Risposta corretta?', isCorrect);
    } else {
        isCorrect = normalizedAnswer === normalizedCurrentAnswer;
    }
    
    if (isCorrect) {
        exerciseScore++;
        exerciseCount++;
        feedback.textContent = 'Corretto! (' + exerciseCount + '/' + exerciseTotal + ')';
        feedback.className = 'feedback correct';
        feedback.style.display = 'block';
        
        if (exerciseCount >= exerciseTotal) {
            // Calcola la percentuale di successo
            var percentage = Math.round((exerciseScore / exerciseTotal) * 100);
            
            if (percentage === 100) {
                // 100% corretto - mostra coriandoli e messaggio speciale
                showConfetti();
                setTimeout(function() {
                    feedback.textContent = '100% giusto!';
                    feedback.className = 'feedback correct';
                    feedback.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                }, 1000);
            } else if (percentage >= 75) {
                // 75%+ corretto
                setTimeout(function() {
                    feedback.textContent = 'Molto bene! (' + exerciseCount + '/' + exerciseTotal + ')';
                }, 1500);
            } else {
                // Sotto 75%
                setTimeout(function() {
                    feedback.textContent = 'Studia ancora prima di proseguire (' + exerciseCount + '/' + exerciseTotal + ')';
                }, 1500);
            }
            
            // Mostra messaggio di completamento
            setTimeout(function() {
                var questionElement = document.getElementById('question-' + currentLevel);
                if (questionElement) {
                    questionElement.textContent = 'Livello completato';
                }
            }, 2000);
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-' + currentLevel);
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
        } else {
            // Progressione automatica alla domanda successiva
            setTimeout(function() {
                if (currentLevel === 1) {
                    generateNextQuestion();
                } else if (currentLevel === 2) {
                    generateNextQuestionLevel2();
                } else if (currentLevel === 3) {
                    generateNextQuestion();
                } else if (currentLevel === 4) {
                    generateNextScaleQuestion();
                } else if (currentLevel === 5) {
                    generateNextTonalityQuestion();
                } else if (currentLevel === 6) {
                    generateNextEnharmonicQuestion();
                }
            }, 1000);
        }
    } else {
        exerciseCount++;
        
        // Aggiungi la domanda corrente all'array delle domande sbagliate
        var currentQuestion = '';
        if (currentLevel === 1) {
            currentQuestion = document.getElementById('question-1').textContent.replace(/\(\d+\/\d+\)$/, '').trim();
        } else if (currentLevel === 2) {
            currentQuestion = document.getElementById('question-2').textContent.replace(/\(\d+\/\d+\)$/, '').trim();
        }
        
        if (currentQuestion && !currentQuestion.startsWith('RIPROVA:')) {
            wrongQuestions[currentLevel].push({ question: currentQuestion, answer: currentAnswer });
        }
        
        // Per i livelli 1, 2 e 3, mostra la risposta corretta senza numero ottava
        var displayAnswer = currentAnswer;
        if (currentLevel === 1 || currentLevel === 2 || currentLevel === 3) {
            displayAnswer = currentAnswer.replace(/\d+$/, '');
        }
        
        // Per il livello 2, mostra anche le note enarmoniche
        if (currentLevel === 2) {
            var enharmonicMap = {
                'Do#': ['Do#', 'Re♭'],
                'Re#': ['Re#', 'Mi♭'],
                'Fa#': ['Fa#', 'Sol♭'],
                'Sol#': ['Sol#', 'La♭'],
                'La#': ['La#', 'Si♭'],
                'Re♭': ['Re♭', 'Do#'],
                'Mi♭': ['Mi♭', 'Re#'],
                'Sol♭': ['Sol♭', 'Fa#'],
                'La♭': ['La♭', 'Sol#'],
                'Si♭': ['Si♭', 'La#']
            };
            
            if (enharmonicMap[displayAnswer]) {
                feedback.textContent = 'Non corretto. Risposte accettabili: ' + enharmonicMap[displayAnswer].join(' o ') + ' (' + exerciseCount + '/' + exerciseTotal + ')';
            } else {
                feedback.textContent = 'Non corretto. Risposta: ' + displayAnswer + ' (' + exerciseCount + '/' + exerciseTotal + ')';
            }
        } else {
            feedback.textContent = 'Non corretto. Risposta: ' + displayAnswer + ' (' + exerciseCount + '/' + exerciseTotal + ')';
        }
        feedback.className = 'feedback incorrect';
        feedback.style.display = 'block';
        
        if (exerciseCount >= exerciseTotal) {
            // Calcola la percentuale di successo
            var percentage = Math.round((exerciseScore / exerciseTotal) * 100);
            
            if (percentage === 100) {
                // 100% corretto - mostra coriandoli e messaggio speciale
                showConfetti();
                setTimeout(function() {
                    feedback.textContent = '100% giusto!';
                    feedback.className = 'feedback correct';
                    feedback.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                }, 1000);
            } else if (percentage >= 75) {
                // 75%+ corretto
                setTimeout(function() {
                    feedback.textContent = 'Molto bene! (' + exerciseCount + '/' + exerciseTotal + ')';
                }, 1500);
            } else {
                // Sotto 75%
                setTimeout(function() {
                    feedback.textContent = 'Studia ancora prima di proseguire (' + exerciseCount + '/' + exerciseTotal + ')';
                }, 1500);
            }
            
            // Mostra messaggio di completamento
            setTimeout(function() {
                var questionElement = document.getElementById('question-' + currentLevel);
                if (questionElement) {
                    questionElement.textContent = 'Livello completato';
                }
            }, 2000);
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-' + currentLevel);
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
        } else {
            // Progressione automatica alla domanda successiva
            setTimeout(function() {
                if (currentLevel === 1) {
                    generateNextQuestion();
                } else if (currentLevel === 2) {
                    generateNextQuestionLevel2();
                } else if (currentLevel === 3) {
                    generateNextQuestion();
                } else if (currentLevel === 4) {
                    generateNextScaleQuestion();
                } else if (currentLevel === 5) {
                    generateNextTonalityQuestion();
                } else if (currentLevel === 6) {
                    generateNextEnharmonicQuestion();
                }
            }, 1000);
        }
    }
}

// Generazione domanda generica
function generateNextQuestion() {
    var exercises1 = [
        // Semitoni ascendenti
        { question: 'Trova un semitono ascendente da Do', answer: 'Do#' },
        { question: 'Trova un semitono ascendente da Do#', answer: 'Re' },
        { question: 'Trova un semitono ascendente da Re', answer: 'Re#' },
        { question: 'Trova un semitono ascendente da Re#', answer: 'Mi' },
        { question: 'Trova un semitono ascendente da Mi', answer: 'Fa' },
        { question: 'Trova un semitono ascendente da Fa', answer: 'Fa#' },
        { question: 'Trova un semitono ascendente da Fa#', answer: 'Sol' },
        { question: 'Trova un semitono ascendente da Sol', answer: 'Sol#' },
        { question: 'Trova un semitono ascendente da Sol#', answer: 'La' },
        { question: 'Trova un semitono ascendente da La', answer: 'La#' },
        { question: 'Trova un semitono ascendente da La#', answer: 'Si' },
        { question: 'Trova un semitono ascendente da Si', answer: 'Do' },
        
        // Semitoni discendenti
        { question: 'Trova un semitono discendente da Do', answer: 'Si' },
        { question: 'Trova un semitono discendente da Do#', answer: 'Do' },
        { question: 'Trova un semitono discendente da Re', answer: 'Do#' },
        { question: 'Trova un semitono discendente da Re#', answer: 'Re' },
        { question: 'Trova un semitono discendente da Mi', answer: 'Re#' },
        { question: 'Trova un semitono discendente da Fa', answer: 'Mi' },
        { question: 'Trova un semitono discendente da Fa#', answer: 'Fa' },
        { question: 'Trova un semitono discendente da Sol', answer: 'Fa#' },
        { question: 'Trova un semitono discendente da Sol#', answer: 'Sol' },
        { question: 'Trova un semitono discendente da La', answer: 'Sol#' },
        { question: 'Trova un semitono discendente da La#', answer: 'La' },
        { question: 'Trova un semitono discendente da Si', answer: 'La#' },
        
        // Toni ascendenti
        { question: 'Trova un tono ascendente da Do', answer: 'Re' },
        { question: 'Trova un tono ascendente da Do#', answer: 'Re#' },
        { question: 'Trova un tono ascendente da Re', answer: 'Mi' },
        { question: 'Trova un tono ascendente da Re#', answer: 'Fa' },
        { question: 'Trova un tono ascendente da Mi', answer: 'Fa#' },
        { question: 'Trova un tono ascendente da Fa', answer: 'Sol' },
        { question: 'Trova un tono ascendente da Fa#', answer: 'Sol#' },
        { question: 'Trova un tono ascendente da Sol', answer: 'La' },
        { question: 'Trova un tono ascendente da Sol#', answer: 'La#' },
        { question: 'Trova un tono ascendente da La', answer: 'Si' },
        { question: 'Trova un tono ascendente da La#', answer: 'Do' },
        { question: 'Trova un tono ascendente da Si', answer: 'Do#' },
        
        // Toni discendenti
        { question: 'Trova un tono discendente da Re', answer: 'Do' },
        { question: 'Trova un tono discendente da Re#', answer: 'Do#' },
        { question: 'Trova un tono discendente da Mi', answer: 'Re' },
        { question: 'Trova un tono discendente da Fa', answer: 'Re#' },
        { question: 'Trova un tono discendente da Fa#', answer: 'Mi' },
        { question: 'Trova un tono discendente da Sol', answer: 'Fa' },
        { question: 'Trova un tono discendente da Sol#', answer: 'Fa#' },
        { question: 'Trova un tono discendente da La', answer: 'Sol' },
        { question: 'Trova un tono discendente da La#', answer: 'Sol#' },
        { question: 'Trova un tono discendente da Si', answer: 'La' },
        { question: 'Trova un tono discendente da Do', answer: 'Si' },
        { question: 'Trova un tono discendente da Do#', answer: 'La' },
        

    ];
    
    var exercises2 = [
        { question: 'Suona: Do#', answer: 'Do#' },
        { question: 'Suona: Re#', answer: 'Re#' },
        { question: 'Suona: Fa#', answer: 'Fa#' },
        { question: 'Suona: Do naturale', answer: 'Do' }
    ];
    
    var exercises = currentLevel === 1 ? exercises1 : exercises2;
    
    // Prima controlla se ci sono domande sbagliate da riproporre
    if (wrongQuestions[currentLevel].length > 0) {
        var wrongQuestion = wrongQuestions[currentLevel].shift(); // Prendi e rimuovi la prima domanda sbagliata
        var exercise = exercises.find(function(ex) {
            return ex.question === wrongQuestion.question;
        });
        
        if (exercise) {
            var questionId = 'question-' + currentLevel;
            document.getElementById(questionId).textContent = 'RIPROVA: ' + exercise.question + ' (' + exerciseCount + '/' + exerciseTotal + ')';
            currentAnswer = exercise.answer;
            return;
        }
    }
    
    // Filtra le domande già utilizzate (escludendo quelle sbagliate)
    var availableExercises = exercises.filter(function(ex) {
        return usedQuestions[currentLevel].indexOf(ex.question) === -1;
    });
    
    // Se tutte le domande sono state usate, resetta l'array
    if (availableExercises.length === 0) {
        usedQuestions[currentLevel] = [];
        availableExercises = exercises;
    }
    
    var exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    
    // Aggiungi la domanda all'array delle domande usate
    usedQuestions[currentLevel].push(exercise.question);
    
    var questionId = 'question-' + currentLevel;
    document.getElementById(questionId).textContent = exercise.question + ' (' + exerciseCount + '/' + exerciseTotal + ')';
    currentAnswer = exercise.answer;
}

// Generazione domanda livello 2 (alterazioni)
function generateNextQuestionLevel2() {
    var questions = [
        // Note alterate con diesis
        'Suona: Do#',
        'Suona: Re#',
        'Suona: Fa#',
        'Suona: Sol#',
        'Suona: La#',
        
        // Note alterate con bemolli
        'Suona: Re♭',
        'Suona: Mi♭',
        'Suona: Sol♭',
        'Suona: La♭',
        'Suona: Si♭'
    ];
    
    // Prima controlla se ci sono domande sbagliate da riproporre
    if (wrongQuestions[2].length > 0) {
        var wrongQuestion = wrongQuestions[2].shift(); // Prendi e rimuovi la prima domanda sbagliata
        var questionElement = document.getElementById('question-2');
        questionElement.textContent = 'RIPROVA: ' + wrongQuestion.question + ' (' + exerciseCount + '/' + exerciseTotal + ')';
        
        // Imposta la risposta corretta (gestisce sia prima che seconda ottava)
        if (wrongQuestion.question.includes('Do#')) currentAnswer = 'Do#';
        else if (wrongQuestion.question.includes('Re#')) currentAnswer = 'Re#';
        else if (wrongQuestion.question.includes('Fa#')) currentAnswer = 'Fa#';
        else if (wrongQuestion.question.includes('Sol#')) currentAnswer = 'Sol#';
        else if (wrongQuestion.question.includes('La#')) currentAnswer = 'La#';
        else if (wrongQuestion.question.includes('Re♭')) currentAnswer = 'Re♭';
        else if (wrongQuestion.question.includes('Mi♭')) currentAnswer = 'Mi♭';
        else if (wrongQuestion.question.includes('Sol♭')) currentAnswer = 'Sol♭';
        else if (wrongQuestion.question.includes('La♭')) currentAnswer = 'La♭';
        else if (wrongQuestion.question.includes('Si♭')) currentAnswer = 'Si♭';
        return;
    }
    
    // Filtra le domande già utilizzate (escludendo quelle sbagliate)
    var availableQuestions = questions.filter(function(q) {
        return usedQuestions[2].indexOf(q) === -1;
    });
    
    // Se tutte le domande sono state usate, resetta l'array
    if (availableQuestions.length === 0) {
        usedQuestions[2] = [];
        availableQuestions = questions;
    }
    
    var randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    // Aggiungi la domanda all'array delle domande usate
    usedQuestions[2].push(randomQuestion);
    
    var questionElement = document.getElementById('question-2');
    questionElement.textContent = randomQuestion + ' (' + exerciseCount + '/' + exerciseTotal + ')';
    
    // Imposta la risposta corretta (gestisce sia prima che seconda ottava)
    if (randomQuestion.includes('Do#')) currentAnswer = 'Do#';
    else if (randomQuestion.includes('Re#')) currentAnswer = 'Re#';
    else if (randomQuestion.includes('Fa#')) currentAnswer = 'Fa#';
    else if (randomQuestion.includes('Sol#')) currentAnswer = 'Sol#';
    else if (randomQuestion.includes('La#')) currentAnswer = 'La#';
    else if (randomQuestion.includes('Re♭')) currentAnswer = 'Re♭';
    else if (randomQuestion.includes('Mi♭')) currentAnswer = 'Mi♭';
    else if (randomQuestion.includes('Sol♭')) currentAnswer = 'Sol♭';
    else if (randomQuestion.includes('La♭')) currentAnswer = 'La♭';
    else if (randomQuestion.includes('Si♭')) currentAnswer = 'Si♭';
}

// Generazione domanda intervalli (livello 3)
function generateNextIntervalQuestion() {
    var intervals = [
        // Intervalli da Do (base)
        { question: 'Qual è l\'intervallo da Do a Re?', answer: '2', note1: 'Do', note2: 'Re' },
        { question: 'Qual è l\'intervallo da Do a Mi?', answer: '3', note1: 'Do', note2: 'Mi' },
        { question: 'Qual è l\'intervallo da Do a Fa?', answer: '4', note1: 'Do', note2: 'Fa' },
        { question: 'Qual è l\'intervallo da Do a Sol?', answer: '5', note1: 'Do', note2: 'Sol' },
        { question: 'Qual è l\'intervallo da Do a La?', answer: '6', note1: 'Do', note2: 'La' },
        { question: 'Qual è l\'intervallo da Do a Si?', answer: '7', note1: 'Do', note2: 'Si' },
        { question: 'Qual è l\'intervallo da Do a Do?', answer: '8', note1: 'Do', note2: 'Do' },
        
        // Intervalli da Do# (diesis)
        { question: 'Qual è l\'intervallo da Do♯ a Re♯?', answer: '2', note1: 'Do#', note2: 'Re#' },
        { question: 'Qual è l\'intervallo da Do♯ a Fa♯?', answer: '4', note1: 'Do#', note2: 'Fa#' },
        { question: 'Qual è l\'intervallo da Do♯ a Sol♯?', answer: '5', note1: 'Do#', note2: 'Sol#' },
        { question: 'Qual è l\'intervallo da Do♯ a La♯?', answer: '6', note1: 'Do#', note2: 'La#' },
        
        // Intervalli da Re (base)
        { question: 'Qual è l\'intervallo da Re a Mi?', answer: '2', note1: 'Re', note2: 'Mi' },
        { question: 'Qual è l\'intervallo da Re a Fa?', answer: '3', note1: 'Re', note2: 'Fa' },
        { question: 'Qual è l\'intervallo da Re a Sol?', answer: '4', note1: 'Re', note2: 'Sol' },
        { question: 'Qual è l\'intervallo da Re a La?', answer: '5', note1: 'Re', note2: 'La' },
        { question: 'Qual è l\'intervallo da Re a Si?', answer: '6', note1: 'Re', note2: 'Si' },
        { question: 'Qual è l\'intervallo da Re a Do?', answer: '7', note1: 'Re', note2: 'Do' },
        
        // Intervalli da Re# (diesis)
        { question: 'Qual è l\'intervallo da Re♯ a Fa♯?', answer: '3', note1: 'Re#', note2: 'Fa#' },
        { question: 'Qual è l\'intervallo da Re♯ a Sol♯?', answer: '4', note1: 'Re#', note2: 'Sol#' },
        { question: 'Qual è l\'intervallo da Re♯ a La♯?', answer: '5', note1: 'Re#', note2: 'La#' },
        
        // Intervalli da Mi (base)
        { question: 'Qual è l\'intervallo da Mi a Fa?', answer: '2', note1: 'Mi', note2: 'Fa' },
        { question: 'Qual è l\'intervallo da Mi a Sol?', answer: '3', note1: 'Mi', note2: 'Sol' },
        { question: 'Qual è l\'intervallo da Mi a La?', answer: '4', note1: 'Mi', note2: 'La' },
        { question: 'Qual è l\'intervallo da Mi a Si?', answer: '5', note1: 'Mi', note2: 'Si' },
        { question: 'Qual è l\'intervallo da Mi a Do?', answer: '6', note1: 'Mi', note2: 'Do' },
        
        // Intervalli da Fa (base)
        { question: 'Qual è l\'intervallo da Fa a Sol?', answer: '2', note1: 'Fa', note2: 'Sol' },
        { question: 'Qual è l\'intervallo da Fa a La?', answer: '3', note1: 'Fa', note2: 'La' },
        { question: 'Qual è l\'intervallo da Fa a Si?', answer: '4', note1: 'Fa', note2: 'Si' },
        { question: 'Qual è l\'intervallo da Fa a Do?', answer: '5', note1: 'Fa', note2: 'Do' },
        
        // Intervalli da Fa# (diesis)
        { question: 'Qual è l\'intervallo da Fa♯ a Sol♯?', answer: '2', note1: 'Fa#', note2: 'Sol#' },
        { question: 'Qual è l\'intervallo da Fa♯ a La♯?', answer: '3', note1: 'Fa#', note2: 'La#' },
        
        // Intervalli da Sol (base)
        { question: 'Qual è l\'intervallo da Sol a La?', answer: '2', note1: 'Sol', note2: 'La' },
        { question: 'Qual è l\'intervallo da Sol a Si?', answer: '3', note1: 'Sol', note2: 'Si' },
        { question: 'Qual è l\'intervallo da Sol a Do?', answer: '4', note1: 'Sol', note2: 'Do' },
        
        // Intervalli da Sol# (diesis)
        { question: 'Qual è l\'intervallo da Sol♯ a La♯?', answer: '2', note1: 'Sol#', note2: 'La#' },
        
        // Intervalli da La (base)
        { question: 'Qual è l\'intervallo da La a Si?', answer: '2', note1: 'La', note2: 'Si' },
        { question: 'Qual è l\'intervallo da La a Do?', answer: '3', note1: 'La', note2: 'Do' },
        
        // Intervalli da La# (diesis)
        { question: 'Qual è l\'intervallo da La♯ a Do?', answer: '3', note1: 'La#', note2: 'Do' },
        
        // Intervalli da Si (base)
        { question: 'Qual è l\'intervallo da Si a Do?', answer: '2', note1: 'Si', note2: 'Do' },
        
        // Intervalli con bemolli (esempi)
        { question: 'Qual è l\'intervallo da Si♭ a Do?', answer: '2', note1: 'Si♭', note2: 'Do' },
        { question: 'Qual è l\'intervallo da Mi♭ a Fa?', answer: '2', note1: 'Mi♭', note2: 'Fa' },
        { question: 'Qual è l\'intervallo da La♭ a Si♭?', answer: '2', note1: 'La♭', note2: 'Si♭' },
        { question: 'Qual è l\'intervallo da Re♭ a Mi♭?', answer: '2', note1: 'Re♭', note2: 'Mi♭' },
        { question: 'Qual è l\'intervallo da Sol♭ a La♭?', answer: '2', note1: 'Sol♭', note2: 'La♭' }
    ];
    
    // Prima controlla se ci sono domande sbagliate da riproporre
    if (wrongQuestions[3].length > 0) {
        var wrongQuestion = wrongQuestions[3].shift(); // Prendi e rimuovi la prima domanda sbagliata
        var questionElement = document.getElementById('question-3');
        questionElement.textContent = 'RIPROVA: ' + wrongQuestion.question + ' (' + exerciseCount + '/' + exerciseTotal + ')';
        currentAnswer = wrongQuestion.answer;
        
        // Mostra i pulsanti di risposta
        var answerButtons = document.getElementById('answer-buttons-3');
        if (answerButtons) {
            answerButtons.style.display = 'block';
        }
        return;
    }
    
    // Filtra le domande già utilizzate (escludendo quelle sbagliate)
    var availableIntervals = intervals.filter(function(interval) {
        return usedQuestions[3].indexOf(interval.question) === -1;
    });
    
    // Se tutte le domande sono state usate, resetta l'array
    if (availableIntervals.length === 0) {
        usedQuestions[3] = [];
        availableIntervals = intervals;
    }
    
    var randomInterval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
    
    // Aggiungi la domanda all'array delle domande usate
    usedQuestions[3].push(randomInterval.question);
    
    var questionElement = document.getElementById('question-3');
    questionElement.textContent = randomInterval.question + ' (' + exerciseCount + '/' + exerciseTotal + ')';
    currentAnswer = randomInterval.answer;
    
    // Mostra i pulsanti di risposta
    var answerButtons = document.getElementById('answer-buttons-3');
    if (answerButtons) {
        answerButtons.style.display = 'block';
    }
}

// Gestione risposta intervalli
function handleIntervalAnswer(selectedInterval) {
    var feedback = document.getElementById('feedback-3');
    
    if (selectedInterval === currentAnswer) {
        exerciseScore++;
        exerciseCount++;
        feedback.textContent = 'Corretto! (' + exerciseCount + '/' + exerciseTotal + ')';
        feedback.className = 'feedback correct';
        feedback.style.display = 'block';
        
        if (exerciseCount >= exerciseTotal) {
            setTimeout(function() {
                feedback.textContent = 'Serie completata! Punteggio: ' + exerciseScore + '/' + exerciseTotal;
            }, 1500);
            
            // Mostra messaggio di completamento e riabilita il pulsante Gioca
            setTimeout(function() {
                var questionElement = document.getElementById('question-3');
                if (questionElement) {
                    questionElement.textContent = 'Livello completato!';
                }
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-3');
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
            }, 2000);
        } else {
            setTimeout(function() {
                generateNextIntervalQuestion();
            }, 1000);
        }
    } else {
        exerciseCount++;
        
        // Aggiungi la domanda corrente all'array delle domande sbagliate
        var currentQuestion = document.getElementById('question-3').textContent;
        if (currentQuestion && !currentQuestion.startsWith('RIPROVA:')) {
            wrongQuestions[3].push({ question: currentQuestion, answer: currentAnswer });
        }
        
        feedback.textContent = 'Non corretto. La risposta giusta era: ' + currentAnswer + '° (' + exerciseCount + '/' + exerciseTotal + ')';
        feedback.className = 'feedback incorrect';
        feedback.style.display = 'block';
        
        if (exerciseCount >= exerciseTotal) {
            setTimeout(function() {
                feedback.textContent = 'Serie completata! Punteggio: ' + exerciseScore + '/' + exerciseTotal;
            }, 1500);
            
            // Mostra messaggio di completamento e riabilita il pulsante Gioca
            setTimeout(function() {
                var questionElement = document.getElementById('question-3');
                if (questionElement) {
                    questionElement.textContent = 'Livello completato!';
                }
                
                // Riabilita il pulsante Gioca
                var playButton = document.getElementById('new-exercise-3');
                if (playButton) {
                    playButton.style.display = 'inline-block';
                    playButton.disabled = false;
                }
            }, 2000);
        } else {
            setTimeout(function() {
                generateNextIntervalQuestion();
            }, 1000);
        }
    }
}

// Inizio nuovo esercizio
function startNewExercise(level) {
    var countId = 'question-count-' + level;
    exerciseTotal = parseInt(document.getElementById(countId).value);
    exerciseCount = 1;
    exerciseScore = 0;
    currentLevel = level;
    
    var feedbackId = 'feedback-' + level;
    var feedback = document.getElementById(feedbackId);
    if (feedback) {
        feedback.className = 'feedback';
        feedback.style.display = 'none';
    }
    
    // Genera automaticamente la prima domanda
    if (level === 2) {
        generateNextQuestionLevel2();
    } else if (level === 3) {
        generateNextIntervalQuestion();
    } else if (level === 4) {
        generateNextScaleQuestion();
    } else if (level === 5) {
        generateNextTonalityQuestion();
    } else if (level === 6) {
        generateNextEnharmonicQuestion();
    } else {
        generateNextQuestion();
    }
}

// Funzione per avviare esercizi automaticamente quando cambia il numero di domande
function autoStartExercise(level) {
    var countId = 'question-count-' + level;
    var newTotal = parseInt(document.getElementById(countId).value);
    
    // Resetta sempre lo stato degli esercizi
    exerciseTotal = newTotal;
    exerciseCount = 0;
    exerciseScore = 0;
    
    // Resetta gli array delle domande per il livello corrente
    usedQuestions[level] = [];
    wrongQuestions[level] = [];
    
    // Pulisci i feedback precedenti
    var feedbackId = 'feedback-' + level;
    var feedback = document.getElementById(feedbackId);
    if (feedback) {
        feedback.className = 'feedback';
        feedback.style.display = 'none';
    }
    
    // Resetta il testo della domanda
    var questionElement = document.getElementById('question-' + level);
    if (questionElement) {
        questionElement.textContent = 'Clicca un tasto per iniziare!';
    }
    
    // Nascondi il pulsante Gioca durante l'esercizio
    var playButton = document.getElementById('new-exercise-' + level);
    if (playButton) {
        playButton.style.display = 'none';
    }
    
    // Avvia automaticamente gli esercizi
    setTimeout(function() {
        if (level === 1) {
            generateNextQuestion();
        } else if (level === 2) {
            generateNextQuestionLevel2();
        } else if (level === 3) {
            generateNextIntervalQuestion();
        } else if (level === 4) {
            generateNextScaleQuestion();
        } else if (level === 5) {
            generateNextTonalityQuestion();
        } else if (level === 6) {
            generateNextEnharmonicQuestion();
        }
    }, 100);
}



// Inizializzazione
window.addEventListener('load', function() {
    // Selettori livello e modalità
    document.getElementById('level-selector').addEventListener('change', function() {
        currentLevel = parseInt(this.value);
        updateSection();
    });
    
    document.getElementById('mode-selector').addEventListener('change', function() {
        currentMode = this.value;
        updateSection();
    });
    
    // Tastiere
    var keys = document.querySelectorAll('.key');
    for (var i = 0; i < keys.length; i++) {
        keys[i].addEventListener('click', function() {
            handleKeyClick(this);
        });
    }
    
    // Pulsanti esercizi
    document.getElementById('new-exercise-1').addEventListener('click', function() {
        startNewExercise(1);
    });
    
    document.getElementById('new-exercise-2').addEventListener('click', function() {
        startNewExercise(2);
    });
    
    document.getElementById('new-exercise-3').addEventListener('click', function() {
        startNewExercise(3);
    });
    
    document.getElementById('new-exercise-4').addEventListener('click', function() {
        startNewExercise(4);
    });
    
    document.getElementById('new-exercise-5').addEventListener('click', function() {
        startNewExercise(5);
    });
    
    document.getElementById('new-exercise-6').addEventListener('click', function() {
        startNewExercise(6);
    });
    
    document.getElementById('reset-scale-4').addEventListener('click', function() {
        resetCurrentScale();
    });
    
    // Pulsanti di risposta per il livello 3 (intervalli)
    var answerButtons3 = document.querySelectorAll('[data-interval]');
    for (var i = 0; i < answerButtons3.length; i++) {
        answerButtons3[i].addEventListener('click', function() {
            if (currentLevel === 3) {
                handleIntervalAnswer(this.getAttribute('data-interval'));
            }
        });
    }
    
    // Pulsanti di risposta per il livello 5 (tonalità)
    var answerButtons = document.querySelectorAll('.answer-btn');
    for (var i = 0; i < answerButtons.length; i++) {
        answerButtons[i].addEventListener('click', function() {
            if (currentLevel === 5) {
                handleTonalityAnswer(this.getAttribute('data-answer'));
            }
        });
    }
    
    // Pulsanti di risposta per il livello 6 (enarmonia)
    var answerButtons6 = document.querySelectorAll('.answer-btn-6');
    for (var i = 0; i < answerButtons6.length; i++) {
        answerButtons6[i].addEventListener('click', function() {
            if (currentLevel === 6) {
                handleEnharmonicAnswer(this.getAttribute('data-answer'));
            }
        });
    }
    
    // Event listeners per i selettori del numero di domande
    document.getElementById('question-count-1').addEventListener('change', function() {
        if (currentLevel === 1 && currentMode === 'practice') {
            autoStartExercise(1);
        }
    });
    
    document.getElementById('question-count-2').addEventListener('change', function() {
        if (currentLevel === 2 && currentMode === 'practice') {
            autoStartExercise(2);
        }
    });
    
    document.getElementById('question-count-3').addEventListener('change', function() {
        if (currentLevel === 3 && currentMode === 'practice') {
            autoStartExercise(3);
        }
    });
    
    document.getElementById('question-count-4').addEventListener('change', function() {
        if (currentLevel === 4 && currentMode === 'practice') {
            autoStartExercise(4);
        }
    });
    
    document.getElementById('question-count-5').addEventListener('change', function() {
        if (currentLevel === 5 && currentMode === 'practice') {
            autoStartExercise(5);
        }
    });
    
    document.getElementById('question-count-6').addEventListener('change', function() {
        if (currentLevel === 6 && currentMode === 'practice') {
            autoStartExercise(6);
        }
    });
    
    // Event listeners per i selettori delle modalità di gioco
    document.getElementById('game-mode-5').addEventListener('change', function() {
        if (currentLevel === 5 && currentMode === 'practice' && exerciseCount > 0) {
            // Riavvia l'esercizio con la nuova modalità
            generateNextTonalityQuestion();
        }
    });
    
    document.getElementById('game-mode-6').addEventListener('change', function() {
        if (currentLevel === 6 && currentMode === 'practice' && exerciseCount > 0) {
            // Riavvia l'esercizio con la nuova modalità
            generateNextEnharmonicQuestion();
        }
    });
    
    // Controllo volume centralizzato
    var volumeControl = document.getElementById('volume-control');
    var volumeValue = document.getElementById('volume-value');
    
    if (volumeControl && volumeValue) {
        volumeControl.addEventListener('input', function() {
            var volume = this.value / 100;
            if (audioContext) {
                audioContext.gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            }
            volumeValue.textContent = this.value + '%';
        });
    }
    
    // Audio inizializzazione
    document.addEventListener('click', function initAudioOnce() {
        initAudio();
        document.removeEventListener('click', initAudioOnce);
    });
    
    updateSection();
});

// Funzione per mostrare i coriandoli
function showConfetti() {
    // Crea particelle di coriandoli
    for (var i = 0; i < 100; i++) {
        setTimeout(function() {
            createConfetti();
        }, i * 30);
    }
}

function createConfetti() {
    var confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 7)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    
    document.body.appendChild(confetti);
    
    // Animazione di caduta
    var animation = confetti.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
        { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 }
    ], {
        duration: 3000,
        easing: 'ease-in'
    });
    
    // Rimuovi il coriandolo dopo l'animazione
    animation.onfinish = function() {
        confetti.remove();
    };
}
